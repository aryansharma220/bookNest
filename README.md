# 📚 BookNest - MERN Book Store Application

BookNest is a full-stack e-commerce platform for books, built with the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless experience for book lovers to browse, purchase, and manage books online.

![logo](https://github.com/user-attachments/assets/69f7e1c9-5495-4209-8951-ca8be728ab43)


## 🌟 Features

### 👥 User Authentication
- Secure registration and login
- Email verification
- Role-based access control (Customer, Seller, Admin)

### 📖 Book Management
- Browse books with advanced filtering and search capabilities
- View detailed book information including cover images, descriptions, and pricing
- Rating and review system for books

### 🛒 Shopping Experience
- Add books to cart with quantity management
- Add favorite books to wishlist
- Checkout process with address and payment details
- Order history and tracking

### 🏪 Seller Dashboard
- Add and manage book listings
- Track sales and revenue
- View order statistics and popular books
- Manage inventory

### 👑 Admin Panel
- Manage all users, books, and orders
- View site-wide statistics
- Control platform settings

## 🛠️ Technologies Used

### Frontend
- React.js with hooks for state management
- Redux Toolkit and RTK Query for state management and API calls
- Tailwind CSS for responsive and beautiful UI
- Framer Motion for animations
- React Router for navigation
- React Hook Form for form handling
- SweetAlert2 for alerts

### Backend
- Node.js and Express.js for server
- MongoDB for database
- Mongoose for data modeling
- JWT for authentication
- Multer for file uploads
- Express Validator for request validation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/aryansharma220/bookNest.git
cd bookNest
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the `backend` directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookNest
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
```

4. Create a `.env` file in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server
```bash
# From the backend directory
npm run dev
```

2. Start the frontend development server
```bash
# From the frontend directory
npm start
```

3. Open `http://localhost:3000` in your browser to see the application

## 📂 Project Structure

```
bookNest/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## 📱 Application Workflow

1. **User Registration/Login**: Users can register as customers or sellers and log in securely.

2. **Browsing Books**: Users can browse the entire collection of books, filter by category, price, or ratings, and search for specific titles or authors.

3. **Shopping Cart**: Users can add books to their cart, adjust quantities, and proceed to checkout.

4. **Wishlist**: Users can save books to their wishlist for future reference.

5. **Checkout**: Users provide shipping information and complete the purchase.

6. **Order Management**: Users can view their order history, track order status, and potentially cancel pending orders.

7. **Seller Dashboard**: Sellers can add new books, manage inventory, and view sales metrics.

8. **Admin Panel**: Administrators can manage all aspects of the platform including users, books, and orders.

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user info

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Add a new book (seller/admin)
- `PUT /api/books/:id` - Update a book (seller/admin)
- `DELETE /api/books/:id` - Delete a book (seller/admin)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/email/:email` - Get all orders for a user
- `PATCH /api/orders/:orderId/cancel` - Cancel an order

### Wishlist
- `GET /api/wishlist/:userId` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:userId/:bookId` - Remove from wishlist

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name -  aryansharma220318@gmail.com

Project Link: [https://github.com/aryansharma220/bookNest](https://github.com/aryansharma220/bookNest)

---

Made with ❤️ by Aryan Sharma
