const express =  require('express');
const User = require('./user.model');
const jwt = require('jsonwebtoken');

const router =  express.Router();

const JWT_SECRET = process.env.JWT_SECRET_KEY

router.post("/admin", async (req, res) => {
    const {username, password} = req.body;
    try {
        const admin = await User.findOne({username, role: 'admin'});
        if(!admin) {
            return res.status(404).json({message: "Admin not found!"});
        }
        
        if(admin.password !== password) {
            return res.status(401).json({message: "Invalid password!"});
        }
        
        const token = jwt.sign(
            {id: admin._id, username: admin.username, role: admin.role}, 
            JWT_SECRET,
            {expiresIn: "1h"}
        );

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: admin.username,
                role: admin.role
            }
        });
        
    } catch (error) {
       console.error("Failed to login as admin", error);
       res.status(500).json({message: "Failed to login as admin"}); 
    }
});

router.post("/seller", async (req, res) => {
    const {username, password} = req.body;
    try {
        const seller = await User.findOne({username, role: 'seller'});
        if(!seller) {
            return res.status(404).json({message: "Seller not found!"});
        }
        
        if(seller.password !== password) {
            return res.status(401).json({message: "Invalid password!"});
        }
        
        const token = jwt.sign(
            {id: seller._id, username: seller.username, role: seller.role}, 
            JWT_SECRET,
            {expiresIn: "1h"}
        );

        return res.status(200).json({
            message: "Authentication successful",
            token: token,
            user: {
                username: seller.username,
                role: seller.role
            }
        });
        
    } catch (error) {
       console.error("Failed to login as seller", error);
       res.status(500).json({message: "Failed to login as seller"}); 
    }
});

module.exports = router;