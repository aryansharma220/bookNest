require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/users/user.model');

const createSeller = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        const existingSeller = await User.findOne({ username: 'seller' });
        if (existingSeller) {
            console.log('Seller user already exists');
            await mongoose.connection.close();
            return;
        }

        const sellerUser = new User({
            username: 'seller',
            password: 'seller123',
            role: 'seller'
        });

        await sellerUser.save();
        console.log('Seller user created successfully');

    } catch (error) {
        console.error('Error creating seller:', error);
    } finally {
        await mongoose.connection.close();
    }
};

createSeller();
