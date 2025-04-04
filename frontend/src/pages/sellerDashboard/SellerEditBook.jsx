import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import getBaseUrl from '../../utils/baseURL'
import { useNavigate, useParams } from 'react-router-dom'

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
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Book</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input 
                        {...register("title", { required: true })}
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input 
                        {...register("author", { required: true })}
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        {...register("description", { required: true })}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input 
                        {...register("price", { required: true })}
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input 
                        type="file"
                        onChange={handleImageUpload}
                        className="mt-1 block w-full"
                    />
                    {imageURL && <img src={imageURL} alt="Preview" className="mt-2 h-32 object-cover"/>}
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full"
                >
                    {loading ? 'Updating...' : 'Update Book'}
                </button>
            </form>
        </div>
    )
}

export default SellerEditBook
