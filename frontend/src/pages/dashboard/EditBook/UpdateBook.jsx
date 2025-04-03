import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';
import Loading from '../../../components/Loading';

const UpdateBook = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchBookDetails();
    }, [id]);

    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(`${getBaseUrl()}/api/books/${id}`);
            const book = response.data;
            
            // Set form values
            Object.keys(book).forEach(key => {
                if (key !== 'image') {
                    setValue(key, book[key]);
                }
            });
            
            setCurrentImage(book.image);
            setError(null);
        } catch (error) {
            setError('Failed to fetch book details');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'image' && data[key][0]) {
                    formData.append(key, data[key][0]);
                } else if (key !== 'image') {
                    formData.append(key, data[key]);
                }
            });

            await axios.put(`${getBaseUrl()}/api/books/edit/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });

            alert('Book updated successfully!');
            navigate('/dashboard/manage-books');
        } catch (error) {
            setError(error.response?.data?.message || 'Error updating book');
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Book</h2>
                    <button
                        onClick={() => navigate('/dashboard/manage-books')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        ← Back
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title and Author fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    {...register("title", { required: "Title is required" })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Author
                                </label>
                                <input
                                    {...register("author", { required: "Author is required" })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.author && (
                                    <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Price, Discount, and Category fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price", { 
                                        required: "Price is required",
                                        min: { value: 0, message: "Price must be positive" }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    {...register("discount", { 
                                        min: { value: 0, message: "Discount cannot be negative" },
                                        max: { value: 100, message: "Discount cannot exceed 100%" }
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.discount && (
                                    <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">
                                    Leave empty for no discount
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    {...register("category", { required: "Category is required" })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {/* ...existing category options... */}
                                </select>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows="4"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Book Cover Image
                        </label>
                        <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                {(imagePreview || currentImage) && (
                                    <img
                                        src={imagePreview || currentImage}
                                        alt="Preview"
                                        className="h-32 w-32 object-cover rounded-lg"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("image")}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-input"
                                />
                                <label
                                    htmlFor="image-input"
                                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                                >
                                    Change Image
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit and Cancel buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                                submitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {submitting ? 'Updating...' : 'Update Book'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard/manage-books')}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateBook;