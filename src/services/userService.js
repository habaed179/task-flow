import { db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
  }
  return null;
}

export async function createUserProfile(uid, data) {
  if (!uid) return null;
  const userDocRef = doc(db, 'users', uid);
  const profile = {
    uid,
    displayName: data.displayName || 'TaskFlow User',
    email: data.email || '',
    photoURL: data.photoURL || '',
    platformRole: data.platformRole || 'platformUser',
    role: data.role || 'member',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(userDocRef, profile, { merge: true });
    return { id: uid, ...profile };
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
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
    console.error('Error updating user profile in Firestore:', error);
  }
}
