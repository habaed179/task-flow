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

export async function getWorkspacesForUser(userId) {
  if (!userId) return [];
  try {
    const q1 = query(collection(db, 'workspaces'), where('ownerId', '==', userId));
    const snap1 = await getDocs(q1);
    const owned = snap1.docs.map((d) => ({ id: d.id, plan: d.data().plan || 'free', ...d.data() }));

    const snapAll = await getDocs(collection(db, 'workspaces'));
    const joined = snapAll.docs
      .filter((d) => {
        const members = d.data().members || [];
        return members.some((m) => m.id === userId);
      })
      .map((d) => ({ id: d.id, plan: d.data().plan || 'free', ...d.data() }));

    const map = new Map();
    [...owned, ...joined].forEach((w) => map.set(w.id, w));
    return Array.from(map.values());
  } catch (error) {
    console.error('Error fetching workspaces from Firestore:', error);
    return [];
  }
}

export async function createWorkspace(data, ownerId) {
  const newRef = doc(collection(db, 'workspaces'));
  const workspaceData = {
    name: data.name || 'New Workspace',
    description: data.description || '',
    ownerId,
    plan: 'free',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    members: [
      { id: ownerId, name: data.userName || 'Workspace Leader', email: data.userEmail || '', role: 'Owner' }
    ]
  };

  try {
    await setDoc(newRef, workspaceData);
    
    const memberRef = doc(collection(db, 'workspaceMembers'));
    await setDoc(memberRef, {
      workspaceId: newRef.id,
      userId: ownerId,
      role: 'Owner',
      status: 'active',
      joinedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    return { id: newRef.id, ...workspaceData };
  } catch (error) {
    console.error('Error creating workspace in Firestore:', error);
    return { id: newRef.id, ...workspaceData };
  }
}

export async function updateWorkspace(workspaceId, data) {
  if (!workspaceId) return;
  try {
    const ref = doc(db, 'workspaces', workspaceId);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating workspace in Firestore:', error);
  }
}
