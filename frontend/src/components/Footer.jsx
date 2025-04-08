import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 py-4 px-6 border-t border-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-gray-400">© 2024 BookStore</p>

          {/* Navigation */}
          <ul className="flex items-center gap-6">
            <li><Link to="/" className="text-sm hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link to="/books" className="text-sm hover:text-blue-600 transition-colors">Books</Link></li>
            <li><Link to="/about" className="text-sm hover:text-blue-600 transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-sm hover:text-blue-600 transition-colors">Contact</Link></li>
          </ul>

        </div>
      </div>
    </footer>
  )
}

export default Footer