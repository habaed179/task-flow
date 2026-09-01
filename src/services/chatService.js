import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export function subscribeToWorkspaceChats(workspaceId, callback, messageLimit = 50) {
  if (!workspaceId) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'workspaceChats'),
      where('workspaceId', '==', workspaceId),
      limit(messageLimit)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort client-side by timestamp to prevent composite index blocking
        messages.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        callback(messages);
      },
      (error) => {
        console.error('Error listening to team chats:', error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up team chat listener:', error);
    callback([]);
    return () => {};
  }
}

export async function sendChatMessage({ workspaceId, senderId, senderName, senderAvatar, text }) {
  if (!workspaceId || !senderId || !text?.trim()) return null;

  const newRef = doc(collection(db, 'workspaceChats'));
  const msgData = {
    workspaceId,
    senderId,
    senderName: senderName || 'Team Member',
    senderAvatar: senderAvatar || '',
    text: text.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(newRef, msgData);
    return { id: newRef.id, ...msgData };
  } catch (error) {
    console.error('Error sending team chat message:', error);
    return null;
  }
}
