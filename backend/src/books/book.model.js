const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
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
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    imageURL: {
        type: String,
        required: [true, 'Image URL is required']
    },
    coverImage: {
        type: String,
        default: function() {
            return this.imageURL;
        }
    },
    trending: {
        type: Boolean,
        default: false
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

bookSchema.virtual('discountedPrice').get(function() {
    if (!this.discount) return this.newPrice;
    const discountAmount = (this.newPrice * this.discount) / 100;
    return Number((this.newPrice - discountAmount).toFixed(2));
});

bookSchema.set('toJSON', { virtuals: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;