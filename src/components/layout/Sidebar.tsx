"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaCalendarAlt, FaTools, FaUserCog, FaUsers, FaBoxes, FaBell, FaCog, FaSignOutAlt, FaCarSide, FaIdBadge } from 'react-icons/fa';

const sections = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: <FaTachometerAlt /> },
      { name: 'Appointments', href: '/appointments', icon: <FaCalendarAlt /> },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Services', href: '/services', icon: <FaTools /> },
      { name: 'Mechanics', href: '/mechanics', icon: <FaUserCog /> },
      { name: 'Vehicles', href: '/vehicles', icon: <FaCarSide /> },
      { name: 'Inventory', href: '/inventory', icon: <FaBoxes /> },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Customers', href: '/customers', icon: <FaUsers /> },
      { name: 'Employees', href: '/employees', icon: <FaIdBadge /> },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Notifications', href: '/notifications', icon: <FaBell /> },
      { name: 'Settings', href: '/settings', icon: <FaCog /> },
      { name: 'Log Out', href: '/logout', icon: <FaSignOutAlt /> },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-blue-100 flex flex-col shadow-lg">
      <div className="flex flex-col gap-6 mt-8">
        {sections.map(section => (
          <div key={section.label}>
            <div className="px-6 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2 select-none">
              {section.label}
            </div>
            <div className="flex flex-col gap-1">
              {section.items.map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-lg mx-2 font-medium text-blue-700 transition text-[15px] hover:shadow-sm
                    ${pathname === item.href ? 'bg-white shadow' : 'hover:bg-blue-50'}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
} 