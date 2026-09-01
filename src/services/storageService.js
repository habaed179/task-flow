import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../firebase/config';

export const uploadTaskAttachment = async (taskId, file, onProgress) => {
  if (isFirebaseConfigured) {
    const storageRef = ref(storage, `tasks/${taskId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            url: downloadURL,
            uploadedAt: new Date().toISOString(),
          });
        }
      );
    });
  }

  // Fallback demo upload mock
  return new Promise((resolve) => {
    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      if (onProgress) onProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        resolve({
          name: file.name,
          size: file.size || 1024 * 250,
          type: file.type || 'application/pdf',
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
        });
      }
    }, 150);
  });
};
