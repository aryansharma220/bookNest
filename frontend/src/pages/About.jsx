import React from 'react'
import { HiOutlineBookOpen, HiOutlineUsers, HiOutlineLightBulb } from 'react-icons/hi'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            About Our Bookstore
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            Dedicated to bringing you the finest collection of books to inspire, educate, and entertain.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <HiOutlineBookOpen className="w-8 h-8" />,
              title: "Vast Selection",
              description: "Thousands of books across all genres"
            },
            {
              icon: <HiOutlineUsers className="w-8 h-8" />,
              title: "Community",
              description: "Join our community of book lovers"
            },
            {
              icon: <HiOutlineLightBulb className="w-8 h-8" />,
              title: "Expert Picks",
              description: "Curated selections by book experts"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Books" },
              { number: "1000+", label: "Members" },
              { number: "50+", label: "Events" },
              { number: "4.9", label: "Rating" }
            ].map((stat, index) => (
              <div key={index} className="group hover:transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
