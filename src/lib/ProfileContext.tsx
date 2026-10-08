"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
}

const defaultProfile: ProfileData = {
  name: "Student User",
  email: "student@futurepath.app",
  phone: "0712345678",
  age: "22",
  gender: "Prefer not to say",
  idNumber: "",
  province: "Gauteng",
  city: "Johannesburg",
  photoUrl: null,
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  setProfile: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
