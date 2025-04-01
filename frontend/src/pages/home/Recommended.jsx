import React, { useEffect, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from '../books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';


const Recommended = () => {
    const {data: books = [], isLoading, error} = useFetchAllBooksQuery();
    
    console.log('Books in Recommended:', books); // Debug log

    if (isLoading) {
        return <div className="text-center py-16">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-16 text-red-500">Error loading books</div>;
    }

    return (
        <div className='py-16 bg-gradient-to-b from-blackBG to-white'>
            <div className="flex justify-between items-center mb-8">
                <h2 className='text-4xl font-bold bg-gradient-to-r from-secondary to-primary-dark bg-clip-text text-transparent'>
                    Recommended for you
                </h2>
                <button className="px-6 py-2 bg-white shadow-md rounded-full text-secondary hover:bg-primary hover:text-white transition-all duration-300">
                    View All
                </button>
            </div>

            <Swiper
                slidesPerView={3}
                spaceBetween={30}
                loop={true}
                speed={1000}
                effect={'slide'}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loopFillGroupWithBlank={true}
                navigation={true}
                pagination={{
                    clickable: true
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 25,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    }
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="pb-12 pt-4 mx-auto max-w-7xl [&_.swiper-button-next]:!text-primary [&_.swiper-button-prev]:!text-primary"
            >
                {books?.length > 0 ? (
                    books.slice(0, 10).map((book, index) => (
                        <SwiperSlide key={book._id || index} className="!h-full">
                            <div className="hover:scale-105 transition-transform duration-300 h-full">
                                <BookCard book={book} />
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <div className="text-center py-16">No books available</div>
                )}
            </Swiper>
        </div>
    )
}

export default Recommended