import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { AUTH_EXPIRED_EVENT } from "../services/api";
import {
  clearSession,
  decodeTokenPayload,
  getStoredUser,
  getToken,
  isTokenExpired,
  saveSession,
} from "../services/tokenStorage";

function loadInitialUser() {
  const token = getToken();
  const user = getStoredUser();
  if (!token || !user || isTokenExpired(token)) {
    clearSession();
    return null;
  }
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser);

  const login = useCallback((token, userData) => {
    saveSession(token, userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // The API layer dispatches this when the server rejects the token (401).
  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired);
  }, []);

  // Log out automatically when the token expires while the page is open.
  useEffect(() => {
    if (!user) return undefined;
    const token = getToken();
    const payload = token && decodeTokenPayload(token);
    if (!payload?.exp) return undefined;

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    const timer = setTimeout(logout, Math.max(msUntilExpiry, 0));
    return () => clearTimeout(timer);
  }, [user, logout]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
