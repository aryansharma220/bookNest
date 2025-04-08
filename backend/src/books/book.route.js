const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const verifySellerToken = require('../middleware/verifySellerToken');
const Order = require('../orders/order.model');
const router = express.Router();


router.get("/seller/stats", verifySellerToken, async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments({ seller: req.user.id });
        const books = await Book.find({ seller: req.user.id });
        
        const stats = {
            totalBooks,
            totalOrders: books.reduce((acc, book) => acc + book.soldCount, 0),
            totalRevenue: books.reduce((acc, book) => acc + book.revenue, 0),
            averageRating: books.reduce((acc, book) => acc + book.rating.average, 0) / totalBooks || 0,
            topBooks: books
                .sort((a, b) => b.soldCount - a.soldCount)
                .slice(0, 5)
                .map(book => ({
                    _id: book._id,
                    title: book.title,
                    price: book.newPrice,
                    soldCopies: book.soldCount,
                    revenue: book.revenue
                })),
            recentOrders: await Order.find({ 
                'items.book': { $in: books.map(book => book._id) } 
            })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('items.book')
            .lean()
            .then(orders => orders.map(order => ({
                _id: order._id,
                bookTitle: order.items[0].book.title,
                amount: order.totalAmount,
                date: order.createdAt
            })))
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/seller", verifySellerToken, async (req, res) => {
    try {
        const books = await Book.find({ seller: req.user.id });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/seller/create", verifySellerToken, async (req, res) => {
    try {
        const { title, author, description, category, price, imageURL } = req.body;
        if (!title || !author || !description || !category || !price || !imageURL) {
            return res.status(400).json({ 
                message: "All fields are required: title, author, description, category, price, imageURL" 
            });
        }

        const book = new Book({
            title,
            author,
            description,
            category,
            price,
            imageURL,
            seller: req.user.id,
            oldPrice: price,
            newPrice: price,
            discount: 0,
            trending: false,
            soldCount: 0,
            rating: { average: 0, count: 0 },
            revenue: 0
        });

        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(400).json({ 
            message: error.message || "Failed to create book",
            details: error.errors 
        });
    }
});

router.put("/seller/:id", verifySellerToken, async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, seller: req.user.id });
        if (!book) {
            return res.status(404).json({ message: "Book not found or unauthorized" });
        }
        Object.assign(book, req.body);
        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete("/seller/:id", verifySellerToken, async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ 
            _id: req.params.id, 
            seller: req.user.id 
        });
        if (!book) {
            return res.status(404).json({ message: "Book not found or unauthorized" });
        }
        res.json({ message: "Book deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/create-book", async (req, res, next) => {
    try {
        await postABook(req, res);
    } catch (error) {
        console.error("Route error:", error);
        res.status(500).json({
            message: "Route error in create book",
            error: error.message
        });
    }
});

router.get("/", getAllBooks);

router.get("/:id", getSingleBook);

router.put("/edit/:id", verifyAdminToken, UpdateBook);

router.delete("/:id", verifyAdminToken, deleteABook);

router.post("/seller/:id/sale", verifySellerToken, async (req, res) => {
    try {
        const { quantity, revenue, rating } = req.body;
        const book = await Book.findOne({ _id: req.params.id, seller: req.user.id });
        
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        book.soldCount += quantity;
        book.revenue += revenue;
        
        if (rating) {
            book.rating.average = ((book.rating.average * book.rating.count) + rating) / (book.rating.count + 1);
            book.rating.count += 1;
        }

        await book.save();
        res.json({ message: "Book stats updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
