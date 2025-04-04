import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import SellerLogin from "../components/SellerLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import Books from "../pages/Books";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Wishlist from "../pages/Wishlist";
import SellerRoute from "./SellerRoute";
import SellerDashboardLayout from "../pages/sellerDashboard/SellerDashboardLayout";
import SellerBooks from "../pages/sellerDashboard/SellerBooks";
import SellerAddBook from "../pages/sellerDashboard/SellerAddBook";
import SellerEditBook from "../pages/sellerDashboard/SellerEditBook";
import SellerDashboard from "../pages/sellerDashboard/SellerDashboard";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home/>,
        },
        {
            path: "/orders",
            element: <PrivateRoute><OrderPage/></PrivateRoute>
        },
        {
            path: "/about",
            element: <About/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/register/:role",
          element: <Register/>
        },
        {
          path: "/cart",
          element: <CartPage/>
        },
        {
          path: "/checkout",
          element: <PrivateRoute><CheckoutPage/></PrivateRoute>
        },
        {
          path: "/books/:id",
          element: <SingleBook/>
        },
        {
          path: "/user-dashboard",
          element: <PrivateRoute><UserDashboard/></PrivateRoute>
        },
        {
          path: "/books",
          element: <Books/>
        },
        {
          path: "/contact",
          element: <Contact/>
        },
        {
          path: "/wishlist",
          element: <PrivateRoute><Wishlist/></PrivateRoute>
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminLogin/>
    },
    {
      path: "/seller",
      element: <SellerLogin/>
    },
    {
      path: "/dashboard",
      element: <AdminRoute>
        <DashboardLayout/>
      </AdminRoute>,
      children:[
        {
          path: "",
          element: <AdminRoute><Dashboard/></AdminRoute>
        },
        {
          path: "add-new-book",
          element: <AdminRoute>
            <AddBook/>
          </AdminRoute>
        },
        {
          path: "edit-book/:id",
          element: <AdminRoute>
            <UpdateBook/>
          </AdminRoute>
        },
        {
          path: "manage-books",
          element: <AdminRoute>
            <ManageBooks/>
          </AdminRoute>
        }
      ]
    },
    {
      path: "/seller-dashboard",
      element: <SellerRoute><SellerDashboardLayout/></SellerRoute>,
      children: [
        {
          path: "",
          element: <SellerRoute><SellerDashboard/></SellerRoute>
        },
        {
          path: "my-books",
          element: <SellerRoute><SellerBooks/></SellerRoute>
        },
        {
          path: "add-book",
          element: <SellerRoute><SellerAddBook/></SellerRoute>
        },
        {
          path: "edit-book/:id",
          element: <SellerRoute><SellerEditBook/></SellerRoute>
        }
      ]
    }
  ]);

  export default router;