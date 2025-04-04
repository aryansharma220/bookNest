import React from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FaBook, FaHome, FaPlus, FaSignOutAlt } from 'react-icons/fa'

const SellerDashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('sellerToken');
        // Force navigation to home page and reset history
        window.location.href = '/';
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-lg">
                <div className="p-6 bg-green-600">
                    <h2 className="text-2xl font-semibold text-white">Seller Portal</h2>
                </div>
                <nav className="mt-6">
                    {[
                        { path: '/seller-dashboard', icon: <FaHome/>, label: 'Overview' },
                        { path: '/seller-dashboard/my-books', icon: <FaBook/>, label: 'My Books' },
                        { path: '/seller-dashboard/add-book', icon: <FaPlus/>, label: 'Add New Book' },
                    ].map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 ${
                                isActive(item.path) ? 'bg-green-50 text-green-700 border-r-4 border-green-600' : ''
                            }`}
                        >
                            <span className="text-xl mr-3">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 w-full text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                        <FaSignOutAlt className="text-xl mr-3"/>
                        Logout
                    </button>
                </nav>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default SellerDashboardLayout
