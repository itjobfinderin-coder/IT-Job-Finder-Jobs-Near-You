import { api } from "./api";

export async function register({ fullName, email, password, role }) {
  const { data } = await api.post("/auth/register", {
    fullName,
    email,
    password,
    role,
  });
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

// Converts an Axios error into a message suitable for display.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error.response) {
    return error.response.data?.message || fallback;
  }
  if (error.request) {
    return "Cannot reach the server. Check that the backend is running.";
  }
  return fallback;
}
