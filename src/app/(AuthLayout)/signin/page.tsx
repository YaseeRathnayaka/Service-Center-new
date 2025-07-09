import React from "react";
import AuthLayout from "../AuthLayout";
import AuthForm from "../../../components/auth/AuthForm";

export default function SignInPage() {
  return (
    <AuthLayout>
      <AuthForm mode="login" />
    </AuthLayout>
  );
} 