import React, { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export function Header({ title, onBack }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-blue-600 hover:underline font-semibold mb-2"
          >
            ← 뒤로
          </button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded"
        >
          <Menu size={20} /> 마이페이지
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-48 z-50">
            <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
            <button
              onClick={() => {
                logout();
                setShowDropdown(false);
              }}
              className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded"
            >
              <LogOut size={18} /> 로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}