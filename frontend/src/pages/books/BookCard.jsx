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
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-hover transform hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"/>
            
            <div className="relative p-4 flex flex-col h-full">
                <div className="relative overflow-hidden rounded-xl h-[400px]"> {/* Fixed height container */}
                    <Link to={`/books/${book._id}`} className="block h-full">
                        <img
                            src={`${getImgUrl(book?.coverImage)}`}
                            alt=""
                            className="w-full h-full object-cover object-center rounded-xl transform transition-all duration-700 group-hover:scale-110"
                        />
                    </Link>
                    {book.trending && (
                        <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-accent to-accent-dark text-white rounded-full text-sm font-medium gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse"/>
                                Trending
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"/>
                </div>

                <div className="mt-6 flex-grow space-y-4">
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-xl font-bold bg-gradient-to-br from-secondary via-secondary to-primary-dark bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300 truncate whitespace-nowrap overflow-hidden">
                            {book?.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
                        {book?.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-secondary">${book?.newPrice}</p>
                            <p className="text-sm text-gray-500 line-through">${book?.oldPrice}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-gradient-to-br from-success/10 to-success/20 text-success rounded-lg text-sm font-medium capitalize">
                            {book?.category}
                        </span>
                    </div>
                </div>

                <button 
                    onClick={() => handleAddToCart(book)}
                    className="mt-6 w-full bg-gradient-to-r from-primary to-primary-dark hover:from-accent hover:to-accent-dark text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:shadow-accent/25"
                >
                    <FiShoppingCart className="text-xl" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    )
}

export default BookCard