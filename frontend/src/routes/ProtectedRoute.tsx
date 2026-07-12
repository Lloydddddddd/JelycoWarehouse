import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}