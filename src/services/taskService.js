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

export async function getTasks(workspaceId = 'demo-workspace') {
  try {
    const q = query(collection(db, 'tasks'), where('workspaceId', '==', workspaceId));
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return list;
  } catch (error) {
    console.error('Error fetching tasks from Firestore:', error);
    return [];
  }
}

export const getTasksForWorkspace = getTasks;

export async function createTask(data, workspaceId = 'demo-workspace', creatorId = 'user') {
  const newRef = doc(collection(db, 'tasks'));
  const task = {
    workspaceId,
    projectId: data.projectId || '',
    title: data.title || 'New Task',
    description: data.description || '',
    status: data.status || 'Todo',
    priority: data.priority || 'Medium',
    category: data.category || 'Work',
    assigneeName: data.assigneeName || '',
    dueDate: data.dueDate || '',
    tags: data.tags || [],
    subtasks: data.subtasks || [],
    estimatedTime: data.estimatedTime || 0,
    trackedTime: data.trackedTime || 0,
    blockedBy: data.blockedBy || null,
    attachments: data.attachments || [],
    completed: data.status === 'Done',
    creatorId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, task);
    return { id: newRef.id, ...task };
  } catch (error) {
    console.error('Error creating task in Firestore:', error);
    return { id: newRef.id, ...task };
  }
}

export async function updateTask(taskId, fields) {
  if (!taskId) return;
  try {
    const ref = doc(db, 'tasks', taskId);
    await updateDoc(ref, {
      ...fields,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating task in Firestore:', error);
  }
}

export async function deleteTask(taskId) {
  if (!taskId) return;
  try {
    const ref = doc(db, 'tasks', taskId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Error deleting task in Firestore:', error);
  }
}
