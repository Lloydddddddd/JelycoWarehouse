import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiDownload,
  FiUpload,
  FiClipboard,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";

import styles from "./Sidebar.module.css";
import Button from "./ui/Button";

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <div className={styles.logoCircle}>
            JW
          </div>

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
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) =>
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiPackage />
            Items
          </NavLink>

          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiTruck />
            Suppliers
          </NavLink>

          <NavLink
            to="/supplier-deliveries"
            className={({ isActive }) =>
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiDownload />
            Deliveries
          </NavLink>

          <NavLink
            to="/warehouse-releases"
            className={({ isActive }) =>
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiUpload />
            Releases
          </NavLink>

          <NavLink
            to="/inventory-adjustments"
            className={({ isActive }) =>
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiClipboard />
            Adjustments
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              isActive
                ? styles.active
                : styles.link
            }
          >
            <FiBarChart2 />
            Transactions
          </NavLink>
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            A
          </div>

          <div>
            <div className={styles.userName}>
              Administrator
            </div>

            <div className={styles.userRole}>
              Warehouse Admin
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={logout}
        >
          <FiLogOut
            style={{ marginRight: 8 }}
          />
          Logout
        </Button>
      </div>
    </aside>
  );
}