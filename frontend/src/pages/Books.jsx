import React, { useState, useMemo, useEffect } from 'react'
import { HiOutlineSearch, HiViewGrid, HiViewList } from 'react-icons/hi'
import { FaSort, FaHeart } from 'react-icons/fa'
import { useFetchAllBooksQuery } from '../redux/features/books/booksApi'
import { useAuth } from '../context/AuthContext';
import { useGetWishlistQuery, useAddToWishlistMutation, useRemoveFromWishlistMutation } from '../redux/features/wishlist/wishlistApi';
import BookCard from './books/BookCard'
import Loading from '../components/Loading'
import useDebounce from '../hooks/useDebounce'

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'priceHigh', 'priceLow'
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { data: books = [], isLoading } = useFetchAllBooksQuery()
  const { currentUser } = useAuth();
  const { data: wishlistItems = [] } = useGetWishlistQuery(currentUser?.uid);
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedGenre('all')
    setPriceRange({ min: 0, max: 1000 })
    setSortBy('newest')
  }

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'horror', label: 'Horror' },
    { value: 'adventure', label: 'Adventure' },
  ]

  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      const results = books.filter(book => {
        const bookCategory = book.category?.toLowerCase() || ''
        const matchesSearch = !debouncedSearchTerm || 
          book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          book.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        const matchesGenre = selectedGenre === 'all' || bookCategory === selectedGenre
        const matchesPrice = book.newPrice >= priceRange.min && book.newPrice <= priceRange.max
        return matchesSearch && matchesGenre && matchesPrice
      })
      setSearchResults(results)
      setIsSearching(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [books, debouncedSearchTerm, selectedGenre, priceRange])

  const filteredBooks = useMemo(() => {
    const results = searchResults
    
    switch(sortBy) {
      case 'priceHigh':
        return [...results].sort((a, b) => b.newPrice - a.newPrice)
      case 'priceLow':
        return [...results].sort((a, b) => a.newPrice - b.newPrice)
      case 'newest':
        return [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      default:
        return results
    }
  }, [searchResults, sortBy])

  const isInWishlist = (bookId) => {
    return wishlistItems.some(item => item.bookId._id === bookId);
  };

  const toggleWishlist = async (bookId) => {
    if (!currentUser) {
      // Handle not logged in case
      return;
    }

    try {
      if (isInWishlist(bookId)) {
        await removeFromWishlist({ userId: currentUser.uid, bookId }).unwrap();
      } else {
        await addToWishlist({ userId: currentUser.uid, bookId }).unwrap();
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Discover Amazing Books
          </h1>
          <p className="mt-4 text-gray-600">Find your next favorite read from our collection</p>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <HiOutlineSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isSearching ? 'text-primary animate-pulse' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Categories</label>
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      className={`px-4 py-2 rounded-lg text-left transition-all duration-300 ${
                        selectedGenre === category.value
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedGenre(category.value)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-2">
                  Price: ${priceRange.min} - ${priceRange.max}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">Newest First</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="priceLow">Price: Low to High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="md:w-3/4">
            {/* View Toggle and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                Found {filteredBooks.length} books {selectedGenre !== 'all' && `in ${selectedGenre}`}
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <HiViewGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <HiViewList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Books Display */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
            }>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div key={book._id} 
                    className={`${viewMode === 'grid' 
                      ? 'transform hover:-translate-y-1 transition-transform duration-300'
                      : 'flex gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <div className="relative">
                        <BookCard book={book} />
                        <button
                          onClick={() => toggleWishlist(book._id)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          <FaHeart className={`${
                            isInWishlist(book._id) ? 'text-red-500' : 'text-gray-300'
                          }`} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-6 w-full">
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="w-48 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                          <p className="text-gray-600 mb-4">{book.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-primary font-bold">${book.newPrice}</span>
                            <button
                              onClick={() => toggleWishlist(book._id)}
                              className="p-2 hover:text-red-500 transition-colors duration-300"
                            >
                              <FaHeart className={`${
                                isInWishlist(book._id) ? 'text-red-500' : 'text-gray-300'
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 mb-4">No books found matching your criteria</div>
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Books
