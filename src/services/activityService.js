import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export async function getActivities(workspaceId = 'demo-workspace') {
  try {
    const q = query(collection(db, 'activities'), where('workspaceId', '==', workspaceId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching activity logs from Firestore:', error);
    return [];
  }
}

export async function logActivity(actor, action, target, workspaceId = 'demo-workspace') {
  const newRef = doc(collection(db, 'activities'));
  const log = {
    workspaceId,
    actorId: actor.uid || 'system',
    actorName: actor.displayName || 'System User',
    action,
    target,
    timestamp: new Date().toISOString(),
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, log);
    return { id: newRef.id, ...log };
  } catch (error) {
    console.error('Error logging activity to Firestore:', error);
    return { id: newRef.id, ...log };
  }
}
