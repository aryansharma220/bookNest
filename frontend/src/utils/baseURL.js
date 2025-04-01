const getBaseUrl = () => {
    return process.env.NODE_ENV === 'production' 
        ? "https://your-production-url.com" 
        : "http://localhost:5000";
}

export default getBaseUrl;