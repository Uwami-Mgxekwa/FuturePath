"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  idNumber: string;
  province: string;
  city: string;
  photoUrl: string | null;
}

interface ProfileContextType {
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;
  loading: boolean;
}

const defaultProfile: ProfileData = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  idNumber: "",
  province: "",
  city: "",
  photoUrl: null,
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  setProfile: () => {},
  loading: true,
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Try to get full profile from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              name: data.name || user.displayName || "",
              email: data.email || user.email || "",
              phone: data.phone || "",
              age: data.age ? String(data.age) : "",
              gender: data.gender || "",
              idNumber: data.idNumber || "",
              province: data.province || "",
              city: data.city || "",
              photoUrl: data.photoUrl || user.photoURL || null,
            });
          } else {
            // Firestore doc doesn't exist yet — use Firebase Auth data
            setProfile({
              ...defaultProfile,
              name: user.displayName || "",
              email: user.email || "",
              photoUrl: user.photoURL || null,
            });
          }
        } catch {
          // Fallback to auth data if Firestore fails
          setProfile({
            ...defaultProfile,
            name: user.displayName || "",
            email: user.email || "",
            photoUrl: user.photoURL || null,
          });
        }
      } else {
        setProfile(defaultProfile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
