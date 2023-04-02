import axios from 'axios';

const API = axios.create({baseURL: 'http://localhost:5000'})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('auth')){
        req.headers.authorization = `Bearer ${localStorage.getItem('auth')}`
    }

    return req;
});

export const getMyModules = () => API.get('/modules');
export const createModule = (module) => API.post('/modules', module);

export const uploadDynamic = (file) => API.post('/dynamic', file);