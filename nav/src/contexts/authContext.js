import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
// import { GoogleAuthProvider } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });

      // check if provider is email and password login
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      // Add user data to firestore
      const userData = user.toJSON();

      const userRef = doc(db, "users", userData.uid);
      try {
        const response = await updateDoc(userRef, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      } catch (error) {
        if (error.code === "not-found") {
          const resp = await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            latest_conversation_id: 0,
            is_admin: false,
          });
        }
      }

      // check if the auth provider is google or not
      //   const isGoogle = user.providerData.some(
      //     (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
      //   );
      //   setIsGoogleUser(isGoogle);

      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
