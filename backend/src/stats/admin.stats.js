const mongoose = require('mongoose');
const express = require('express');
const Order = require('../orders/order.model');
const Book = require('../books/book.model');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [
            totalOrders,
            totalSales,
            trendingBooksCount,
            totalBooks,
            recentOrders
        ] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSales: { $sum: "$totalPrice" },
                    }
                }
            ]),
            Book.countDocuments({ trending: true }),
            Book.countDocuments(),
            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('orderId totalPrice createdAt')
                .lean()
        ]);

        res.status(200).json({
            totalOrders,
            totalSales: totalSales[0]?.totalSales || 0,
            trendingBooks: trendingBooksCount,
            totalBooks,
            recentOrders: recentOrders.map(order => ({
                orderId: order._id.toString().slice(-6).toUpperCase(),
                amount: order.totalPrice,
                date: order.createdAt
            }))
        });
      
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
})

module.exports = router;