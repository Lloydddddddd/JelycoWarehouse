import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ItemsPage from "./pages/ItemsPage";
import SuppliersPage from "./pages/SuppliersPage";
import TransactionsPage from "./pages/TransactionsPage";
import SupplierDeliveriesPage from "./pages/SupplierDeliveriesPage";
import WarehouseReleasesPage from "./pages/WarehouseReleasesPage";
import InventoryAdjustmentsPage from "./pages/InventoryAdjustmentsPage";
import BrandsPage from "./pages/BrandsPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const handleLogin = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={handleLogin}
            />
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/brands"
            element={<BrandsPage />}
          />

          <Route
            path="/items"
            element={<ItemsPage />}
          />

          <Route
            path="/suppliers"
            element={<SuppliersPage />}
          />

          <Route
            path="/transactions"
            element={<TransactionsPage />}
          />

          <Route
            path="/supplier-deliveries"
            element={
              <SupplierDeliveriesPage />
            }
          />

          <Route
            path="/warehouse-releases"
            element={
              <WarehouseReleasesPage />
            }
          />

          <Route
            path="/inventory-adjustments"
            element={<InventoryAdjustmentsPage />}
          />
        </Route>

        {/* Default */}
        <Route
          path="*"
          element={
            token ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

      </Routes>
    </BrowserRouter>
  );
}