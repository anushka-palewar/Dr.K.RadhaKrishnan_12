import api from "./connection";

export const registerRequest = (data) => {
  return api.post("/auth/register", data);
};

export const loginRequest = (data) => {
  return api.post("/auth/login", data);
};

export const fetchMeRequest = () => {
  return api.get("/auth/me");
};

export const logoutRequest = () => {
  return api.post("/auth/logout");
};
