import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";

import Sidebar from "../components/Sidebar";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>

      {!sidebarOpen && (
        <button
          className={styles.menuButton}
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu />
        </button>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className={styles.content}>
        <Outlet />
      </main>

    </div>
  );
}