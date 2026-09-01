import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.warn('Could not fetch user profile from Firestore:', error?.message || error);
  }
  return null;
}

export async function createUserProfile(userOrUid, data = {}) {
  const uid = typeof userOrUid === 'string' ? userOrUid : userOrUid?.uid;
  if (!uid) return null;

  const email = typeof userOrUid === 'object' ? userOrUid.email : data.email;
  const displayName = data.displayName || (typeof userOrUid === 'object' ? userOrUid.displayName : null) || email?.split('@')[0] || 'TaskFlow User';

  const profile = {
    uid,
    displayName,
    email: (email || '').toLowerCase().trim(),
    photoURL: (typeof userOrUid === 'object' ? userOrUid.photoURL : null) || data.photoURL || '',
    platformRole: data.platformRole || 'platformUser',
    role: data.role || 'member',
    status: data.status || 'active',
  };

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
    return { id: uid, ...profile };
  } catch (error) {
    console.warn('Could not create/update user profile in Firestore:', error?.message || error);
    return { id: uid, ...profile };
  }
}

export const createOrUpdateUserDoc = createUserProfile;

export async function updateUserProfile(uid, data) {
  if (!uid) return;
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Could not update user profile in Firestore:', error?.message || error);
  }
}

export async function deleteUserProfile(uid) {
  if (!uid) return;
  try {
    // 1. Get user email before deleting profile
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    const userEmail = snap.exists() ? snap.data().email?.toLowerCase()?.trim() : null;

    // Delete user profile doc
    await deleteDoc(userDocRef);

    // 2. Find and delete all pending/existing invitations sent to this user email
    if (userEmail) {
      try {
        const invQuery = query(collection(db, 'invitations'), where('email', '==', userEmail));
        const invSnap = await getDocs(invQuery);
        for (const iDoc of invSnap.docs) {
          await deleteDoc(doc(db, 'invitations', iDoc.id));
        }
      } catch (e) {}
    }

    // 3. Find and delete owned workspaces & associated tasks, projects, invitations
    const wsQuery = query(collection(db, 'workspaces'), where('ownerId', '==', uid));
    const wsSnap = await getDocs(wsQuery);
    for (const wsDoc of wsSnap.docs) {
      const wsId = wsDoc.id;
      // Delete tasks in workspace
      try {
        const tasksQuery = query(collection(db, 'tasks'), where('workspaceId', '==', wsId));
        const tasksSnap = await getDocs(tasksQuery);
        for (const tDoc of tasksSnap.docs) {
          await deleteDoc(doc(db, 'tasks', tDoc.id));
        }
      } catch (e) {}

      // Delete projects in workspace
      try {
        const projQuery = query(collection(db, 'projects'), where('workspaceId', '==', wsId));
        const projSnap = await getDocs(projQuery);
        for (const pDoc of projSnap.docs) {
          await deleteDoc(doc(db, 'projects', pDoc.id));
        }
      } catch (e) {}

      // Delete invitations created in workspace
      try {
        const wsInvQuery = query(collection(db, 'invitations'), where('workspaceId', '==', wsId));
        const wsInvSnap = await getDocs(wsInvQuery);
        for (const iDoc of wsInvSnap.docs) {
          await deleteDoc(doc(db, 'invitations', iDoc.id));
        }
      } catch (e) {}

      // Delete workspace document itself
      await deleteDoc(doc(db, 'workspaces', wsId));
    }
  } catch (error) {
    console.warn('Could not clean user profile, invitations and workspaces from Firestore:', error?.message || error);
  }
}
