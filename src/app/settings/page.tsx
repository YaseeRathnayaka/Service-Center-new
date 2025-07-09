"use client";

import React, { useState, useRef } from "react";
import { getAuth, updateProfile, updatePassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "../../firebaseConfig";
import Button from "../../components/atoms/Button";
import { FaPencilAlt } from "react-icons/fa";
import Image from 'next/image';

export default function SettingsPage() {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<null | "name" | "password" | "photo">(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className=" bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {/* Profile Picture Row */}
      <div className="flex items-center justify-between border-b py-4">
        <div className="flex items-center gap-4">
          <Image
            src={photoURL || "/default-profile.png"}
            alt="Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border"
          />
          <span className="font-medium text-lg text-black">
            Profile Picture
          </span>
        </div>
        {editing === "photo" ? (
          <div className="flex gap-2">
            <Button
              type="button"
              className="px-3 py-1"
              onClick={() => setEditing(null)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            className="text-blue-600 hover:text-blue-800 p-2"
            onClick={() => setEditing("photo")}
            aria-label="Edit profile picture"
          >
            <FaPencilAlt />
          </button>
        )}
      </div>
      {editing === "photo" && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col items-center gap-2 bg-blue-50 border border-blue-200 rounded p-4 my-2"
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="mb-2"
          />
        </form>
      )}
      {/* Name Row */}
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <div className="font-medium text-lg text-black">Name</div>
          <div>{user?.displayName || "-"}</div>
        </div>
        {editing === "name" ? null : (
          <button
            className="text-blue-600 hover:text-blue-800 p-2"
            onClick={() => setEditing("name")}
            aria-label="Edit name"
          >
            <FaPencilAlt />
          </button>
        )}
      </div>
      {editing === "name" && (
        <form
          onSubmit={handleNameChange}
          className="flex gap-2 bg-blue-50 border border-blue-200 rounded p-4 my-2"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full text-black"
          />
          <div className="flex gap-2 justify-end">
            <Button type="submit" className="px-3 py-1">
              Save
            </Button>
            <Button
              type="button"
              className="px-3 py-1"
              variant="secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      {/* Email Row (not editable) */}
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <div className="font-medium text-lg text-black">Email</div>
          <div className="text-gray-700">{email}</div>
        </div>
      </div>
      {/* Password Row */}
      <div className="flex items-center justify-between border-b py-4">
        <div>
          <div className="font-medium text-lg text-black">Password</div>
        </div>
        {editing === "password" ? null : (
          <button
            className="text-blue-600 hover:text-blue-800 p-2"
            onClick={() => setEditing("password")}
            aria-label="Edit password"
          >
            <FaPencilAlt />
          </button>
        )}
      </div>
      {editing === "password" && (
        <form
          onSubmit={handlePasswordChange}
          className="flex gap-2 bg-blue-50 border border-blue-200 rounded p-4 my-2"
        >
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full text-black"
            placeholder="New password"
          />
          <div className="flex gap-2 justify-end">
            <Button type="submit" className="px-3 py-1">
              Save
            </Button>
            <Button
              type="button"
              className="px-3 py-1"
              variant="secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
      {/* Messages */}
      {message && <div className="text-green-600 mb-2 mt-4">{message}</div>}
      {error && <div className="text-red-600 mb-2 mt-4">{error}</div>}
    </div>
  );
}
