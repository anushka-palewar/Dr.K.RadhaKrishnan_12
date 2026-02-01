import api from "./connection";

export const getHello = () => api.get("/hello");
