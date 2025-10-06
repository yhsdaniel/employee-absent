import axios from 'axios';

const API_URL = 'http://localhost:4000/auth';

export const registerEmployee = async (data: any) => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
};

export const loginUser = async (data: any) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
};

export const updateProfile = async (data: any, token: string) => {
    const response = await axios.post(`${API_URL}/profile`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Instance Axios untuk request terautentikasi (optional, tapi disarankan)
export const api = axios.create({
    baseURL: 'http://localhost:4000',
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor untuk menyuntikkan token secara otomatis
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});