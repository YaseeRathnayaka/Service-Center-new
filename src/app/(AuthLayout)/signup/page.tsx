import React from "react";
import AuthLayout from "../AuthLayout";
import AuthForm from "../../../components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthForm mode="signup" />
    </AuthLayout>
  );
} 