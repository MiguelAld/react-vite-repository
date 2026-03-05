import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard.jsx";
import UserDashboard from "./pages/UserDashboard/UserDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";

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