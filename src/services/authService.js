import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';

// Mock auth fallback if Firebase API keys are not yet configured in .env
const MOCK_USER_STORAGE_KEY = 'taskflow_auth_user';

export const loginWithEmail = async (email, password) => {
  if (isFirebaseConfigured) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
  // Mock login fallback
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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  }
  // Mock registration fallback
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
    return userCredential.user;
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

export const resetPassword = async (email) => {
  if (isFirebaseConfigured) {
    await sendPasswordResetEmail(auth, email);
  }
  return true;
};
