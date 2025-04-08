import { Link } from "react-router-dom";
import { HiMiniBars3CenterLeft, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";

import avatarImg from "../assets/avatar.png"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useGetWishlistQuery } from '../redux/features/wishlist/wishlistApi';

const mainNavigation = [
    { name: "Home", href: "/" },
    { name: "Books", href: "/books" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

const navigation = [
    {name: "Dashboard", href:"/user-dashboard"},
    {name: "Orders", href:"/orders"},
    {name: "Wishlist", href:"/wishlist"},
    {name: "Cart Page", href:"/cart"},
    {name: "Check Out", href:"/checkout"},
]

const Navbar = () => {

    const  [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const cartItems = useSelector(state => state.cart.cartItems);
   
    const {currentUser, logout} = useAuth()
    const { data: wishlistItems = [] } = useGetWishlistQuery(currentUser?.uid, {
        skip: !currentUser,
    });
    
    const handleLogOut = () => {
        logout()
    }

    const token = localStorage.getItem('token');
  
    return (
        <header className="sticky top-0 z-50 backdrop-blur-glass bg-white/80 shadow-glass">
            <nav className="max-w-screen-2xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Left side */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-secondary hover:text-primary transition-colors">
                            <HiMiniBars3CenterLeft className="w-7 h-7" />
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {mainNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="text-gray-600 hover:text-primary font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {
                                currentUser ? <>
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center">
                                    <img src={avatarImg} alt="user" className={`size-7 rounded-full ${currentUser ? 'ring-2 ring-blue-500' : ''}`} />
                                </button>
                                {
                                    isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                                            <ul className="py-2">
                                                {
                                                    navigation.map((item) => (
                                                        <li key={item.name} onClick={() => setIsDropdownOpen(false)}>
                                                            <Link to={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))
                                                }
                                                <li>
                                                    <button
                                                    onClick={handleLogOut}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                                                </li>
                                            </ul>
                                        </div>
                                    )
                                }
                                </> : token ?  <Link to="/dashboard" className='border-b-2 border-primary'>Dashboard</Link> : (
                                    <Link to="/login"> <HiOutlineUser className="size-6" /></Link>
                                )
                            }
                        </div>
                        
                        <Link 
                            to="/wishlist" 
                            className="hidden sm:flex items-center gap-2 hover:text-accent transition-colors relative group"
                        >
                            <HiOutlineHeart className="w-6 h-6" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/cart" 
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark rounded-xl text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <HiOutlineShoppingCart className="w-5 h-5" />
                            <span>{cartItems.length || 0}</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;