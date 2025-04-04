const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(201).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

exports.registerSeller = async (req, res) => {
    try {
        const { name, email, password, businessName, businessAddress } = req.body;
        const seller = await User.create({
            name,
            email,
            password,
            businessName,
            businessAddress,
            role: 'seller'
        });
        
        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.status(201).json({
            success: true,
            token,
            seller
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.approveSeller = async (req, res) => {
    try {
        const seller = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );

        if (!seller) {
            throw new Error('Seller not found');
        }

        res.status(200).json({
            success: true,
            seller
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateSellerRating = async (req, res) => {
    try {
        const { rating } = req.body;
        const seller = await User.findById(req.params.id);

        if (!seller) {
            throw new Error('Seller not found');
        }

        seller.ratings = ((seller.ratings * seller.totalRatings) + rating) / (seller.totalRatings + 1);
        seller.totalRatings += 1;
        await seller.save();

        res.status(200).json({
            success: true,
            seller
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
