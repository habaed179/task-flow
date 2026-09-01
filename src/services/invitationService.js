import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export async function sendInvitation({ workspaceId, email, role = 'Member', invitedBy = 'Admin' }) {
  if (!workspaceId || !email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const newRef = doc(collection(db, 'invitations'));
  const invData = {
    workspaceId,
    email: cleanEmail,
    role,
    invitedBy,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };

  try {
    await setDoc(newRef, invData);
    return { id: newRef.id, ...invData };
  } catch (error) {
    console.error('Error creating invitation in Firestore:', error);
    return null;
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
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((inv) => inv.email && inv.email.toLowerCase().trim() === cleanEmail);
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
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
    if (!invSnap.exists()) return false;

    const inv = invSnap.data();
    if (inv.status !== 'pending') return false;

    const invEmail = (inv.email || '').toLowerCase().trim();
    const userEmail = (user.email || '').toLowerCase().trim();

    if (invEmail && userEmail && invEmail !== userEmail) {
      throw new Error(`Invitation is for ${invEmail}, but logged in as ${userEmail}.`);
    }

    // Atomically update invitation and add workspace member
    await updateDoc(invRef, {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      acceptedByUid: user.uid,
    });

    // Add user to workspace members array in workspaces document
    const wsRef = doc(db, 'workspaces', inv.workspaceId);
    const wsSnap = await getDoc(wsRef);
    if (wsSnap.exists()) {
      const existingMembers = wsSnap.data().members || [];
      const isAlreadyMember = existingMembers.some((m) => m.id === user.uid || (m.email && m.email.toLowerCase().trim() === userEmail));
      if (!isAlreadyMember) {
        const newMember = {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Member',
          email: user.email,
          role: inv.role || 'Member',
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
      joinedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error accepting invitation in Firestore:', error);
    return false;
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
