const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require('dotenv').config()

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://booknest-backend.vercel.app',
  // Add any other production frontend URLs here
];

// Set up CORS with specific options
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const bookRoutes = require('./src/books/book.route');
const orderRoutes = require("./src/orders/order.route")
const userRoutes =  require("./src/users/user.route")
const adminRoutes = require("./src/stats/admin.stats")
const wishlistRoutes = require('./src/wishlist/wishlist.route');
const uploadRoutes = require('./src/upload/upload.route');

app.use("/api/books", bookRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/wishlist", wishlistRoutes)
app.use('/api/upload', uploadRoutes);

async function main() {
  await mongoose.connect(process.env.DB_URL);
  app.use("/", (req, res) => {
    res.send("Book Store Server is running!");
  });
}

main().then(() => console.log("Mongodb connect successfully!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
