require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/users/user.model');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            await mongoose.connection.close();
            return;
        }

        const adminUser = new User({
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.connection.close();
    }
};

createAdmin();
