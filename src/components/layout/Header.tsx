import { FaSearch, FaUserCircle } from 'react-icons/fa';

export default function Header() {
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
      <div className="ml-auto">
        <FaUserCircle className="text-blue-400 text-3xl" />
      </div>
    </header>
  );
} 