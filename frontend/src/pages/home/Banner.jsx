import React from 'react'
import bannerImg from "../../assets/banner.png"

const Banner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"/>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-3xl"/>
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 max-w-7xl mx-auto p-16">
        <div className='md:w-1/2 text-white space-y-6'>
          <h1 className='md:text-6xl text-3xl font-bold leading-tight'>
            Discover Your Next 
            <span className="text-primary block mt-2">Favorite Book</span>
          </h1>
          
          <p className='text-gray-300 text-lg leading-relaxed max-w-xl'>
            Explore our curated collection of bestsellers, new releases, and timeless classics. Your next adventure awaits!
          </p>

          <div className="flex gap-4 pt-4">
            <button className='btn-primary'>
              Explore Now
            </button>
            <button className='px-8 py-3 border-2 border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors duration-300'>
              Learn More
            </button>
          </div>
        </div>

        <div className='md:w-1/2 animate-float filter drop-shadow-2xl'>
          <img 
            // src={bannerImg} 
            alt="Featured Books" 
            className="w-full max-w-lg mx-auto rounded-2xl transform -rotate-6 transition-transform duration-700 hover:rotate-0 hover:scale-105"
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent blur-3xl opacity-30 -z-10 group-hover:opacity-50 transition-opacity duration-700"/>
        </div>
      </div>
    </div>
  )
}

export default Banner