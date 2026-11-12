import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // customer profile
  const [admin, setAdmin] = useState(null); // { username, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("dc_role");
    const storedUser = localStorage.getItem("dc_user");
    if (role === "admin" && storedUser) {
      setAdmin(JSON.parse(storedUser));
    } else if (role === "customer" && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginCustomer = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data, "customer");
    setUser(data);
    return data;
  };

  const registerCustomer = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    persistSession(data, "customer");
    setUser(data);
    return data;
  };

  const loginAdmin = async (username, password) => {
    const { data } = await api.post("/auth/admin-login", { username, password });
    persistSession(data, "admin");
    setAdmin(data);
    return data;
  };

  const persistSession = (data, role) => {
    localStorage.setItem("dc_token", data.token);
    localStorage.setItem("dc_role", role);
    localStorage.setItem("dc_user", JSON.stringify(data));
  };

  const logout = () => {
    localStorage.removeItem("dc_token");
    localStorage.removeItem("dc_role");
    localStorage.removeItem("dc_user");
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        admin,
        loading,
        loginCustomer,
        registerCustomer,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
