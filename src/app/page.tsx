"use client";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in.</div>;
  }

  return <div>Welcome back!</div>;
}
