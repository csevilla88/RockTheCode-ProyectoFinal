import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { loginUser, registerUser, getProfile } from "../api/api";

const AuthContext = createContext(null);

// Reducer para manejar estados complejos de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar token al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await getProfile();
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user: res.data, token },
          });
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await loginUser(credentials);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Error al iniciar sesión";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: "AUTH_START" });
    try {
      const res = await registerUser(userData);
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "AUTH_SUCCESS", payload: { user, token } });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Error al registrarse";
      dispatch({ type: "AUTH_ERROR", payload: message });
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateUser = useCallback((user) => {
    dispatch({ type: "UPDATE_USER", payload: user });
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
