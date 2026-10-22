import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to requests if present in localStorage
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('road_user_info');
  if (profile) {
    const user = JSON.parse(profile);
    if (user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return req;
});

export default API;
