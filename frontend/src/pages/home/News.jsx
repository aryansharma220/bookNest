import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';

import news1 from "../../assets/news/news-1.png"
import news2 from "../../assets/news/news-2.png"
import news3 from "../../assets/news/news-3.png"
import news4 from "../../assets/news/news-4.png"
import { Link } from 'react-router-dom';

const news = [
    {
        "id": 1,
        "title": "Global Climate Summit Calls for Urgent Action",
        "description": "World leaders gather at the Global Climate Summit to discuss urgent strategies to combat climate change, focusing on reducing carbon emissions and fostering renewable energy solutions.",
        "image": news1
    },
    {
        "id": 2,
        "title": "Breakthrough in AI Technology Announced",
        "description": "A major breakthrough in artificial intelligence has been announced by researchers, with new advancements promising to revolutionize industries from healthcare to finance.",
        "image": news2
    },
    {
        "id": 3,
        "title": "New Space Mission Aims to Explore Distant Galaxies",
        "description": "NASA has unveiled plans for a new space mission that will aim to explore distant galaxies, with hopes of uncovering insights into the origins of the universe.",
        "image": news3
    },
    {
        "id": 4,
        "title": "Stock Markets Reach Record Highs Amid Economic Recovery",
        "description": "Global stock markets have reached record highs as signs of economic recovery continue to emerge following the challenges posed by the global pandemic.",
        "image": news4
    },
    {
        "id": 5,
        "title": "Innovative New Smartphone Released by Leading Tech Company",
        "description": "A leading tech company has released its latest smartphone model, featuring cutting-edge technology, improved battery life, and a sleek new design.",
        "image": news2
    }
]

const News = () => {
    return (
        <div className='py-16 bg-gradient-to-b from-white to-blackBG'>
            <h2 className='text-4xl font-bold bg-gradient-to-r from-secondary to-primary-dark bg-clip-text text-transparent mb-8'>
                Latest News
            </h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                navigation={true}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                }}
                modules={[Pagination, Navigation]}
                className="p-4"
            >
                {news.map((item, index) => (
                    <SwiperSlide key={index}>
                        <div className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                            <div className='flex flex-col sm:flex-row'>
                                <div className='sm:w-1/2 p-6 flex flex-col justify-between'>
                                    <div>
                                        <Link to="/">
                                            <h3 className='text-xl font-bold text-secondary hover:text-primary-dark transition-colors duration-200 mb-4'>
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <div className='w-20 h-1 bg-gradient-to-r from-primary to-primary-dark rounded-full mb-4'></div>
                                        <p className='text-gray-600 leading-relaxed'>
                                            {item.description}
                                        </p>
                                    </div>
                                    <button className='mt-6 inline-flex items-center text-secondary hover:text-primary-dark font-semibold'>
                                        Read More 
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className='sm:w-1/2'>
                                    <img 
                                        // src={item.image} 
                                        alt="" 
                                        className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default News