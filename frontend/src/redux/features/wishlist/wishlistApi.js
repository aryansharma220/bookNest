import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/wishlist`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Wishlist'],
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: (userId) => `/${userId}`,
      providesTags: ['Wishlist']
    }),
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Wishlist']
    }),
    removeFromWishlist: builder.mutation({
      query: ({ userId, bookId }) => ({
        url: `/${userId}/${bookId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Wishlist']
    })
  })
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation
} = wishlistApi;

export default wishlistApi;
