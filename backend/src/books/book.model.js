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
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    soldCount: {
        type: Number,
        default: 0
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    revenue: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add a virtual field for discounted price
bookSchema.virtual('discountedPrice').get(function() {
    if (!this.discount) return this.newPrice;
    const discountAmount = (this.newPrice * this.discount) / 100;
    return Number((this.newPrice - discountAmount).toFixed(2));
});

// Ensure virtuals are included in JSON output
bookSchema.set('toJSON', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;