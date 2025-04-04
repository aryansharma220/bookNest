import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import booksApi from './features/books/booksApi'
import ordersApi from './features/orders/ordersApi'
import wishlistApi from './features/wishlist/wishlistApi'
import productsApi from './features/products/productsApi'
import { sellerBooksApi } from './features/sellerBooks/sellerBooksApi'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [sellerBooksApi.reducerPath]: sellerBooksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      wishlistApi.middleware,
      productsApi.middleware,
      sellerBooksApi.middleware
    ),
})