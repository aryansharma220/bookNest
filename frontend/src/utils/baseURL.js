const getBaseUrl = () => {
    return import.meta.env.NODE_ENV === 'production' 
        ? import.meta.env.VITE_PRODUCTION_BACKEND_URL || "https://booknest-api.vercel.app"
        : import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
}

export default getBaseUrl;