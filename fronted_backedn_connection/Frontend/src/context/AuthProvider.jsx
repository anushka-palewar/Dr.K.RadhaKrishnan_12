/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./_AuthContext";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchMe
} from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // 🔥 centralize navigation here

  // 🔹 Restore session on initial app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const me = await fetchMe();   // GET /api/auth/me
        setUser(me);
      
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔹 Centralized login flow
  const login = async (data) => {
    const user = await loginUser(data);  // POST /api/auth/login
    setUser(user);
    navigate("/");                       // 🔥 post-login redirect
  };

  // 🔹 Centralized register flow
  const register = async (data) => {
    const user = await registerUser(data); // POST /api/auth/register
    setUser(user);
    navigate("/");                         // 🔥 post-register redirect
  };

  // 🔹 Centralized logout flow
 const logout = async () => {
  try {
    await logoutUser();
    setUser(null);
 
  } catch (err) {
    console.warn("Logout failed (not authenticated)");
    setUser(null); // still clear frontend state
  }
};


  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
