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
import BrandsPage from "./pages/BrandsPage";
import ReportsPage from "./pages/ReportsPage";
import ProfilePage from "./pages/ProfilePage";
import UsersPage from "./pages/UsersPage";

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

        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={handleLogin}
            />
          }
        />

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
            path="/profile"
            element={<ProfilePage />}
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
            path="/supplier-deliveries"
            element={<SupplierDeliveriesPage />}
          />

          <Route
            path="/warehouse-releases"
            element={<WarehouseReleasesPage />}
          />

          <Route
            path="/transactions"
            element={<TransactionsPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />

          <Route
            path="/users"
            element={<UsersPage />}
          />
        </Route>

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