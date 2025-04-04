import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import getBaseUrl from '../../utils/baseURL'
import { useNavigate, useParams } from 'react-router-dom'
import { FaBook, FaUpload, FaTimes } from 'react-icons/fa'

const SellerEditBook = () => {
    const [loading, setLoading] = useState(false)
    const [imageURL, setImageURL] = useState("")
    const navigate = useNavigate()
    const { id } = useParams()
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axios.get(`${getBaseUrl()}/api/books/${id}`)
                const book = response.data
                reset(book) // Pre-fill form with existing data
                setImageURL(book.imageURL)
            } catch (error) {
                console.error("Error fetching book:", error)
                alert("Failed to fetch book details")
            }
        }
        fetchBook()
    }, [id, reset])

    const onSubmit = async (data) => {
        setLoading(true)
        const bookData = {
            ...data,
            imageURL
        }

        try {
            await axios.put(`${getBaseUrl()}/api/books/seller/${id}`, bookData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('sellerToken')}`
                }
            })
            alert("Book updated successfully!")
            navigate("/seller-dashboard/my-books")
        } catch (error) {
            console.error("Error updating book:", error)
            alert("Failed to update book")
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post(`${getBaseUrl()}/api/upload`, formData)
            setImageURL(response.data.url)
        } catch (error) {
            console.error("Error uploading image:", error)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Edit Book</h2>
                    <p className="text-gray-600 mt-1">Update your book information</p>
                </div>
                <FaBook className="text-4xl text-green-600" />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input 
                                {...register("title", { required: "Title is required" })}
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter book title"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                            <input 
                                {...register("author", { required: "Author is required" })}
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter author name"
                            />
                            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea 
                                {...register("description", { required: "Description is required" })}
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter book description"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select 
                                {...register("category", { required: "Category is required" })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">Select category</option>
                                <option value="fiction">Fiction</option>
                                <option value="non-fiction">Non-Fiction</option>
                                <option value="science">Science</option>
                                <option value="technology">Technology</option>
                                <option value="business">Business</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input 
                                    {...register("price", { 
                                        required: "Price is required",
                                        min: { value: 0, message: "Price must be positive" }
                                    })}
                                    type="number"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Book Cover Image</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-1 text-center">
                                    {!imageURL ? (
                                        <>
                                            <FaUpload className="mx-auto h-12 w-12 text-gray-400"/>
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                    <span>Upload a file</span>
                                                    <input type="file" className="sr-only" onChange={handleImageUpload}/>
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </>
                                    ) : (
                                        <div className="relative">
                                            <img src={imageURL} alt="Preview" className="max-h-48 mx-auto"/>
                                            <button
                                                type="button"
                                                onClick={() => setImageURL("")}
                                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <FaTimes className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button 
                            type="button"
                            onClick={() => navigate("/seller-dashboard/my-books")}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : 'Update Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SellerEditBook
