import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../Pages/Layout";
import PrivateRoute from "./PrivateRoute";
import { Navigate } from "react-router-dom";

// Feature pages
import ItemsPage from "../../Features/Items/Pages/ItemsPage";
import SuppliersPage from "../../Features/Suppliers/Pages/SuppliersPage";
import Login from "../../Features/Auth/Pages/Login";
import Register from "../../Features/Auth/Pages/Register";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes wrapped with Layout */}
        <Route
          path="/items"
          element={
            <PrivateRoute>
              <Layout>
                <ItemsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <PrivateRoute>
              <Layout>
                <SuppliersPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/items" />} />
      </Routes>
    </Router>
  );
}