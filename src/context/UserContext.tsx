import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl?: string; // data URL or remote URL
};

type UserContextType = {
  profile: UserProfile;
  setProfile: (u: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  password: string | null; // demo storage; DO NOT use in production
  updatePassword: (next: string) => void;
};

const defaultProfile: UserProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  bio: 'Financial enthusiast focused on long-term wealth building and smart investment strategies.',
  avatarUrl: undefined,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const raw = localStorage.getItem('fineo_user_profile');
    return raw ? JSON.parse(raw) : defaultProfile;
  });
  const [password, setPassword] = useState<string | null>(() => {
    return localStorage.getItem('fineo_user_password');
  });

  useEffect(() => {
    localStorage.setItem('fineo_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (password == null) {
      localStorage.removeItem('fineo_user_password');
    } else {
      localStorage.setItem('fineo_user_password', password);
    }
  }, [password]);

  const updateProfile = (partial: Partial<UserProfile>) => setProfile((p) => ({ ...p, ...partial }));
  const updatePassword = (next: string) => setPassword(next);

  const value = useMemo(() => ({ profile, setProfile, updateProfile, password, updatePassword }), [profile, password]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
