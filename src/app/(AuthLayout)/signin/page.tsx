"use client";
import React, { useEffect } from "react";
import AuthLayout from "../AuthLayout";
import AuthForm from "../../../components/auth/AuthForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp } from "../../../firebaseConfig";

export default function SignInPage() {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  );
} 