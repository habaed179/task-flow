import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export async function getProjects(workspaceId = 'demo-workspace') {
  try {
    const q = query(collection(db, 'projects'), where('workspaceId', '==', workspaceId));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return list;
  } catch (error) {
    console.error('Error fetching projects from Firestore:', error);
    return [];
  }
}

export const getProjectsForWorkspace = getProjects;

export async function createProject(data, workspaceId = 'demo-workspace', createdBy = 'user') {
  const newRef = doc(collection(db, 'projects'));
  const proj = {
    workspaceId,
    name: data.name || 'Untitled Project',
    description: data.description || '',
    status: data.status || 'Active',
    priority: data.priority || 'Medium',
    dueDate: data.dueDate || '',
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, proj);
    return { id: newRef.id, ...proj };
  } catch (error) {
    console.error('Error creating project in Firestore:', error);
    return { id: newRef.id, ...proj };
  }
}

export async function updateProject(projectId, fields) {
  if (!projectId) return;
  try {
    const ref = doc(db, 'projects', projectId);
    await updateDoc(ref, {
      ...fields,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating project in Firestore:', error);
  }
}

export async function deleteProject(projectId) {
  if (!projectId) return;
  try {
    const ref = doc(db, 'projects', projectId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Error deleting project in Firestore:', error);
  }
}
