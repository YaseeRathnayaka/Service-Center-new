"use client";
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { firebaseApp } from '../../firebaseConfig';
import { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    router.replace('/signin');
  };

  return (
    <header className="w-full h-16 bg-white flex items-center px-8 shadow sticky top-0 z-20">
      <div className="flex-1 flex items-center">
        <div className="relative w-80">
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-50 text-blue-700 placeholder-blue-300 focus:outline-none"
            placeholder="Search..."
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <FaUserCircle className="text-blue-400 text-3xl" />
        {user && (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
} 