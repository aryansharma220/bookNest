import React, { useState, useMemo } from 'react';
import { useGetOrderByEmailQuery } from '../../redux/features/orders/ordersApi';
import { useGetProductByIdQuery } from '../../redux/features/products/productsApi';
import { useAuth } from '../../context/AuthContext';

const OrderProduct = ({ productId }) => {
    const { data: product, isLoading } = useGetProductByIdQuery(productId);
    
    if (isLoading) return <div className="animate-pulse h-16 bg-gray-100 rounded"></div>;
    if (!product) return null;

    return (
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
            <img src={product.imageURL} alt={product.title} className="w-12 h-16 object-cover rounded" />
            <div>
                <p className="font-medium">{product.title}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
            </div>
        </div>
    );
};

const OrderSkeleton = () => (
    <div className="border rounded-lg p-4 mb-4 animate-pulse">
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2">
            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const OrderPage = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);
    const [sortOrder, setSortOrder] = useState('newest');
    const [expandedOrder, setExpandedOrder] = useState(null);

    const sortedOrders = useMemo(() => {
        const sorted = [...orders];
        return sorted.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }, [orders, sortOrder]);

    const downloadReceipt = (order) => {
        const receipt = `
Order Receipt
------------
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Customer: ${order.name}
Email: ${order.email}
Phone: ${order.phone}
Address: ${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.zipcode}
Total: $${order.totalPrice}
        `;
        
        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-receipt-${order._id}.txt`;
        a.click();
    };

    if (isLoading) return (
        <div className='container mx-auto p-6 space-y-4'>
            {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
        </div>
    );

    if (isError) return (
        <div className='container mx-auto p-6 text-red-500'>Error getting orders data</div>
    );

    return (
        <div className='container mx-auto p-6'>
            <div className="flex justify-between items-center mb-6">
                <h2 className='text-2xl font-semibold'>Your Orders ({orders.length})</h2>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No orders found!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedOrders.map((order) => (
                        <div key={order._id} 
                            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4 cursor-pointer"
                                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h2 className="font-bold text-lg">Order #{order._id.slice(-8)}</h2>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
                                </div>
                            </div>

                            {expandedOrder === order._id && (
                                <div className="p-4 border-t bg-gray-50 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Shipping Details</h3>
                                            <p className="text-sm">{order.name}</p>
                                            <p className="text-sm">{order.email}</p>
                                            <p className="text-sm">{order.phone}</p>
                                            <p className="text-sm">
                                                {order.address.city}, {order.address.state}<br />
                                                {order.address.country}, {order.address.zipcode}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Products</h3>
                                            <div className="space-y-2">
                                                {order.productIds.map((productId) => (
                                                    <OrderProduct key={productId} productId={productId} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => downloadReceipt(order)}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Download Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;