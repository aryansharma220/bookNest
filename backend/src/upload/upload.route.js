const express = require('express');
const router = express.Router();
const { upload } = require('./upload.controller');

router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ url: imageUrl });
    });
});

module.exports = router;
