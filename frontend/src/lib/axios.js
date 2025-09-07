// https://flowtalk-backend.vercel.app/

import axios from 'axios';

const BASE_URL= 
    import.meta.env.MODE === "development"
    ? "https://localhost:5001/api"
    : "https://flowtalk-backend.vercel.app/";

export const axiosInstance= axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});