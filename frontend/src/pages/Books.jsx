import React, { useState, useMemo } from 'react'
import { HiOutlineSearch, HiViewGrid, HiViewList } from 'react-icons/hi'
import { FaSort, FaHeart } from 'react-icons/fa'
import { useFetchAllBooksQuery } from '../redux/features/books/booksApi'
import BookCard from './books/BookCard'
import Loading from '../components/Loading'

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'priceHigh', 'priceLow'
  const [wishlist, setWishlist] = useState([])

  const { data: books = [], isLoading } = useFetchAllBooksQuery()

  // Enhanced filtering with price range and sorting
  const filteredBooks = useMemo(() => {
    let results = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === 'all' || book.category.toLowerCase() === selectedGenre.toLowerCase()
      const matchesPrice = book.newPrice >= priceRange.min && book.newPrice <= priceRange.max
      return matchesSearch && matchesGenre && matchesPrice
    })

    // Sorting
    switch(sortBy) {
      case 'priceHigh':
        return results.sort((a, b) => b.newPrice - a.newPrice)
      case 'priceLow':
        return results.sort((a, b) => a.newPrice - b.newPrice)
      case 'newest':
        return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      default:
        return results
    }
  }, [books, searchTerm, selectedGenre, priceRange, sortBy])

  // Get unique categories from books
  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(books.map(book => book.category))]
    return uniqueCategories.map(category => 
      category.charAt(0).toUpperCase() + category.slice(1)
    )
  }, [books])

  const toggleWishlist = (bookId) => {
    setWishlist(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Discover Amazing Books
          </h1>
          <p className="mt-4 text-gray-600">Find your next favorite read from our collection</p>
        </div>

        {/* Enhanced Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search and Categories */}
            <div className="flex-1 w-full">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* View Toggle and Sort */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
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
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="priceLow">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Price Range and Categories */}
          <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-48"
              />
              <span className="text-sm text-gray-600">
                Price: ${priceRange.min} - ${priceRange.max}
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    selectedGenre === category.toLowerCase()
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'bg-white border border-gray-200 hover:border-primary'
                  }`}
                  onClick={() => setSelectedGenre(category.toLowerCase())}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-gray-600">
          Found {filteredBooks.length} books {selectedGenre !== 'all' && `in ${selectedGenre}`}
        </div>

        {/* Books Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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
                        wishlist.includes(book._id) ? 'text-red-500' : 'text-gray-300'
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
                            wishlist.includes(book._id) ? 'text-red-500' : 'text-gray-300'
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
                onClick={() => {
                  setSearchTerm('')
                  setSelectedGenre('all')
                  setPriceRange({ min: 0, max: 1000 })
                }}
                className="text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Books
