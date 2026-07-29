import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  LogOut,
  ChevronDown,
} from "lucide-react";

import styles from "./Topbar.module.css";

import { getCurrentUser } from "../services/userService";
import type { User as AppUser } from "../models/user";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setUser(await getCurrentUser());
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={styles.topbar}>
      <h1>{title}</h1>

      <div className={styles.profile} ref={menuRef}>
        <button
          className={styles.profileButton}
          onClick={() => setOpen(!open)}
        >
          <div className={styles.avatar}>
            <User size={18} />
          </div>

          <div className={styles.userInfo}>
            <span className={styles.name}>
              {user?.fullName ?? "Loading..."}
            </span>

            <span className={styles.role}>
              {user?.role}
            </span>
          </div>

          <ChevronDown
            size={18}
            className={`${styles.chevron} ${
              open ? styles.rotate : ""
            }`}
          />
        </button>

        {open && (
          <div className={styles.dropdown}>
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
            >
              <User size={18} />
              My Profile
            </button>

            <button
              onClick={() => {
                navigate("/change-password");
                setOpen(false);
              }}
            >
              <Lock size={18} />
              Change Password
            </button>

            <hr />

            <button
              className={styles.logout}
              onClick={logout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}