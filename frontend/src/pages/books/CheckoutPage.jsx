import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import { clearCart } from '../../redux/features/cart/cartSlice';

const CheckoutPage = () => {
    const [submitting, setSubmitting] = useState(false);
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.newPrice * (item.quantity || 1)), 0).toFixed(2);
    const { currentUser } = useAuth()
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: currentUser?.displayName || '',
            email: currentUser?.email || '',
        }
    })

    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const navigate = useNavigate()

    const [isChecked, setIsChecked] = useState(false)

    const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    const zipPattern = /^[0-9]{5}(?:-[0-9]{4})?$/;

    const onSubmit = async (data) => {
        if (cartItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Empty Cart',
                text: 'Your cart is empty!'
            });
            return;
        }

        setSubmitting(true);
        try {
            const newOrder = {
                name: data.name,
                email: currentUser?.email,
                address: {
                    street: data.address,
                    city: data.city,
                    country: data.country,
                    state: data.state,
                    zipcode: data.zipcode
                },
                phone: data.phone,
                productIds: cartItems.map(item => ({
                    id: item._id,
                    quantity: item.quantity || 1
                })),
                totalPrice: totalPrice,
            };

            await createOrder(newOrder).unwrap();
            dispatch(clearCart());
            
            Swal.fire({
                icon: 'success',
                title: 'Order Confirmed!',
                text: 'Your order has been placed successfully.',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate("/orders");
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: error.message || 'Failed to place the order. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
                    <Link to="/books" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container max-w-screen-xl mx-auto px-4">
                {/* Order Summary Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-semibold">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold">${totalPrice}</span>
                    </div>
                    <div className="border-t pt-4">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.coverImage} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium">${(item.newPrice * (item.quantity || 1)).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Full Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Email Address</label>
                            <input
                                {...register("email", { required: "Email is required" })}
                                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                disabled
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Phone Number</label>
                            <input
                                {...register("phone", { required: "Phone number is required", pattern: { value: phonePattern, message: "Invalid phone number" } })}
                                className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Address / Street</label>
                            <input
                                {...register("address", { required: "Address is required" })}
                                className={`w-full p-2 border rounded ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">City</label>
                            <input
                                {...register("city", { required: "City is required" })}
                                className={`w-full p-2 border rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Country / Region</label>
                            <input
                                {...register("country", { required: "Country is required" })}
                                className={`w-full p-2 border rounded ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">State / Province</label>
                            <input
                                {...register("state", { required: "State is required" })}
                                className={`w-full p-2 border rounded ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Zipcode</label>
                            <input
                                {...register("zipcode", { required: "Zipcode is required", pattern: { value: zipPattern, message: "Invalid zipcode" } })}
                                className={`w-full p-2 border rounded ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode.message}</p>}
                        </div>

                        <div className="col-span-full">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                                <span className="ml-2 text-gray-600">
                                    I agree to the <Link className="text-indigo-600 hover:underline">Terms & Conditions</Link>
                                </span>
                            </label>
                        </div>

                        <div className="col-span-full">
                            <button
                                type="submit"
                                disabled={!isChecked || submitting}
                                className={`w-full bg-indigo-600 text-white py-3 rounded-md font-medium
                                    ${(!isChecked || submitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                            >
                                {submitting ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;