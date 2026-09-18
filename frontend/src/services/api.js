import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api',
  timeout: 10000,
});

export const AUTH_TOKEN_KEY = 'veloop_token';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event('veloop:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export async function register(email, displayName, password) {
  const { data } = await api.post('/auth/register', { email, displayName, password });
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logout() {
  const { data } = await api.post('/auth/logout');
  return data;
}

export async function getDailyStreak() {
  const { data } = await api.get('/daily-streak');
  return data;
}

export async function getDailyStreakStatus() {
  const { data } = await api.get('/daily-streak/status');
  return data;
}

export async function getDailyStreakHistory(limit = 50) {
  const { data } = await api.get('/daily-streak/history', { params: { limit } });
  return data;
}

export async function claimDailyStreak(idempotencyKey = crypto.randomUUID()) {
  const { data } = await api.post('/daily-streak/claim', { idempotencyKey });
  return data;
}

export function isAuthenticationError(error) {
  return error?.response?.status === 401;
}
