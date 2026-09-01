import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const rawKey = import.meta.env.VITE_FIREBASE_API_KEY;
const apiKey = (rawKey && rawKey.trim().length > 10) ? rawKey.trim() : 'AIzaSyAfOfkXnj1F3El-M1lfTan4CMU0Eszbkzo';

const rawDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const authDomain = (rawDomain && rawDomain.trim()) ? rawDomain.trim() : 'task-flow-32223.firebaseapp.com';

const rawProject = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const projectId = (rawProject && rawProject.trim()) ? rawProject.trim() : 'task-flow-32223';

const rawBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const storageBucket = (rawBucket && rawBucket.trim()) ? rawBucket.trim() : 'task-flow-32223.firebasestorage.app';

const rawSender = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const messagingSenderId = (rawSender && rawSender.trim()) ? rawSender.trim() : '1013370272594';

const rawAppId = import.meta.env.VITE_FIREBASE_APP_ID;
const appId = (rawAppId && rawAppId.trim()) ? rawAppId.trim() : '1:1013370272594:web:06edb447540a54c8d5188b';

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

export const isFirebaseConfigured = true;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
