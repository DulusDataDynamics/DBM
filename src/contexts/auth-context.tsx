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
import { Logo } from '@/components/logo';

interface AuthContextType {
  user: User | null;
  profile: BusinessProfile | null;
  loading: boolean;
  appReady: boolean;
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
  const [appReady, setAppReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        const ref = doc(db, 'profiles', currentUser.uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setProfile(snapshot.data() as BusinessProfile);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
      setAppReady(true);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    router.push('/dashboard');
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
      subscribed: false,
    };

    await setDoc(doc(db, 'profiles', newUser.uid), initialProfile);
    setProfile(initialProfile);
    router.push('/dashboard');
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (!appReady) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
        <Logo />
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            Getting things ready
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
          </p>
          <p className="text-sm text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, appReady, login, signup, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
