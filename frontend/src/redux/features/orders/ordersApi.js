import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";


const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include'
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: (builder.mutation) ({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
                credentials: 'include',
            })
        }),
        getOrderByEmail: (builder.query) ({
            query: (email) => ({
                url: `/email/${email}`
            }),
            providesTags: ['Orders']
        }),
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `/orders/${orderId}/cancel`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Orders'],
        }),
    })
})

export const {useCreateOrderMutation, useGetOrderByEmailQuery, useCancelOrderMutation} = ordersApi;

export default ordersApi;