import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const AUTH_URL = `${API_BASE_URL}/auth`;

export const registerEmployee = async (data: any) => {
    const response = await axios.post(`${AUTH_URL}/register`, data, {
        withCredentials: true,
    });
    return response.data;
};

export const loginUser = async (data: any) => {
    const response = await axios.post(`${AUTH_URL}/login`, data, {
        withCredentials: true,
    });
    return response.data;
};

export const updateProfile = async (data: any, token: string) => {
    const response = await axios.post(`${AUTH_URL}/profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return response.data;
};

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});