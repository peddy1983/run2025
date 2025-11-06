import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏃</span>
            <span className="text-xl font-bold text-primary-600">跑步揪團</span>
          </Link>

          {/* 使用者資訊 */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/my-activities" className="flex items-center space-x-2">
                  {user.photoURL && (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.displayName}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  登出
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 底部導航列（手機版） */}
      {user && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-around">
              <Link
                to="/"
                className={`flex-1 flex flex-col items-center justify-center py-3 text-base font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-primary-600 border-b-3 border-primary-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="leading-tight">首頁</span>
              </Link>
              <Link
                to="/create"
                className={`flex-1 flex flex-col items-center justify-center py-3 text-base font-medium transition-colors ${
                  isActive('/create') 
                    ? 'text-primary-600 border-b-3 border-primary-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="leading-tight">我要</span>
                <span className="leading-tight">揪團</span>
              </Link>
              <Link
                to="/my-activities"
                className={`flex-1 flex flex-col items-center justify-center py-3 text-base font-medium transition-colors ${
                  isActive('/my-activities') 
                    ? 'text-primary-600 border-b-3 border-primary-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="leading-tight">我的</span>
                <span className="leading-tight">活動</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

