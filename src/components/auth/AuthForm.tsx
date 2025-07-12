"use client";

import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseApp } from "../../firebaseConfig";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const auth = getAuth(firebaseApp);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        setSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => router.push("/signin"), 1200);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Authentication failed");
      } else {
        setError("Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white text-2xl font-bold">SC</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-700">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-slate-600 mt-2">
          {mode === "login" 
            ? "Sign in to your account to continue" 
            : "Join us and get started today"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signup" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Full Name
            </label>
          <input
            type="text"
              className="block w-full px-4 py-3 border-2 border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-slate-700 font-medium"
              placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Email Address
          </label>
        <input
          type="email"
            className="block w-full px-4 py-3 border-2 border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-slate-700 font-medium"
            placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div className="relative">
        <input
              type={showPassword ? "text" : "password"}
              className="block w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-slate-700 font-medium"
              placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
      </div>

      {mode === "signup" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
          <input
                type={showConfirmPassword ? "text" : "password"}
                className="block w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-slate-700 font-medium"
                placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-md p-4">
            <span className="text-red-700 text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-md p-4">
            <span className="text-green-700 text-sm font-medium">{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-blue-600 shadow-lg"
      >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Please wait...</span>
            </div>
          ) : (
            mode === "login" ? "Sign In" : "Create Account"
          )}
      </button>

      {mode === "login" && (
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Don&apos;t have an account?{" "}
          <a
            href="/signup"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
          >
                Sign up here
              </a>
            </p>
          </div>
        )}

        {mode === "signup" && (
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
              >
                Sign in here
          </a>
            </p>
        </div>
      )}
    </form>
    </div>
  );
}
