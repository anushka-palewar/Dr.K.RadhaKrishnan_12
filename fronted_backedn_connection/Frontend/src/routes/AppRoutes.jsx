import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import AIAssistance from "../Pages/AIAssistance";
import AddRequest from "../Pages/AddRequest";

import ProtectedRoute from "../components/layout/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🔹 Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔹 Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-assistance"
        element={
          <ProtectedRoute>
            <AIAssistance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-request"
        element={
          <ProtectedRoute>
            <AddRequest />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
