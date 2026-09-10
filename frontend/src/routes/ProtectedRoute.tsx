import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {

  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#64748b",
        }}
      >
        Loading...
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return <>{children}</>;
}