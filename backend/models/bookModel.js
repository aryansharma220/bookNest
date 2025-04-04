const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter book title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please enter author name']
    },
    description: {
        type: String,
        required: [true, 'Please enter book description']
    },
    price: {
        type: Number,
        required: [true, 'Please enter book price']
    },
    category: {
        type: String,
        required: [true, 'Please enter book category']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter book stock'],
        default: 1
    },
    imageUrl: {
        type: String,
        required: [true, 'Please enter book image']
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    }
}, { timestamps: true });

// Add method to calculate average rating
bookSchema.methods.calculateAverageRating = function() {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
};

module.exports = mongoose.model('Book', bookSchema);
