const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        console.log('Received book data:', req.body); // Add logging
        
        // Validate required fields
        const { title, description, category, coverImage, oldPrice, newPrice } = req.body;
        if (!title || !description || !category || !coverImage || !oldPrice || !newPrice) {
            return res.status(400).json({ 
                message: "Missing required fields",
                received: req.body 
            });
        }

        const newBook = new Book({
            title,
            description,
            category,
            trending: req.body.trending || false,
            coverImage,
            oldPrice: Number(oldPrice),
            newPrice: Number(newPrice)
        });

        const savedBook = await newBook.save();
        console.log('Book saved successfully:', savedBook);
        
        return res.status(201).json({
            message: "Book created successfully",
            book: savedBook
        });

    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({
            message: "Failed to create book",
            error: error.message
        });
    }
}

// get all books
const getAllBooks =  async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1});
        res.status(200).send(books)
        
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({message: "Failed to fetch books"})
    }
}

const getSingleBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book =  await Book.findById(id);
        if(!book){
            res.status(404).send({message: "Book not Found!"})
        }
        res.status(200).send(book)
        
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({message: "Failed to fetch book"})
    }

}

// update book data
const UpdateBook = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedBook =  await Book.findByIdAndUpdate(id, req.body, {new: true});
        if(!updatedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({message: "Failed to update a book"})
    }
}

const deleteABook = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedBook =  await Book.findByIdAndDelete(id);
        if(!deletedBook) {
            res.status(404).send({message: "Book is not Found!"})
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook
        })
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({message: "Failed to delete a book"})
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook
}