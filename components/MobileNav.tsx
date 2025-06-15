// components/MobileNav.tsx
'use client';

import React, { useState } from 'react';

interface MobileNavProps {
  onSignOut: () => void;
  isSigningOut: boolean;
  lists: Array<{ id: string; name: string; color: string; count: number }>;
  onListSelect: (listId: string | null) => void;
  selectedListId: string | null;
  filters: Array<{ id: string; label: string }>;
  onFilterSelect: (filterId: string) => void;
  selectedFilterId: string;
  tags: Array<{ id: string; label: string }>;
  onTagSelect: (tagId: string) => void;
  onAddList: () => void;
  onAddTag: () => void;
  onRemoveList: (listId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  onSignOut,
  isSigningOut,
  lists,
  onListSelect,
  selectedListId,
  filters,
  onFilterSelect,
  selectedFilterId,
  tags,
  onTagSelect,
  onAddList,
  onAddTag,
  onRemoveList,
}) => {
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
        <div className="fixed inset-0 z-40 bg-white p-4 overflow-y-auto flex flex-col">
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

          {/* Filters/Search */}
          <div className="relative mb-4">
            <input type="search" placeholder="Search" className="w-full p-2 border rounded pl-8 bg-gray-50" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Tasks</h3>
            <ul>
              {filters.map((filter) => (
                <li
                  key={filter.id}
                  className={`py-2 cursor-pointer rounded-md px-2 ${selectedFilterId === filter.id ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'}`}
                  onClick={() => onFilterSelect(filter.id)}
                >
                  {filter.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Lists Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Lists</h3>
            <ul>
              {lists.map((list) => (
                <li
                  key={list.id}
                  className={`py-2 cursor-pointer rounded-md px-2 flex items-center group transition-colors duration-150 ${selectedListId === list.id ? 'bg-green-500 text-white' : 'hover:bg-gray-100'}`}
                  onClick={() => onListSelect(list.id)}
                >
                  <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: list.color }}></span>
                  {list.name}
                  <span className="ml-auto text-xs text-gray-200 group-hover:text-gray-400">{list.count}</span>
                  <button
                    className={`ml-2 p-1 rounded hover:bg-red-100 ${selectedListId === list.id ? 'text-white hover:text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    onClick={e => { e.stopPropagation(); onRemoveList(list.id); }}
                    aria-label="Delete list"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
              <li
                className="py-2 cursor-pointer hover:bg-gray-100 rounded-md px-2"
                onClick={onAddList}
              >
                + Add New List
              </li>
            </ul>
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer ${/* highlight if selected? */ ''}`}
                  onClick={() => onTagSelect(tag.id)}
                >
                  {tag.label}
                </span>
              ))}
              <span
                className="bg-gray-200 rounded-full px-2 py-1 text-xs cursor-pointer"
                onClick={onAddTag}
              >
                + Add Tag
              </span>
            </div>
          </div>

          {/* Settings & Sign Out */}
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