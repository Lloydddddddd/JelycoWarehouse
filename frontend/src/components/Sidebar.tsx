import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import Button from "./ui/Button";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>
        Jelyco Warehouse
      </h2>

      <nav className={styles.nav}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? styles.active
              : styles.link
          }
        >
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
          Suppliers
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            isActive
              ? styles.active
              : styles.link
          }
        >
          Transactions
        </NavLink>

        <NavLink
          to="/supplier-deliveries"
          className={({ isActive }) =>
            isActive
              ? styles.active
              : styles.link
          }
        >
          Supplier Deliveries
        </NavLink>
      </nav>

      <Button
        variant="danger"
        onClick={logout}
      >
        Logout
      </Button>
    </aside>
  );
}