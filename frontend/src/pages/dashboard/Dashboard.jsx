import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import getBaseUrl from '../../utils/baseURL';
import { MdIncompleteCircle, MdTrendingUp, MdLibraryBooks, MdShoppingCart, MdAttachMoney } from 'react-icons/md'

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${getBaseUrl()}/api/admin`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })
                setData(response.data);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to fetch dashboard data');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if(loading) return <Loading/>
    if(error) return <div className="text-red-500 text-center p-4">{error}</div>

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            
            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <DashboardCard 
                    icon={<MdLibraryBooks className="h-6 w-6"/>}
                    title="Total Books"
                    value={data?.totalBooks || 0}
                    color="purple"
                />
                <DashboardCard 
                    icon={<MdAttachMoney className="h-6 w-6"/>}
                    title="Total Revenue"
                    value={`$${data?.totalSales || 0}`}
                    color="green"
                />
                <DashboardCard 
                    icon={<MdTrendingUp className="h-6 w-6"/>}
                    title="Trending Books"
                    value={data?.trendingBooks || 0}
                    subtitle={`${((data?.trendingBooks / data?.totalBooks) * 100 || 0).toFixed(1)}% of total`}
                    color="red"
                />
                <DashboardCard 
                    icon={<MdShoppingCart className="h-6 w-6"/>}
                    title="Total Orders"
                    value={data?.totalOrders || 0}
                    color="blue"
                />
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {data?.recentOrders?.length > 0 ? (
                            data.recentOrders.map((order, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">Order #{order.orderId}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-semibold">${order.amount}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No recent orders</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => navigate('/dashboard/add-new-book')}
                            className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            Add New Book
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard/manage-books')}
                            className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                            Manage Books
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

const DashboardCard = ({ icon, title, value, subtitle, color }) => (
    <div className="flex items-center p-8 bg-white shadow rounded-lg">
        <div className={`inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-${color}-600 bg-${color}-100 rounded-full mr-6`}>
            {icon}
        </div>
        <div>
            <span className="block text-2xl font-bold">{value}</span>
            <span className="block text-gray-500">{title}</span>
            {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
        </div>
    </div>
)

export default Dashboard