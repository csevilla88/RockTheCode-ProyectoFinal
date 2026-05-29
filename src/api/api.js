import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============ USERS ============
export const registerUser = (data) => api.post("/users/register", data);
export const loginUser = (data) => api.post("/users/login", data);
export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);
export const toggleFavorite = (playerId) => api.put(`/users/favorites/${playerId}`);
export const getAllUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ============ PLAYERS ============
export const getPlayers = (params) => api.get("/players", { params });
export const getPlayerById = (id) => api.get(`/players/${id}`);
export const getTopStats = () => api.get("/players/stats/top");
export const createPlayer = (data) => {
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api.post("/players", data, config);
};
export const updatePlayer = (id, data) => {
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api.put(`/players/${id}`, data, config);
};
export const deletePlayer = (id) => api.delete(`/players/${id}`);

// ============ MATCHES ============
export const getMatches = (params) => api.get("/matches", { params });
export const getMatchById = (id) => api.get(`/matches/${id}`);
export const getMatchStats = () => api.get("/matches/stats/summary");
export const createMatch = (data) => api.post("/matches", data);
export const updateMatch = (id, data) => api.put(`/matches/${id}`, data);
export const deleteMatch = (id) => api.delete(`/matches/${id}`);

// ============ NEWS ============
export const getNews = (params) => api.get("/news", { params });
export const getNewsById = (id) => api.get(`/news/${id}`);
export const createNews = (data) => {
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api.post("/news", data, config);
};
export const updateNews = (id, data) => {
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return api.put(`/news/${id}`, data, config);
};
export const deleteNews = (id) => api.delete(`/news/${id}`);

export default api;
