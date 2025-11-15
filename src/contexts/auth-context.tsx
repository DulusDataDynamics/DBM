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
  loading: boolean; // This remains for UI feedback during login/signup, but not for init
  initializing: boolean; // This is the new flag for initial app load
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<BusinessProfile | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(false); // For actions like login/signup
  const [initializing, setInitializing] = useState(true); // For the initial auth check
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const ref = doc(db, 'profiles', currentUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setProfile(snap.data() as BusinessProfile);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("Failed to load profile:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      // This is crucial: set initializing to false only after everything is done.
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle the rest
    setLoading(false);
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
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
    // onAuthStateChanged will handle setting user, then we can redirect
    router.push('/dashboard');
    setLoading(false);
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (initializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center flex-col gap-4 bg-background">
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
    <AuthContext.Provider value={{ user, profile, loading, initializing, login, signup, logout, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
