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
    const q = query(collection(db, 'workspaces'), where('ownerId', '==', userId));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, plan: d.data().plan || 'free', ...d.data() }));
    return list;
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
    
    // Also create workspaceMembers record
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
