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
        setTimeout(() => router.push("/login"), 1200);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow w-full max-w-sm mx-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-blue-900">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>
      {mode === "signup" && (
        <div className="mb-4">
          <label className="block mb-1 text-gray-800">Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded text-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-1 text-gray-800">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-gray-800">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded text-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {mode === "signup" && (
        <div className="mb-4">
          <label className="block mb-1 text-gray-800">Confirm Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded text-gray-800"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Login"
          : "Sign Up"}
      </button>
      {mode === "login" && (
        <div className="mt-4 text-center">
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Don&apos;t have an account? Sign up
          </a>
        </div>
      )}
    </form>
  );
}
