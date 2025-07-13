"use client";
import '@fontsource/inter/400.css';
import '@fontsource/poppins/latin-400.css';
import '../globals.css';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { firebaseApp } from '../../firebaseConfig';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signOut(auth);
        router.replace('/signin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark"
        className="custom-toast-container"
        style={{
          zIndex: 9999,
        }}
      />
    </div>
  );
}
