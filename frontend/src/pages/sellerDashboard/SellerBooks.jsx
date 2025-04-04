import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetSellerBooksQuery, useDeleteSellerBookMutation } from '../../redux/features/sellerBooks/sellerBooksApi'
import { FaEdit, FaTrash, FaSearch, FaSort, FaFilter } from 'react-icons/fa'

const SellerBooks = () => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')
    const [filter, setFilter] = useState('all')
    const { data: books, isLoading } = useGetSellerBooksQuery()
    const [deleteBook] = useDeleteSellerBookMutation()

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(id).unwrap()
                alert('Book deleted successfully!')
            } catch (error) {
                alert('Failed to delete book')
                console.error('Delete error:', error)
            }
        }
    }

    const filteredBooks = books?.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                            book.author.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filter === 'all' || book.category === filter
        return matchesSearch && matchesFilter
    })

    const sortedBooks = filteredBooks?.sort((a, b) => {
        switch(sort) {
            case 'title':
                return a.title.localeCompare(b.title)
            case 'priceHigh':
                return b.price - a.price
            case 'priceLow':
                return a.price - b.price
            case 'newest':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt)
        }
    })

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    )

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Books</h2>
                <Link 
                    to="/seller-dashboard/add-book"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    Add New Book
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative">
                        <FaSort className="absolute left-3 top-3 text-gray-400"/>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="newest">Newest First</option>
                            <option value="title">Title A-Z</option>
                            <option value="priceHigh">Price High to Low</option>
                            <option value="priceLow">Price Low to High</option>
                        </select>
                    </div>

                    <div className="relative">
                        <FaFilter className="absolute left-3 top-3 text-gray-400"/>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Categories</option>
                            <option value="fiction">Fiction</option>
                            <option value="non-fiction">Non-Fiction</option>
                            <option value="science">Science</option>
                            <option value="technology">Technology</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                </div>
            </div>

            {sortedBooks?.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No books found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedBooks?.map(book => (
                        <div key={book._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="relative h-48">
                                <img 
                                    src={book.imageURL} 
                                    alt={book.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-0 right-0 p-2 space-x-2">
                                    <Link 
                                        to={`/seller-dashboard/edit-book/${book._id}`}
                                        className="inline-block bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="inline-block bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-green-600 font-bold">${book.price}</span>
                                    <span className="text-gray-500 text-sm">
                                        {book.soldCount || 0} sold
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Category: {book.category}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SellerBooks
