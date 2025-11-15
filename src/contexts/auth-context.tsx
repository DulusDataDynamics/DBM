'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { BusinessProfile } from '@/lib/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  profile: BusinessProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<BusinessProfile | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data() as BusinessProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the rest
  };

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    const initialProfile: BusinessProfile = {
      companyName: '',
      ownerName: '',
      businessEmail: newUser.email || '',
      businessPhone: '',
      businessAddress: '',
      website: '',
      taxNumber: '',
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      branchCode: '',
      defaultCurrency: 'ZAR',
      defaultTaxRate: 15,
    };
    await setDoc(doc(db, 'profiles', newUser.uid), initialProfile);
    setProfile(initialProfile);
    // onAuthStateChanged will handle the rest
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, signup, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
