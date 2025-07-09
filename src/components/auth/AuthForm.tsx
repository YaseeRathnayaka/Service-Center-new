"use client";

import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "../../firebaseConfig";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const auth = getAuth(firebaseApp);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Optionally redirect or show success
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
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
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
      </button>
    </form>
  );
}
