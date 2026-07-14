import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

import {
  FiPackage,
  FiArchive,
  FiDollarSign,
  FiAlertTriangle,
  FiArrowDownCircle,
  FiArrowUpCircle,
} from "react-icons/fi";

import StatCard from "./StatCard";

import { getDashboard } from "../services/dashboardService";
import type { Dashboard as DashboardModel } from "../models/Dashboard";

export default function Dashboard() {
  const [data, setData] =
    useState<DashboardModel | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result =
          await getDashboard();

        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <p className={styles.loading}>
        Loading dashboard...
      </p>
    );
  }

  if (!data) {
    return (
      <p className={styles.loading}>
        Failed to load dashboard.
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
        value={`₱${data.inventoryValue.toLocaleString()}`}
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