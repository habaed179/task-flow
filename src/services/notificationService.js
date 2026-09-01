import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export async function getNotificationsForUser(userId) {
  if (!userId) return [];
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching notifications from Firestore:', error);
    return [];
  }
}

export async function createNotification({ userId, title, message, type = 'info' }) {
  const newRef = doc(collection(db, 'notifications'));
  const notif = {
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, notif);
    return { id: newRef.id, ...notif };
  } catch (error) {
    console.error('Error creating notification in Firestore:', error);
    return { id: newRef.id, ...notif };
  }
}

export async function markNotificationAsRead(notificationId) {
  if (!notificationId) return;
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error marking notification as read in Firestore:', error);
  }
}

export const markNotificationRead = markNotificationAsRead;
