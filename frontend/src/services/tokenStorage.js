const TOKEN_KEY = "jobfinder.token";
const USER_KEY = "jobfinder.user";

// Decodes the JWT payload for client-side expiry checks only.
// The signature is NOT verified here; the backend remains the authority.
export function decodeTokenPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeTokenPayload(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp * 1000 <= Date.now();
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Only non-sensitive profile fields (id, email, role) are stored alongside the token.
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
