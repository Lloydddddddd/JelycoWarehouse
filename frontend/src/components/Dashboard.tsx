import { useCallback, useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import LoadingSpinner from "./common/LoadingSpinner";

import {
  FiPackage,
  FiArchive,
  FiDollarSign,
  FiAlertTriangle,
  FiArrowDownCircle,
  FiArrowUpCircle,
} from "react-icons/fi";

import StatCard from "./StatCard";
import Button from "./ui/Button";

import { getDashboard } from "../services/dashboardService";
import type { Dashboard as DashboardModel } from "../models/Dashboard";

export default function Dashboard() {
  const [data, setData] = useState<DashboardModel | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getDashboard();

      setData(result);
    } catch (err) {
      console.error(err);

      setError("Unable to load dashboard data.");

      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  function formatCurrency(value: number) {
    return `₱${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (loading) {
    return (
      <LoadingSpinner text="Loading dashboard..." />
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <div>
          <p>{error}</p>

          <Button onClick={loadDashboard}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <p className={styles.loading}>
        No dashboard data available.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      <StatCard
        title="Total Items"
        value={data.totalItems}
        icon={<FiPackage />}
      />

      <StatCard
        title="Total Stock"
        value={data.totalStock}
        icon={<FiArchive />}
      />

      <StatCard
        title="Inventory Value"
        value={formatCurrency(data.inventoryValue)}
        icon={<FiDollarSign />}
      />

      <StatCard
        title="Low Stock Items"
        value={data.lowStockItems}
        icon={<FiAlertTriangle />}
      />

      <StatCard
        title="Stock In"
        value={data.totalIn}
        icon={<FiArrowDownCircle />}
      />

      <StatCard
        title="Stock Out"
        value={data.totalOut}
        icon={<FiArrowUpCircle />}
      />
    </div>
  );
}