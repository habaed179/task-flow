import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

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
    email: email || '',
    photoURL: (typeof userOrUid === 'object' ? userOrUid.photoURL : null) || data.photoURL || '',
    platformRole: data.platformRole || 'platformUser',
    role: data.role || 'member',
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
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.warn('Could not delete user profile from Firestore:', error?.message || error);
  }
}
