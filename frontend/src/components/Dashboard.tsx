import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

import StatCard from "./StatCard";

import { getDashboard } from "../services/dashboardService";
import type { Dashboard as DashboardModel } from "../models/Dashboard";

export default function Dashboard() {
  const [data, setData] = useState<DashboardModel | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className={styles.grid}>
      <StatCard
        title="Total Items"
        value={data.totalItems}
        icon="📦"
      />

      <StatCard
        title="Total Stock"
        value={data.totalStock}
        icon="📊"
      />

      <StatCard
        title="Stock In"
        value={data.totalIn}
        icon="📥"
      />

      <StatCard
        title="Stock Out"
        value={data.totalOut}
        icon="📤"
      />
    </div>
  );
}