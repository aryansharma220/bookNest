import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';

const AddBook = () => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'image') {
                    formData.append(key, data[key][0]);
                } else {
                    formData.append(key, data[key]);
                }
            });

            const response = await axios.post(`${getBaseUrl()}/api/books/create-book`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            if (response.status === 201) {
                alert('Book added successfully!');
                reset();
                setImagePreview(null);
                navigate('/dashboard/manage-books');
            }
        } catch (error) {
            console.error('Error adding book:', error);
            alert(error.response?.data?.message || 'Error adding book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Book</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input 
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Book title"
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                        <input 
                            type="text"
                            {...register("author", { required: "Author is required" })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Author name"
                        />
                        {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                        <input 
                            type="number"
                            step="0.01"
                            {...register("price", { 
                                required: "Price is required",
                                min: { value: 0, message: "Price must be positive" }
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="29.99"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                        <input 
                            type="number"
                            step="1"
                            {...register("discount", { 
                                min: { value: 0, message: "Discount cannot be negative" },
                                max: { value: 100, message: "Discount cannot exceed 100%" }
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="10"
                        />
                        {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select 
                            {...register("category", { required: "Category is required" })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select category</option>
                            <option value="Fiction">Fiction</option>
                            <option value="Non-Fiction">Non-Fiction</option>
                            <option value="Science">Science</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Romance">Romance</option>
                            <option value="Mystery">Mystery</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea 
                            {...register("description", { required: "Description is required" })}
                            rows="4"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Book description..."
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
                        <div className="flex items-center space-x-4">
                            <input 
                                type="file"
                                accept="image/*"
                                {...register("image", { required: "Image is required" })}
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-input"
                            />
                            <label 
                                htmlFor="image-input"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                            >
                                Choose Image
                            </label>
                            {imagePreview && (
                                <div className="relative">
                                    <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding Book...' : 'Add Book'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/manage-books')}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddBook;