"use client";
import { FaSearch, FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaChevronDown, FaTimes } from 'react-icons/fa';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { firebaseApp } from '../../firebaseConfig';
import { useEffect, useState } from 'react';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSettingsNavigation = (path: string) => {
    setShowSettings(false);
    router.push(path);
  };

  // Sample notifications data
  const notifications = [
    { id: 1, title: 'New appointment', message: 'Appointment #1234 scheduled for tomorrow', time: '2 min ago', type: 'info' },
    { id: 2, title: 'Service completed', message: 'Vehicle service #5678 has been completed', time: '1 hour ago', type: 'success' },
    { id: 3, title: 'System update', message: 'System will be updated at 2:00 AM', time: '3 hours ago', type: 'warning' },
  ];

  return (
    <header className="w-full h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center px-6 shadow-2xl border-b border-slate-700/50 sticky top-0 z-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      {/* Search Section */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="relative w-96">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
              placeholder="Search for anything..."
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {/* Search suggestions dropdown */}
          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl z-50">
              <div className="p-3">
                <div className="text-slate-400 text-sm">Searching for {searchQuery}...</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="relative z-10 ml-auto flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
              setShowUserMenu(false);
            }}
            className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
          >
            <FaBell className="text-lg" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl z-50">
              <div className="p-4 border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 border-b border-slate-600/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' : 
                        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{notification.title}</div>
                        <div className="text-slate-300 text-xs mt-1">{notification.message}</div>
                        <div className="text-slate-400 text-xs mt-2">{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-600/50">
                <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
            className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
          >
            <FaCog className="text-lg" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl z-50">
              <div className="p-4 border-b border-slate-600/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Settings</h3>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => handleSettingsNavigation('/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <FaUserCircle className="text-slate-400 group-hover:text-blue-400" />
                  <span>Account Settings</span>
                </button>
                <button 
                  onClick={() => handleSettingsNavigation('/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <FaCog className="text-slate-400 group-hover:text-green-400" />
                  <span>System Settings</span>
                </button>
                <button 
                  onClick={() => handleSettingsNavigation('/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <FaBell className="text-slate-400 group-hover:text-purple-400" />
                  <span>Notification Settings</span>
                </button>
                <div className="border-t border-slate-600/50 my-2"></div>
                <button 
                  onClick={() => handleSettingsNavigation('/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                >
                  <FaCog className="text-slate-400 group-hover:text-orange-400" />
                  <span>Preferences</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowSettings(false);
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/50 border border-slate-600/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FaUserCircle className="text-white text-sm" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">{user.displayName || user.email}</div>
                <div className="text-xs text-slate-300">Online</div>
              </div>
              <FaChevronDown className={`text-xs transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600/50 shadow-2xl z-50">
                <div className="p-4 border-b border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FaUserCircle className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.displayName || 'User'}</div>
                      <div className="text-slate-300 text-sm">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group">
                    <FaUserCircle className="text-slate-400 group-hover:text-blue-400" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group">
                    <FaCog className="text-slate-400 group-hover:text-green-400" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-slate-600/50 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200 group"
                  >
                    <FaSignOutAlt className="text-red-400 group-hover:text-red-300" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications || showSettings) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
            setShowSettings(false);
          }}
        />
      )}
    </header>
  );
} 