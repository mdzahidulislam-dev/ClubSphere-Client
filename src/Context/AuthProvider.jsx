import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const googleProvider = new GoogleAuthProvider();

  const createUserWithEmailAndPasswordfunc = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithEmailAndPasswordFunc = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogleFunc = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signOutFunc = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateProfileFunc = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };

  const sendPasswordResetEmailFunc = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    loading,
    setLoading,
    updateProfileFunc,
    user,
    setUser,
    createUserWithEmailAndPasswordfunc,
    signInWithEmailAndPasswordFunc,
    signInWithGoogleFunc,
    signOutFunc,
    sendPasswordResetEmailFunc,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
