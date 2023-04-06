import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';

const API = axios.create({baseURL: BASE_URL})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('auth')){
        req.headers.authorization = `Bearer ${localStorage.getItem('auth')}`
    }

    return req;
});

export const getMyModules = () => API.get('/modules');
export const getMyModulesLimit = (limit) => API.get(`/modules/limit/${limit}`);
export const createModule = (module) => API.post('/modules', module);
export const getModule = (mid) => API.get(`/modules/${mid}`);
export const searchModules = (query) => API.get(`/modules/search/${query}`);

export const getSections = () => API.get('/sections');
export const createSection = (section) => API.post(`/sections`, section);

export const uploadDynamic = (file) => API.post('/dynamic', file);