import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { getImgUrl } from '../../utils/getImgUrl'
import { Link } from'react-router-dom'
import { useDispatch } from'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const BookCard = ({book}) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }
    
    return (
        <div className="bg-white rounded-xl shadow-card hover:shadow-xl transition-all duration-300 p-4">
            <div className="flex flex-col h-full">
                <div className="relative group">
                    <Link to={`/books/${book._id}`}>
                        <img
                            src={`${getImgUrl(book?.coverImage)}`}
                            alt=""
                            className="w-full h-[300px] object-cover rounded-lg transform transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>
                    {book.trending && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                            Trending
                        </span>
                    )}
                </div>

                <div className="mt-4 flex-grow">
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-xl font-bold text-secondary hover:text-primary-dark transition-colors duration-200 mb-2">
                            {book?.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {book?.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-2xl font-bold text-secondary">${book?.newPrice}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through">${book?.oldPrice}</span>
                        </div>
                        <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full capitalize">
                            {book?.category}
                        </span>
                    </div>
                </div>

                <button 
                    onClick={() => handleAddToCart(book)}
                    className="w-full bg-primary hover:bg-primary-dark text-secondary font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                >
                    <FiShoppingCart className="text-xl" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    )
}

export default BookCard