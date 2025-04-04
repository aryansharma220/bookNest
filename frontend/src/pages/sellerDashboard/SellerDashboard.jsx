import React from 'react'
import { useGetSellerStatsQuery } from '../../redux/features/sellerBooks/sellerBooksApi'
import { FaBook, FaMoneyBill, FaShoppingCart, FaStar } from 'react-icons/fa'

const SellerDashboard = () => {
    const { data: stats, isLoading, isError, error } = useGetSellerStatsQuery()

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
    )

    if (isError) return (
        <div className="text-center text-red-500 p-4">
            Error: {error?.data?.message || 'Failed to load dashboard'}
        </div>
    )

    const StatCard = ({ icon, title, value, color }) => (
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className={`p-3 rounded-full ${color} text-white mr-4`}>
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 text-sm">{title}</h3>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    )

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FaBook className="text-2xl"/>}
                    title="Total Books"
                    value={stats?.totalBooks || 0}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<FaShoppingCart className="text-2xl"/>}
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    color="bg-green-500"
                />
                <StatCard
                    icon={<FaMoneyBill className="text-2xl"/>}
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue || 0}`}
                    color="bg-yellow-500"
                />
                <StatCard
                    icon={<FaStar className="text-2xl"/>}
                    title="Average Rating"
                    value={stats?.averageRating?.toFixed(1) || 0}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {stats?.recentOrders?.map((order) => (
                            <div key={order._id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                                <div>
                                    <p className="font-medium">{order.bookTitle}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <span className="font-semibold">${order.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold mb-4">Top Selling Books</h3>
                    <div className="space-y-4">
                        {stats?.topBooks?.map((book) => (
                            <div key={book._id} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                                <div>
                                    <p className="font-medium">{book.title}</p>
                                    <p className="text-sm text-gray-500">{book.soldCopies} copies sold</p>
                                </div>
                                <span className="font-semibold">${book.price}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SellerDashboard
