import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API } from "../config/api";
import Toast from "./common/Toast";

export default function Login({
  onLogin,
}: {
  onLogin: (token: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">(
      "error"
    );

  const navigate = useNavigate();

  function showToast(
    message: string,
    type: "success" | "error"
  ) {
    setToastMessage(message);
    setToastType(type);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }

  async function handleLogin() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(API.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(
          data.message ?? "Login failed.",
          "error"
        );

        return;
      }

      localStorage.setItem(
        "token",
        data.tokens.token
      );

      localStorage.setItem(
        "refreshToken",
        data.tokens.refreshToken
      );

      onLogin(data.tokens.token);

      showToast(
        "Login successful.",
        "success"
      );

      navigate("/dashboard");
    }
    catch (err) {
      console.error(err);

      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
        }}
      >
        <div
          style={{
            width: "420px",
            background: "#fff",
            borderRadius: "18px",
            padding: "40px",
            boxShadow:
              "0 15px 35px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "16px",
                background: "#2563eb",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "28px",
                fontWeight: "bold",
                margin:
                  "0 auto 18px",
              }}
            >
              JW
            </div>

            <h1
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              Jelyco
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#6b7280",
              }}
            >
              Warehouse Management
              System
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #d1d5db",
                  fontSize: "15px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            <div
              style={{
                marginBottom: "30px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #d1d5db",
                  fontSize: "15px",
                  boxSizing:
                    "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background:
                  "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius:
                  "10px",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading
                  ? 0.7
                  : 1,
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}