import {
  registerRequest,
  loginRequest,
  fetchMeRequest,
  logoutRequest
} from "../api/authApi";

export const registerUser = async (data) => {
  const res = await registerRequest(data);
  return res.data.user;
};

export const loginUser = async (data) => {
  const res = await loginRequest(data);
  return res.data.user;
};

export const fetchMe = async () => {
  const res = await fetchMeRequest();
  return res.data.user;
};

export const logoutUser = async () => {
  await logoutRequest();
};
