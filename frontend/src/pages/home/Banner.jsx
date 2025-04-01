import React from 'react'
import bannerImg from "../../assets/banner.png"

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12 bg-gradient-to-r from-white to-blackBG rounded-2xl shadow-custom px-8">
      <div className='md:w-1/2 w-full flex items-center md:justify-end transform transition-transform hover:scale-105 duration-300'>
        <img src={bannerImg} alt="" className="rounded-lg shadow-xl" />
      </div>
      
      <div className='md:w-1/2 w-full space-y-6'>
        <h1 className='md:text-5xl text-2xl font-bold leading-tight text-secondary'>
          New Releases This Week
        </h1>
        <p className='text-gray-600 text-lg leading-relaxed'>
          It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone.
        </p>

        <div className="flex gap-4">
          <button className='btn-primary transform hover:scale-105 transition-all duration-300 flex items-center gap-2'>
            Subscribe
          </button>
          <button className='px-6 py-2 border-2 border-secondary text-secondary font-bold rounded-md hover:bg-secondary hover:text-white transition-all duration-300'>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default Banner