const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const router = express.Router();

// frontend => backend server => controller => book schema  => database => send to server => back to the frontend
//post = when submit something fronted to db
// get =  when get something back from db
// put/patch = when edit or update something
// delete = when delete something

// Create book route with error handling
router.post("/create-book", async (req, res, next) => {
    try {
        // Temporary bypass token verification for testing
        // await verifyAdminToken(req, res, next);
        await postABook(req, res);
    } catch (error) {
        console.error("Route error:", error);
        res.status(500).json({
            message: "Route error in create book",
            error: error.message
        });
    }
});

// get all books
router.get("/", getAllBooks);

// single book endpoint
router.get("/:id", getSingleBook);

// update a book endpoint
router.put("/edit/:id", verifyAdminToken, UpdateBook);

router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;
