import { useEffect, useState } from "react";

interface DashboardData {
  totalItems: number;
  totalStock: number;
  totalIn: number;
  totalOut: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const API_URL = "https://localhost:7238/api/transactions/dashboard";

  useEffect(() => {
    console.log("========== DASHBOARD DEBUG ==========");

    const token = localStorage.getItem("token");

    console.log("Token from localStorage:", token);

    if (!token) {
      console.warn("❌ No token found.");
      return;
    }

    console.log("🚀 Sending request to:", API_URL);

    fetch(API_URL, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        console.log("Response Status:", res.status);

        const text = await res.text();

        console.log("Raw Response:", text);

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${text}`);
        }

        return JSON.parse(text);
      })
      .then((result) => {
        console.log("Dashboard Data:", result);
        setData(result);
      })
      .catch((err) => {
        console.error("Dashboard Error:", err);
      });

  }, []);

  if (!data)
    return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1>📦 Dashboard</h1>

      <p>Total Items: {data.totalItems}</p>

      <p>Total Stock: {data.totalStock}</p>

      <p>Total IN: {data.totalIn}</p>

      <p>Total OUT: {data.totalOut}</p>
    </div>
  );
}