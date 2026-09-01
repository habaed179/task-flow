import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAfOfkXnj1F3El-M1lfTan4CMU0Eszbkzo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'task-flow-32223.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'task-flow-32223',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'task-flow-32223.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1013370272594',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1013370272594:web:06edb447540a54c8d5188b',
};

export const isFirebaseConfigured = true;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
