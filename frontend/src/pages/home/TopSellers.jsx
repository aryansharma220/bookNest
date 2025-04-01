import React, { useEffect, useState } from 'react'
import BookCard from '../books/BookCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = ["All", "Business", "Fiction", "Horror", "Adventure"]

const TopSellers = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { data: books = [] } = useFetchAllBooksQuery();

    const filteredBooks = selectedCategory === "All" ? books : books.filter(book => book.category === selectedCategory.toLowerCase())

    return (
        <div className='py-10'>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className='text-4xl font-bold bg-gradient-to-r from-secondary to-primary-dark bg-clip-text text-transparent mb-4 md:mb-0'>
                    Top Sellers
                </h2>
                <div className='flex items-center bg-white shadow-lg rounded-full p-1'>
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full transition-all duration-300 ${
                                selectedCategory === category 
                                ? 'bg-primary text-secondary font-bold shadow-md transform scale-105' 
                                : 'hover:bg-gray-100'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
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
                className="pb-12 mx-auto max-w-7xl [&_.swiper-button-next]:!text-primary [&_.swiper-button-prev]:!text-primary"
            >
                {filteredBooks.length > 0 && filteredBooks.map((book, index) => (
                    <SwiperSlide key={index} className="!h-full">
                        <div className="hover:scale-105 transition-transform duration-300 h-full">
                            <BookCard book={book} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default TopSellers