import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getImgUrl } from '../../utils/getImgUrl';
import { clearCart, removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';
import Swal from 'sweetalert2';

const CartPage = () => {
    const [loading, setLoading] = useState(false);
    const cartItems = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch()

    const totalPrice = cartItems.reduce((acc, item) => {
        const quantity = item.quantity || 1;
        const price = parseFloat(item.newPrice) || 0;
        return acc + (price * quantity);
    }, 0).toFixed(2);

    const handleRemoveFromCart = async (product) => {
        try {
            const result = await Swal.fire({
                title: "Remove Item?",
                text: "Are you sure you want to remove this item?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, remove it!"
            });

            if (result.isConfirmed) {
                dispatch(removeFromCart(product));
                Swal.fire({
                    icon: "success",
                    title: "Item Removed",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to remove item"
            });
        }
    }

    const handleClearCart = async () => {
        try {
            const result = await Swal.fire({
                title: "Clear Cart?",
                text: "This will remove all items from your cart",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, clear it!"
            });

            if (result.isConfirmed) {
                dispatch(clearCart());
                Swal.fire({
                    icon: "success",
                    title: "Cart Cleared",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to clear cart"
            });
        }
    }

    const handleQuantityChange = (id, newQuantity) => {
        try {
            if (newQuantity < 1 || newQuantity > 10) {
                Swal.fire({
                    icon: "warning",
                    title: "Invalid Quantity",
                    text: "Quantity must be between 1 and 10"
                });
                return;
            }
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update quantity"
            });
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                            {cartItems.length > 0 && (
                                <button
                                    onClick={handleClearCart}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-200"
                                >
                                    Clear Cart
                                </button>
                            )}
                        </div>

                        {cartItems.length > 0 ? (
                            <div className="space-y-6">
                                {cartItems.map((product) => (
                                    <div key={product._id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                                        <div className="w-full sm:w-32 h-32">
                                            <img
                                                src={getImgUrl(product?.coverImage)}
                                                alt={product.title}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">{product.title}</h3>
                                                <p className="text-gray-600">Category: {product.category}</p>
                                                <p className="text-indigo-600 font-semibold">${product.newPrice}</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                                        onClick={() => handleQuantityChange(product._id, (product.quantity || 1) - 1)}
                                                        disabled={loading || (product.quantity || 1) <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 text-center font-medium">
                                                        {product.quantity || 1}
                                                    </span>
                                                    <button
                                                        className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                                        onClick={() => handleQuantityChange(product._id, (product.quantity || 1) + 1)}
                                                        disabled={loading || (product.quantity || 1) >= 10}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromCart(product)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-lg">Your cart is empty</p>
                                <Link to="/books" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
                                    Continue Shopping →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${totalPrice}</span>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6'>

                            <Link
                                to="/checkout"
                                className={`w-full mt-6 px-6 py-3 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors ${!cartItems.length && 'opacity-50 cursor-not-allowed'}`}
                                disabled={!cartItems.length}
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage