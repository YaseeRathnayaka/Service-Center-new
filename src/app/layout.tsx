import '@fontsource/inter/400.css';
import '@fontsource/poppins/latin-400.css';
import './globals.css';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      </body>
    </html>
  );
}
