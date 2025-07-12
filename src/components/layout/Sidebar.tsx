"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaTools, 
  FaBell, 
  FaCog, 
  FaSignOutAlt, 
  FaCarSide, 
  FaIdBadge,
  FaUsers,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';

const sections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/', icon: <FaTachometerAlt />, description: 'System overview' },
      { name: 'Appointments', href: '/appointments', icon: <FaCalendarAlt />, description: 'Manage bookings' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Services', href: '/services', icon: <FaTools />, description: 'Service management' },
      { name: 'Vehicles', href: '/vehicles', icon: <FaCarSide />, description: 'Vehicle database' },
    ],
  },
  {
    label: 'People',
    items: [
      { name: 'Employees', href: '/employees', icon: <FaIdBadge />, description: 'Staff management' },
      { name: 'Customers', href: '/customers', icon: <FaUsers />, description: 'Customer database' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Log Out', href: '/logout', icon: <FaSignOutAlt />, description: 'Sign out' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(['Overview', 'Operations', 'People', 'System']);

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionLabel) 
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col shadow-2xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <FaTools className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Service Center</h1>
            <p className="text-slate-400 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-none hide-scrollbar">
        {sections.map(section => (
          <div key={section.label} className="space-y-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.label)}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-white transition-all duration-200 group"
            >
              <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                {section.label}
              </span>
              <div className="transform transition-transform duration-200 group-hover:scale-110">
                {expandedSections.includes(section.label) ? (
                  <FaChevronDown className="text-xs" />
                ) : (
                  <FaChevronRight className="text-xs" />
                )}
              </div>
            </button>

            {/* Section Items */}
            <div className={`space-y-1 transition-all duration-300 ease-in-out ${
              expandedSections.includes(section.label) 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
              {section.items.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] hover:translate-x-1
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-blue-500/30' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                    )}
                    
                    {/* Icon */}
                    <div className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-600/50 group-hover:text-white'
                    }`}>
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <p className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                        {item.description}
                      </p>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-slate-700/50">
        <div className="bg-slate-800/50 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">SC</span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Service Center</p>
              <p className="text-slate-400 text-xs">v2.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
} 