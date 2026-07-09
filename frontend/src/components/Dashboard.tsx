import { useEffect, useState } from "react";
import { API } from "../config/api";
import StatCard from "./StatCard";
import styles from "./Dashboard.module.css";

interface DashboardData {
  totalItems: number;
  totalStock: number;
  totalIn: number;
  totalOut: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const API_URL = API.transactions.dashboard;

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ No token found.");
      return;
    }

    fetch(API_URL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {

        const text = await res.text();

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${text}`);
        }

        return JSON.parse(text);
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
      });

  }, []);

  if (!data)
    return <p>Loading dashboard...</p>;

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