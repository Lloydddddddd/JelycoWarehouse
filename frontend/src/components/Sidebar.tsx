import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiTag,
  FiTruck,
  FiDownload,
  FiUpload,
  FiBarChart2,
  FiFileText,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

import styles from "./Sidebar.module.css";
import Button from "./ui/Button";

export default function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logoCircle}>JW</div>

          <div>
            <h2 className={styles.logo}>
              Jelyco
            </h2>

            <p className={styles.subtitle}>
              Warehouse Management
            </p>
          </div>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiHome />
            Dashboard
          </NavLink>

          {user?.role === "Admin" && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FiUsers />
              Users
            </NavLink>
          )}

          <NavLink
            to="/brands"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiTag />
            Brands
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiPackage />
            Items
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiTruck />
            Suppliers
          </NavLink>

          <NavLink
            to="/supplier-deliveries"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiDownload />
            Deliveries
          </NavLink>

          <NavLink
            to="/warehouse-releases"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiUpload />
            Releases
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiBarChart2 />
            Transactions
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiFileText />
            Reports
          </NavLink>
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user?.fullName?.charAt(0).toUpperCase() ?? "?"}
          </div>

          <div>
            <div className={styles.userName}>
              {user?.fullName ?? "Loading..."}
            </div>

            <div className={styles.userRole}>
              {user?.role ?? ""}
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={handleLogout}
        >
          <FiLogOut style={{ marginRight: 8 }} />
          Logout
        </Button>
      </div>
    </aside>
  );
}