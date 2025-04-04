const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const verifySellerToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || user.role !== 'seller') {
            return res.status(403).json({ message: 'Invalid credentials or insufficient permissions' });
        }
        req.user = user;
        next();
    });
}

module.exports = verifySellerToken;
