import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import { useAuth } from "./context/AuthContext";

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <RequireAuth role="ADMIN">
            <AdminDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/vecino"
        element={
          <RequireAuth role="VECINO">
            <UserDashboard />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}