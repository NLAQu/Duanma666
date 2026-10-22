import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((res) => {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => {
    function persist(token, nextUser) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
    }

    return {
      user,
      loading,
      isAdmin: user?.role === "admin" || user?.role === "seller",
      async login(payload) {
        const res = await api.login(payload);
        persist(res.token, res.user);
        return res.user;
      },
      async register(payload) {
        const res = await api.register(payload);
        persist(res.token, res.user);
        return res.user;
      },
      logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
