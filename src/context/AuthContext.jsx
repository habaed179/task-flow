import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { loginWithEmail, registerWithEmail, loginWithGoogle, logoutUser, deleteUserAccount, resetPassword } from '../services/authService';
import { getUserProfile, createOrUpdateUserDoc } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile?.deleted || profile?.status === 'deleted') {
          await logoutUser();
          setCurrentUser(null);
          setUserProfile(null);
          localStorage.removeItem('taskflow_auth_user');
          setLoading(false);
          return;
        }

        const updatedProfile = await createOrUpdateUserDoc(user);
        setCurrentUser(user);
        setUserProfile(updatedProfile || {
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          role: 'member',
        });
        localStorage.setItem(
          'taskflow_auth_user',
          JSON.stringify({ uid: user.uid, email: user.email, displayName: user.displayName })
        );
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('taskflow_auth_user');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      const profile = await getUserProfile(user.uid);
      if (profile?.deleted || profile?.status === 'deleted') {
        await logoutUser();
        throw new Error('This account has been deleted and can no longer log in.');
      }
      setCurrentUser(user);
      setUserProfile(profile || {
        uid: user.uid,
        displayName: user.displayName || email.split('@')[0],
        email: user.email || email,
        role: 'member',
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, displayName) => {
    setLoading(true);
    try {
      const user = await registerWithEmail(email, password, displayName);
      const profile = await createOrUpdateUserDoc(user, { displayName });
      setCurrentUser(user);
      setUserProfile(profile || {
        uid: user.uid,
        displayName: displayName || email.split('@')[0],
        email: email,
        role: 'member',
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      const profile = await getUserProfile(user.uid);
      if (profile?.deleted || profile?.status === 'deleted') {
        await logoutUser();
        throw new Error('This account has been deleted and can no longer log in.');
      }
      const updatedProfile = await createOrUpdateUserDoc(user);
      setCurrentUser(user);
      setUserProfile(updatedProfile || {
        uid: user.uid,
        displayName: user.displayName || user.email?.split('@')[0],
        email: user.email,
        role: 'member',
      });
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('taskflow_auth_user');
  };

  const deleteAccount = async () => {
    const uid = currentUser?.uid;
    await deleteUserAccount(uid);
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('taskflow_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        login,
        register,
        loginGoogle,
        logout,
        deleteAccount,
        resetPassword,
        isAdmin: userProfile?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
