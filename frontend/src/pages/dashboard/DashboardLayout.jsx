import React, { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HiViewGridAdd } from "react-icons/hi";
import { MdOutlineManageHistory, MdDashboard, MdLogout } from "react-icons/md";

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActiveRoute = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  const menuItems = [
    { path: '/dashboard', icon: <MdDashboard className="h-6 w-6"/>, title: 'Dashboard' },
    { path: '/dashboard/add-new-book', icon: <HiViewGridAdd className="h-6 w-6"/>, title: 'Add Book' },
    { path: '/dashboard/manage-books', icon: <MdOutlineManageHistory className="h-6 w-6"/>, title: 'Manage Books' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed top-0 left-0 h-screen w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40`}>
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center h-20 bg-purple-600">
          <img src="/fav-icon.png" alt="Logo" className="h-12 w-12" />
        </Link>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActiveRoute(item.path)
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <MdLogout className="h-6 w-6" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-64 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="h-16 px-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;