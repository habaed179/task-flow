import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';
import { loginWithEmail, registerWithEmail, loginWithGoogle, logoutUser, resetPassword } from '../services/authService';
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
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profile = await createOrUpdateUserDoc(user);
          setCurrentUser(user);
          setUserProfile(profile);
          localStorage.setItem('taskflow_auth_user', JSON.stringify({ uid: user.uid, email: user.email, displayName: user.displayName }));
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          localStorage.removeItem('taskflow_auth_user');
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Fallback demo user if Firebase config is unconfigured
      if (currentUser) {
        setUserProfile({
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Hassan Obaed',
          email: currentUser.email || 'hassan@taskflow.dev',
          photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: 'admin',
        });
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      const profile = await getUserProfile(user.uid);
      setCurrentUser(user);
      setUserProfile(profile);
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
      setUserProfile(profile);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      const profile = await createOrUpdateUserDoc(user);
      setCurrentUser(user);
      setUserProfile(profile);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setUserProfile(null);
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
