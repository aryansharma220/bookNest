const Book = require('../models/bookModel');
const User = require('../models/userModel');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('reviews');
        res.status(200).json({
            success: true,
            count: books.length,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createBook = async (req, res) => {
    try {
        const seller = await User.findById(req.user.id);
        if (!seller || !seller.isApproved) {
            throw new Error('Unauthorized or unapproved seller');
        }

        const bookData = {
            ...req.body,
            seller: seller._id,
            sellerName: seller.businessName
        };

        const book = await Book.create(bookData);
        seller.books.push(book._id);
        await seller.save();

        res.status(201).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('reviews');
        if (!book) {
            throw new Error('Book not found');
        }
        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!book) {
            throw new Error('Book not found');
        }
        res.status(200).json({
            success: true,
            book
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            throw new Error('Book not found');
        }
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSellerBooks = async (req, res) => {
    try {
        const books = await Book.find({ seller: req.user.id, status: { $ne: 'deleted' } });
        res.status(200).json({
            success: true,
            count: books.length,
            books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
