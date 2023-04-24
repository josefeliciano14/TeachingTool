import axios from 'axios';

export const BASE_URL = 'http://localhost:5000';

const API = axios.create({baseURL: BASE_URL})

API.interceptors.request.use((req) => {
    if(localStorage.getItem('auth')){
        req.headers.authorization = `Bearer ${localStorage.getItem('auth')}`
    }

    return req;
});

export const getProfile = () => API.get('/users/profile');
export const updateProfile = (profile) => API.put('/users/profile', profile);

export const getMyModules = () => API.get('/modules');
export const getMyModulesLimit = (limit) => API.get(`/modules/limit/${limit}`);
export const getHomeModules = () => API.get('/modules/home');
export const createModule = (module) => API.post('/modules', module);
export const getModule = (mid) => API.get(`/modules/${mid}`);
export const deleteModule = (mid) => API.delete(`/modules/${mid}`);
export const getModuleSection = (mid, sid) => API.get(`/modules/${mid}/section/${sid}`);
export const getModuleWithCode = (mid, code) => API.get(`/modules/${mid}?code=${code}`);
export const getEnrolledModules = () => API.get(`/modules/enrolled`);
export const getInstructingModules = () => API.get(`/modules/instructing`);
export const searchModules = (query) => API.get(`/modules/search/${query}`);

export const getSections = () => API.get('/sections');
export const getSection = (sid) => API.get(`/sections/${sid}`);
export const createSection = (section) => API.post(`/sections`, section);
export const removeStudent = (uid, sid) => API.delete(`/sections/remove/${uid}/${sid}`);

export const getInstructors = () => API.get('/instructors');
export const getInstructor = (iid, sid) => API.get(`/instructors/${iid}/${sid}`);
export const addInstructor = (instructor) => API.post('/instructors', instructor);
export const updatePermissions = (iid, sid, permissions) => API.put(`/instructors/${iid}/${sid}`, permissions);
export const removeInstructor = (iid, sid) => API.delete(`/instructors/${iid}/${sid}`);

export const uploadDynamic = (file) => API.post('/dynamic', file);