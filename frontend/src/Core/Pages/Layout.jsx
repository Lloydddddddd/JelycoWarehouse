import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear auth token
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "w-64" : "w-0"
        } bg-white shadow-md transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">Jelyco Warehouse</h1>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink
            to="/items"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            📦 Items
          </NavLink>
          <NavLink
            to="/suppliers"
            className={({ isActive }) =>
              `block px-3 py-2 rounded transition ${
                isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"
              }`
            }
          >
            🏭 Suppliers
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center relative">
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center gap-4">
            {/* Sidebar toggle for mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              ☰
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <span className="text-gray-700">Lloyd</span>
                <span className="text-gray-500">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}