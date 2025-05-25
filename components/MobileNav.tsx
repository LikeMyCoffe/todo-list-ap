// components/MobileNav.tsx
'use client';

import React, { useState } from 'react';

interface MobileNavProps {
  onSignOut: () => void;
  isSigningOut: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ onSignOut, isSigningOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-green-500 text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative mb-4">
            <input type="search" placeholder="Search" className="w-full p-2 border rounded pl-8 bg-gray-50" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Tasks</h3>
            <ul>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">Upcoming</li>
              <li className="py-2 cursor-pointer bg-gray-100 rounded-md px-2">Today</li>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">Calendar</li>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">Sticky Wall</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Lists</h3>
            <ul>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Personal
              </li>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Work
              </li>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 flex items-center">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> List 1
              </li>
              <li className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">+ Add New List</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">Tag 1</span>
              <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">Tag 2</span>
              <span className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer">+ Add Tag</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2">Settings</div>
            <div
              className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 text-red-500"
              onClick={onSignOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;