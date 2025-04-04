import { Navigate } from "react-router-dom";

const SellerRoute = ({ children }) => {
    const sellerToken = localStorage.getItem('sellerToken');
    return sellerToken ? children : <Navigate to="/seller" />;
}

export default SellerRoute;
