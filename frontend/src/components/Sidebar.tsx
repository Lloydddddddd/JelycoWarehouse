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
import {
  canManageUsers,
  canOperateWarehouse,
  canViewReports,
} from "../utils/permissions";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {

  const navigate = useNavigate();

  const { user, logout } = useAuth();


  function handleLogout() {
    logout();
    navigate("/login");
  }


  function handleNavigate() {
    onClose();
  }


  return (
    <aside
      className={`${styles.sidebar} ${
        isOpen ? styles.open : ""
      }`}
    >

      <div className={styles.top}>

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
            onClick={handleNavigate}
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiHome />
            Dashboard
          </NavLink>



          {canManageUsers(user) && (
            <NavLink
              to="/users"
              onClick={handleNavigate}
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
            onClick={handleNavigate}
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiTag />
            Brands
          </NavLink>



          <NavLink
            to="/items"
            onClick={handleNavigate}
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiPackage />
            Items
          </NavLink>



          <NavLink
            to="/suppliers"
            onClick={handleNavigate}
            className={({ isActive }) =>
              isActive ? styles.active : styles.link
            }
          >
            <FiTruck />
            Suppliers
          </NavLink>



          {canOperateWarehouse(user) && (
            <NavLink
              to="/supplier-deliveries"
              onClick={handleNavigate}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FiDownload />
              Deliveries
            </NavLink>
          )}



          {canOperateWarehouse(user) && (
            <NavLink
              to="/warehouse-releases"
              onClick={handleNavigate}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FiUpload />
              Releases
            </NavLink>
          )}



          {canOperateWarehouse(user) && (
            <NavLink
              to="/transactions"
              onClick={handleNavigate}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FiBarChart2 />
              Transactions
            </NavLink>
          )}



          {canViewReports(user) && (
            <NavLink
              to="/reports"
              onClick={handleNavigate}
              className={({ isActive }) =>
                isActive ? styles.active : styles.link
              }
            >
              <FiFileText />
              Reports
            </NavLink>
          )}


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