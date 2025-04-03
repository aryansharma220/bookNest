import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useGetOrderByEmailQuery, useCancelOrderMutation } from '../../../redux/features/orders/ordersApi';
import { useGetProductByIdQuery } from '../../../redux/features/products/productsApi';
import { toast } from 'react-hot-toast';

const OrderProduct = ({ productId, order }) => {
    const { data: product, isLoading } = useGetProductByIdQuery(productId);
    
    if (isLoading) return <div className="ml-4 animate-pulse h-20 bg-gray-100 rounded"></div>;
    if (!product) return null;

    const quantity = order?.quantities?.[productId] || 1;

    return (
        <div className="ml-4 flex items-center gap-4 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-all">
            <img src={product.imageURL} alt={product.title} className="w-12 h-16 object-cover rounded shadow-sm" />
            <div className="flex-1">
                <p className="font-medium">{product.title}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
            </div>
            <div className="text-sm text-gray-500">
                Qty: {quantity}
            </div>
        </div>
    );
};

const OrderSkeleton = () => (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between">
            <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
    </div>
);

const UserDashboard = () => {
    const { currentUser } = useAuth();
    const { data: orders = [], isLoading, isError } = useGetOrderByEmailQuery(currentUser?.email);
    const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId).unwrap();
            toast.success('Order cancelled successfully');
        } catch (error) {
            toast.error('Failed to cancel order');
        }
    };

    const sortedAndFilteredOrders = useMemo(() => {
        let result = [...(orders || [])];
        
        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        // Filter by search
        if (searchQuery) {
            result = result.filter(order => 
                order._id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort orders
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'desc' 
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt);
            }
            return sortOrder === 'desc' 
                ? b.totalPrice - a.totalPrice
                : a.totalPrice - b.totalPrice;
        });

        return result;
    }, [orders, statusFilter, searchQuery, sortBy, sortOrder]);

    const orderStats = useMemo(() => {
        return {
            total: orders?.length || 0,
            pending: orders?.filter(o => o.status === 'pending').length || 0,
            completed: orders?.filter(o => o.status === 'completed').length || 0,
            cancelled: orders?.filter(o => o.status === 'cancelled').length || 0,
            totalSpent: orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0
        };
    }, [orders]);

    const downloadReceipt = (order) => {
        const receipt = `Order Receipt #${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}
Total: $${order.totalPrice}
Status: ${order.status}
        `;
        
        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order-receipt-${order._id}.txt`;
        a.click();
    };

    const getStatusBadgeClass = (status) => {
        const baseClasses = "text-sm px-3 py-1 rounded-full font-medium";
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'completed':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'cancelled':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (isLoading) return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
        </div>
    );

    if (isError) return <div className="text-red-500 text-center">Error getting orders data</div>;

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

                {/* Order Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Total Orders</p>
                        <p className="text-2xl font-bold">{orderStats.total}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-600">Pending</p>
                        <p className="text-2xl font-bold">{orderStats.pending}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-600">Total Spent</p>
                        <p className="text-2xl font-bold">${orderStats.totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-purple-600">Completed</p>
                        <p className="text-2xl font-bold">{orderStats.completed}</p>
                    </div>
                </div>

                {/* Search and Sort Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [newSortBy, newSortOrder] = e.target.value.split('-');
                            setSortBy(newSortBy);
                            setSortOrder(newSortOrder);
                        }}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="price-desc">Price High to Low</option>
                        <option value="price-asc">Price Low to High</option>
                    </select>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Your Orders ({sortedAndFilteredOrders.length})</h2>
                    <div className="flex gap-2">
                        {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1 rounded-full text-sm capitalize transition-all ${
                                    statusFilter === status 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                
                {sortedAndFilteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {sortedAndFilteredOrders.map((order) => (
                            <div 
                                key={order._id} 
                                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300"
                            >
                                <div className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-all"
                                     onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                                    <div>
                                        <p className="font-medium">Order #{order._id.slice(-8)}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order?.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <p className="font-bold">${order.totalPrice.toFixed(2)}</p>
                                        <span className={getStatusBadgeClass(order.status)}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                
                                {expandedOrder === order._id && (
                                    <div className="p-4 border-t border-gray-200 animate-fadeIn">
                                        <p className="font-medium mb-2">Products:</p>
                                        <div className="space-y-2">
                                            {order.productIds.map((productId) => (
                                                <OrderProduct 
                                                    key={productId} 
                                                    productId={productId} 
                                                    order={order}
                                                />
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
                                        <button
                                            onClick={() => downloadReceipt(order)}
                                            className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Download Receipt
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No {statusFilter !== 'all' ? statusFilter : ''} orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
