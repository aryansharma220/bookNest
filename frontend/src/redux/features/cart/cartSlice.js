import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";

const initialState = {
    cartItems: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        addToCart: (state, action) => {
            try {
                if (!action.payload?._id) {
                    throw new Error("Invalid product data");
                }

                const existingItem = state.cartItems.find(item => item._id === action.payload._id);
                if(!existingItem) {
                    state.cartItems.push({
                        ...action.payload,
                        quantity: 1
                    });
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Product Added to the Cart",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else {
                    Swal.fire({
                        title: "Already in Cart",
                        text: "This item is already in your cart",
                        icon: "info",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to add item to cart"
                });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload._id)
        },
        clearCart: (state) => {
            state.cartItems = []
        },
        updateQuantity: (state, action) => {
            try {
                const { id, quantity } = action.payload;
                if (!id || typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
                    throw new Error("Invalid quantity");
                }

                const item = state.cartItems.find(item => item._id === id);
                if (item) {
                    item.quantity = quantity;
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update quantity"
                });
            }
        }
    }
})

// export the actions   
export const  {addToCart, removeFromCart, clearCart, updateQuantity} = cartSlice.actions;
export default cartSlice.reducer;