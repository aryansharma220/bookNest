import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/books`,
        credentials: 'include'
    }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: ['Products']
        })
    })
});

export const { useGetProductByIdQuery } = productsApi;
export default productsApi;
