import { useContext } from "react";
import { AuthContext } from "../context/_AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
