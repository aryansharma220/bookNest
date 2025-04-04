import React from 'react'
import { Link } from 'react-router-dom'
import { useGetSellerBooksQuery, useDeleteSellerBookMutation } from '../../redux/features/sellerBooks/sellerBooksApi'

const SellerBooks = () => {
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

    if (isLoading) return <div className="text-center py-4">Loading...</div>

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books?.map(book => (
                    <div key={book._id} className="bg-white p-4 rounded-lg shadow">
                        <img src={book.imageURL} alt={book.title} className="w-full h-48 object-cover mb-4"/>
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-gray-600">${book.price}</p>
                        <div className="mt-4 flex gap-2">
                            <Link 
                                to={`/seller-dashboard/edit-book/${book._id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(book._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SellerBooks
