import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { deleteUserProfile, createUserProfile } from './userService';

const MOCK_USER_STORAGE_KEY = 'taskflow_auth_user';

export const loginWithEmail = async (email, password) => {
  if (isFirebaseConfigured) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createUserProfile(user);
    return user;
  }
  const mockUser = {
    uid: 'user-hassan-demo',
    email: email || 'hassan@taskflow.dev',
    displayName: email ? email.split('@')[0] : 'Hassan Obaed',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const registerWithEmail = async (email, password, displayName) => {
  if (isFirebaseConfigured) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      await createUserProfile(userCredential.user, { displayName });
      return userCredential.user;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        // Attempt sign-in to re-activate account if password matches
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          if (displayName) {
            await updateProfile(userCredential.user, { displayName });
          }
          await createUserProfile(userCredential.user, { displayName });
          return userCredential.user;
        } catch (loginErr) {
          throw err; // Throw original email-in-use error if password fails
        }
      }
      throw err;
    }
  }
  const mockUser = {
    uid: `user-${Date.now()}`,
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: '',
    role: 'member',
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const loginWithGoogle = async () => {
  if (isFirebaseConfigured) {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    await createUserProfile(user);
    return user;
  }
  const mockUser = {
    uid: 'google-user-123',
    email: 'alex.dev@gmail.com',
    displayName: 'Alex Rivers',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const logoutUser = async () => {
  if (isFirebaseConfigured) {
    await signOut(auth);
  }
  window.localStorage.removeItem(MOCK_USER_STORAGE_KEY);
};

export const deleteUserAccount = async (uid) => {
  if (uid) {
    await deleteUserProfile(uid);
  }
  if (auth.currentUser) {
    try {
      await deleteUser(auth.currentUser);
    } catch (err) {
      console.warn('Firebase Auth delete user notice:', err?.message || err);
      try {
        await signOut(auth);
      } catch (e) {}
    }
  }
  window.localStorage.removeItem(MOCK_USER_STORAGE_KEY);
};

export const resetPassword = async (email) => {
  if (isFirebaseConfigured) {
    await sendPasswordResetEmail(auth, email);
  }
  return true;
};
