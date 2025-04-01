import React from 'react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../redux/features/wishlist/wishlistApi';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cart/cartSlice';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Wishlist = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || currentUser?._id;
  const { data: wishlistItems = [], isLoading, error } = useGetWishlistQuery(userId, {
    skip: !userId,
  });
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const dispatch = useDispatch();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">Please login to view your wishlist</p>
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 mb-4">Error loading wishlist</p>
      </div>
    );
  }

  const handleRemove = async (bookId) => {
    try {
      await removeFromWishlist({ 
        userId, 
        bookId 
      }).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = (book) => {
    dispatch(addToCart(book));
    handleRemove(book._id);
    toast.success('Added to cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"
        >
          My Wishlist
        </motion.h1>
        
        {(!wishlistItems || wishlistItems.length === 0) ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl shadow-md"
          >
            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
            <Link 
              to="/books" 
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Browse Books
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 relative group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.bookId.coverImage} 
                    alt={item.bookId.title} 
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemove(item.bookId._id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <FaHeart className="text-red-500 hover:scale-110 transition-transform" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{item.bookId.title}</h3>
                  <p className="text-primary font-bold mb-4">${item.bookId.newPrice}</p>
                  
                  <button
                    onClick={() => handleAddToCart(item.bookId)}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
