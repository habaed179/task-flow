import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { PLANS } from '../utils/constants';

export async function sendInvitation({ workspaceId, email, role = 'Member', invitedBy = 'Admin', userUid = '' }) {
  if (!workspaceId || !email) {
    throw new Error('Workspace ID and email address are required.');
  }

  const cleanEmail = email.toLowerCase().trim();
  if (role === 'Owner') {
    throw new Error('You cannot invite a member with the Workspace Leader / Owner role.');
  }

  // 1. Check workspace existence
  const wsRef = doc(db, 'workspaces', workspaceId);
  const wsSnap = await getDoc(wsRef);
  if (!wsSnap.exists()) {
    throw new Error('Target workspace does not exist.');
  }
  const wsData = wsSnap.data();

  // 2. Check plan member limit
  const currentPlan = PLANS.find((p) => p.id === (wsData.plan || 'free')) || PLANS[0];
  const memberLimit = currentPlan.limits?.members || 3;
  const currentMembersCount = wsData.members?.length || 1;

  if (currentMembersCount >= memberLimit) {
    throw new Error(`Your ${currentPlan.name} plan limit is ${memberLimit} members. Upgrade your plan to invite more team members.`);
  }

  // 3. Check if user is already a member of this workspace
  const existingMembers = wsData.members || [];
  const isAlreadyMember = existingMembers.some(
    (m) => (m.email && m.email.toLowerCase().trim() === cleanEmail) || m.id === userUid
  );
  if (isAlreadyMember) {
    throw new Error('This user is already a member of this workspace.');
  }

  // 4. Check for duplicate pending invitation
  const pendingQuery = query(
    collection(db, 'invitations'),
    where('workspaceId', '==', workspaceId),
    where('email', '==', cleanEmail),
    where('status', '==', 'pending')
  );
  const pendingSnap = await getDocs(pendingQuery);
  if (!pendingSnap.empty) {
    throw new Error('An invitation is already pending for this email address.');
  }

  // 5. Create new invitation document
  const newRef = doc(collection(db, 'invitations'));
  const invData = {
    workspaceId,
    email: cleanEmail,
    role,
    invitedBy: invitedBy || 'Workspace Leader',
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days expiration
    acceptedAt: null,
    declinedAt: null,
    revokedAt: null,
  };

  try {
    await setDoc(newRef, invData);
    return { id: newRef.id, ...invData };
  } catch (error) {
    console.error('Error creating invitation in Firestore:', error);
    throw new Error('Failed to create invitation in database.');
  }
}

export async function getPendingInvitationsForUser(email) {
  if (!email) return [];
  try {
    const cleanEmail = email.toLowerCase().trim();
    const q = query(
      collection(db, 'invitations'),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    const now = new Date().toISOString();

    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((inv) => {
        const matchesEmail = inv.email && inv.email.toLowerCase().trim() === cleanEmail;
        const notExpired = !inv.expiresAt || inv.expiresAt > now;
        return matchesEmail && notExpired;
      });
  } catch (error) {
    console.error('Error fetching user invitations from Firestore:', error);
    return [];
  }
}

export async function getInvitationsForWorkspace(workspaceId) {
  if (!workspaceId) return [];
  try {
    const q = query(
      collection(db, 'invitations'),
      where('workspaceId', '==', workspaceId),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    const now = new Date().toISOString();

    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((inv) => !inv.expiresAt || inv.expiresAt > now);
  } catch (error) {
    console.error('Error fetching workspace invitations from Firestore:', error);
    return [];
  }
}

export async function acceptInvitation(invitationId, user) {
  if (!invitationId || !user?.uid) return false;
  try {
    const invRef = doc(db, 'invitations', invitationId);
    const invSnap = await getDoc(invRef);
    if (!invSnap.exists()) {
      throw new Error('Invitation document does not exist.');
    }

    const inv = invSnap.data();
    if (inv.status !== 'pending') {
      throw new Error(`Invitation is no longer pending (status: ${inv.status}).`);
    }

    const now = new Date().toISOString();
    if (inv.expiresAt && inv.expiresAt <= now) {
      await updateDoc(invRef, { status: 'expired' });
      throw new Error('Invitation has expired. Please ask the Workspace Leader for a new invitation.');
    }

    const invEmail = (inv.email || '').toLowerCase().trim();
    const userEmail = (user.email || '').toLowerCase().trim();
    if (invEmail && userEmail && invEmail !== userEmail) {
      throw new Error(`Invitation is intended for ${invEmail}, but logged in as ${userEmail}.`);
    }

    // Atomically update invitation status
    await updateDoc(invRef, {
      status: 'accepted',
      acceptedAt: now,
      acceptedByUid: user.uid,
    });

    // Add user to workspace members array in workspaces collection
    const wsRef = doc(db, 'workspaces', inv.workspaceId);
    const wsSnap = await getDoc(wsRef);
    if (wsSnap.exists()) {
      const existingMembers = wsSnap.data().members || [];
      const isAlreadyMember = existingMembers.some(
        (m) => m.id === user.uid || (m.email && m.email.toLowerCase().trim() === userEmail)
      );
      if (!isAlreadyMember) {
        const newMember = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Member',
          email: user.email,
          role: inv.role || 'Member',
          joinedAt: now,
        };
        await updateDoc(wsRef, {
          members: [...existingMembers, newMember],
          updatedAt: serverTimestamp(),
        });
      }
    }

    // Create workspaceMembers document
    const memberRef = doc(collection(db, 'workspaceMembers'));
    await setDoc(memberRef, {
      workspaceId: inv.workspaceId,
      userId: user.uid,
      role: inv.role || 'Member',
      status: 'active',
      joinedAt: now,
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error accepting invitation in Firestore:', error);
    throw error;
  }
}

export async function declineInvitation(invitationId) {
  if (!invitationId) return false;
  try {
    const invRef = doc(db, 'invitations', invitationId);
    await updateDoc(invRef, {
      status: 'declined',
      declinedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error declining invitation in Firestore:', error);
    return false;
  }
}

export async function revokeInvitation(invitationId) {
  if (!invitationId) return false;
  try {
    const invRef = doc(db, 'invitations', invitationId);
    await updateDoc(invRef, {
      status: 'revoked',
      revokedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error revoking invitation in Firestore:', error);
    return false;
  }
}

export async function resendInvitation(invitationId) {
  if (!invitationId) return false;
  try {
    const invRef = doc(db, 'invitations', invitationId);
    await updateDoc(invRef, {
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error resending invitation in Firestore:', error);
    return false;
  }
}
