import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL'

export const sellerBooksApi = createApi({
    reducerPath: 'sellerBooksApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: getBaseUrl(),
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('sellerToken')
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['SellerBooks', 'SellerStats'],
    endpoints: (builder) => ({
        getSellerBooks: builder.query({
            query: () => '/api/books/seller',
            providesTags: ['SellerBooks'],
        }),
        deleteSellerBook: builder.mutation({
            query: (id) => ({
                url: `/api/books/seller/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SellerBooks'],
        }),
        getSellerStats: builder.query({
            query: () => '/api/books/seller/stats',
            providesTags: ['SellerStats'],
        }),
    }),
})

export const {
    useGetSellerBooksQuery,
    useDeleteSellerBookMutation,
    useGetSellerStatsQuery,
} = sellerBooksApi
