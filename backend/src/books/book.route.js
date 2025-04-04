const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const verifySellerToken = require('../middleware/verifySellerToken');
const Order = require('./order.model'); // Assuming Order model is imported
const router = express.Router();

// frontend => backend server => controller => book schema  => database => send to server => back to the frontend
//post = when submit something fronted to db
// get =  when get something back from db
// put/patch = when edit or update something
// delete = when delete something

// Create book route with error handling
router.post("/create-book", async (req, res, next) => {
    try {
        // Temporary bypass token verification for testing
        // await verifyAdminToken(req, res, next);
        await postABook(req, res);
    } catch (error) {
        console.error("Route error:", error);
        res.status(500).json({
            message: "Route error in create book",
            error: error.message
        });
    }
});

// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, UpdateBook);

router.delete("/:id", verifyAdminToken, deleteABook);

// Get seller's books
router.get("/seller", verifySellerToken, async (req, res) => {
    try {
        const books = await Book.find({ seller: req.user.id });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create book with seller info
router.post("/seller/create", verifySellerToken, async (req, res) => {
    try {
        const book = new Book({
            ...req.body,
            seller: req.user.id
        });
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update seller's book
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

// Delete seller's book
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

// Update the seller stats endpoint
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

// Add route to update book stats after sale
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
