const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
        lowercase: true
    },
    trending: {
        type: Boolean,
        default: false
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required']
    },
    oldPrice: {
        type: Number,
        required: [true, 'Old price is required'],
        min: 0
    },
    newPrice: {
        type: Number,
        required: [true, 'New price is required'],
        min: 0
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;