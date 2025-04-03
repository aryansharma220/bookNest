import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery, useCancelOrderMutation } from '../../../redux/features/orders/ordersApi';
import { useGetProductByIdQuery } from '../../../redux/features/products/productsApi';
import { toast } from 'react-hot-toast';

const OrderProduct = ({ productId }) => {
    const { data: product, isLoading } = useGetProductByIdQuery(productId);
    
    if (isLoading) return <div className="ml-4">Loading product details...</div>;
    if (!product) return null;

    return (
        <div className="ml-4 flex items-center gap-4 p-2 bg-gray-50 rounded">
            <img src={product.imageURL} alt={product.title} className="w-12 h-16 object-cover rounded" />
            <div>
                <p className="font-medium">{product.title}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
    const [expandedOrder, setExpandedOrder] = useState(null);

    if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (isError) return <div className="text-red-500 text-center">Error getting orders data</div>;

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId).unwrap();
            toast.success('Order cancelled successfully');
        } catch (error) {
            toast.error('Failed to cancel order');
        }
    };

    return (
        <div className="bg-gray-100 py-16 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">User Dashboard</h1>
                    <div className="text-right">
                        <p className="text-gray-700">Welcome, {currentUser?.name || 'User'}!</p>
                        <p className="text-sm text-gray-500">{currentUser?.email}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Your Orders ({orders.length})</h2>
                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div 
                                    key={order._id} 
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                >
                                    <div className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                                         onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                                        <div>
                                            <p className="font-medium">Order #{order._id.slice(-8)}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order?.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${order.totalPrice}</p>
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {expandedOrder === order._id && (
                                        <div className="p-4 border-t border-gray-200">
                                            <p className="font-medium mb-2">Products:</p>
                                            <div className="space-y-2">
                                                {order.productIds.map((productId) => (
                                                    <OrderProduct key={productId} productId={productId} />
                                                ))}
                                            </div>
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    disabled={isCancelling}
                                                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                                >
                                                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">You have no orders yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
