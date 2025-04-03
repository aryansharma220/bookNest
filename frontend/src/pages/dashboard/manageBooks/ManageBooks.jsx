import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaSearch, FaSort } from 'react-icons/fa';
import getBaseUrl from '../../../utils/baseURL';
import Loading from '../../../components/Loading';

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState({ field: 'title', order: 'asc' });
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/books`);
            setBooks(response.data);
            setError(null);
        } catch (error) {
            setError('Failed to fetch books');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            await axios.delete(`${getBaseUrl()}/api/books/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchBooks();
        } catch (error) {
            alert('Error deleting book');
            console.error('Error:', error);
        }
    };

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedBooks = books
        .filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                                book.author.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || book.category === filter;
            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            const order = sort.order === 'asc' ? 1 : -1;
            return a[sort.field] > b[sort.field] ? order : -order;
        });

    const categories = ['all', ...new Set(books.map(book => book.category))];

    if (loading) return <Loading />;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Manage Books</h2>
                <Link 
                    to="/dashboard/add-new-book"
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
                >
                    Add New Book
                </Link>
            </div>

            <div className="flex flex-col gap-4 bg-white p-3 sm:p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative w-full">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg text-sm"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('title')}>
                                <div className="flex items-center space-x-1">
                                    <span>Title</span>
                                    <FaSort className={sort.field === 'title' ? 'text-blue-500' : ''} />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('author')}>
                                <div className="flex items-center space-x-1">
                                    <span>Author</span>
                                    <FaSort className={sort.field === 'author' ? 'text-blue-500' : ''} />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('price')}>
                                <div className="flex items-center space-x-1">
                                    <span>Price</span>
                                    <FaSort className={sort.field === 'price' ? 'text-blue-500' : ''} />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAndSortedBooks.map((book) => (
                            <tr key={book._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full object-cover" src={book.image} alt={book.title} />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{book.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${book.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <Link to={`/dashboard/edit-book/${book._id}`}
                                            className="text-blue-600 hover:text-blue-900">
                                            <FaEdit className="h-5 w-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(book._id)}
                                            className="text-red-600 hover:text-red-900">
                                            <FaTrash className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
                {filteredAndSortedBooks.map((book) => (
                    <div key={book._id} className="bg-white p-3 sm:p-4 rounded-lg shadow">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <img 
                                className="h-20 w-20 rounded-lg object-cover" 
                                src={book.image} 
                                alt={book.title} 
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{book.title}</h3>
                                <p className="text-sm text-gray-500">by {book.author}</p>
                                <div className="mt-2 space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="font-medium truncate ml-2">{book.category}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Price:</span>
                                        <span className="font-medium">${book.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3 pt-3 border-t">
                            <Link 
                                to={`/dashboard/edit-book/${book._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                            >
                                <FaEdit className="h-5 w-5" />
                            </Link>
                            <button 
                                onClick={() => handleDelete(book._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            >
                                <FaTrash className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAndSortedBooks.length === 0 && (
                <div className="text-center py-6 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No books found</p>
                </div>
            )}
        </div>
    );
};

export default ManageBooks;