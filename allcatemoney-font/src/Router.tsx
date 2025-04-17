import React, { JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/dashboard/Home";
import Login from "./pages/auth/LoginPage";
import NotFound from "./pages/Notfound";

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
