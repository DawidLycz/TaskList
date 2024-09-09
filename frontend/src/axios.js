import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');

  if (refresh) {
    try {
      const response = await instance.post('api/token/refresh/', { refresh });
      const { access } = response.data;
      localStorage.setItem('access_token', access);
      return access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }
  return null;
};

instance.interceptors.request.use(
  async config => {
    let token = localStorage.getItem('access_token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp - currentTime < 300) {
        token = await refreshToken();
      }
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
