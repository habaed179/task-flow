import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export async function getCommentsForTask(taskId) {
  if (!taskId) return [];
  try {
    const q = query(collection(db, 'comments'), where('taskId', '==', taskId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching comments from Firestore:', error);
    return [];
  }
}

export async function addComment(taskId, author, content) {
  const newRef = doc(collection(db, 'comments'));
  const comment = {
    taskId,
    userId: author.uid,
    userName: author.displayName || 'User',
    content,
    createdAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, comment);
    return { id: newRef.id, ...comment };
  } catch (error) {
    console.error('Error adding comment to Firestore:', error);
    return { id: newRef.id, ...comment };
  }
}

export async function deleteComment(commentId) {
  if (!commentId) return;
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error) {
    console.error('Error deleting comment from Firestore:', error);
  }
}
