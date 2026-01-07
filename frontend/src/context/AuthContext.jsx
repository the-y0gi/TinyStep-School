import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../services/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("authToken") || null,
    user: (() => {
      try {
        const data = localStorage.getItem("user");
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error("Failed to parse user data:", e);
        localStorage.removeItem("user");
        return null;
      }
    })(),
    isAuthenticated: false,
    loading: true,
  });

  // Set auth state on initial load
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        loading: false,
      }));
    } else {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, []);

  // Login function
  const login = async (email, password, role = "superadmin") => {
    try {
      let endpoint = "/admin/auth/login";
      if (role === "teacher") endpoint = "/teacher/login";
      else if (role === "parent") endpoint = "/parent/login";

      const response = await axiosInstance.post(endpoint, { email, password });
      const { success, message, data } = response.data;

      if (!success || !data?.token) {
        throw new Error(message || "Invalid login response");
      }

      // 👇 Handle user object based on role (admin / user / teacher / parent)
      const userData = data.user || data.admin || data.teacher || data.parent;

      if (!userData) {
        throw new Error("User data missing in response");
      }

      // Save to localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setAuthState({
        token: data.token,
        user: userData,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return {
        success: false,
        message: err?.response?.data?.message || err.message,
      };
    }
  };
 
  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);

