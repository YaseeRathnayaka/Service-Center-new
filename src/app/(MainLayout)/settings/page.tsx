"use client";

import React, { useState, useRef } from "react";
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "../../../firebaseConfig";
import Button from "../../../components/atoms/Button";
import Image from "next/image";

export default function SettingsPage() {
  const [user, setUser] = useState<ReturnType<typeof getAuth>["currentUser"] | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<null | "name" | "password" | "photo">(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const authInstance = getAuth(firebaseApp);
      setUser(authInstance.currentUser);
      setName(authInstance.currentUser?.displayName || "");
      setEmail(authInstance.currentUser?.email || "");
      setPhotoURL(authInstance.currentUser?.photoURL || "");
    }
  }, []);

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (!user) throw new Error("No user");
      await updateProfile(user, { displayName: name });
      setMessage("Name updated successfully");
      setEditing(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (!user) throw new Error("No user");
      await updatePassword(user, newPassword);
      setMessage("Password updated successfully");
      setNewPassword("");
      setEditing(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      setPhotoURL(url);
      setMessage("Profile picture updated successfully");
      setEditing(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to update profile picture");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-[80vh] bg-white py-10">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center tracking-tight">Settings</h1>
        
        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Profile</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <Image
                src={photoURL || "/default-profile.png"}
                alt="Profile"
                width={72}
                height={72}
                className="w-20 h-20 rounded-xl object-cover border-2 border-blue-200 shadow-md"
              />
              <button
                className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition"
                onClick={() => setEditing("photo")}
                aria-label="Edit profile picture"
              >
                Edit
              </button>
            </div>
            <div>
              <div className="text-gray-900 text-xl font-semibold mb-1">{user?.displayName || "-"}</div>
              <div className="text-gray-600 text-sm">{email}</div>
            </div>
          </div>
          {editing === "photo" && (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4"
            >
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="mb-2 text-gray-700"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(null)}
                disabled={loading}
              >
                Cancel
              </Button>
            </form>
          )}
        </section>

        {/* Account Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Account</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <div className="text-gray-900 font-medium">Name</div>
                <div className="text-gray-600 text-sm">{user?.displayName || "-"}</div>
              </div>
              {editing === "name" ? null : (
                <Button variant="secondary" onClick={() => setEditing("name")}>Edit</Button>
              )}
            </div>
            {editing === "name" && (
              <form
                onSubmit={handleNameChange}
                className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
                <div className="flex gap-2 justify-end">
                  <Button type="submit" variant="primary" disabled={loading}>Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(null)} disabled={loading}>Cancel</Button>
                </div>
              </form>
            )}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <div className="text-gray-900 font-medium">Email</div>
                <div className="text-gray-600 text-sm">{email}</div>
              </div>
              {/* Email not editable */}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Security</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div>
                <div className="text-gray-900 font-medium">Password</div>
                <div className="text-gray-600 text-sm">••••••••</div>
              </div>
              {editing === "password" ? null : (
                <Button variant="secondary" onClick={() => setEditing("password")}>Change</Button>
              )}
            </div>
            {editing === "password" && (
              <form
                onSubmit={handlePasswordChange}
                className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  placeholder="New password"
                />
                <div className="flex gap-2 justify-end">
                  <Button type="submit" variant="primary" disabled={loading}>Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditing(null)} disabled={loading}>Cancel</Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Feedback Messages */}
        {(message || error) && (
          <div className={`mt-8 text-center rounded-xl px-4 py-3 font-medium ${message ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message || error}
          </div>
        )}
      </div>
    </div>
  );
}
