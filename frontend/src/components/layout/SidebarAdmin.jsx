import {
  LayoutDashboard,
  Wrench,
  BarChart3,
  FileText,
  CalendarDays,
  Users,
  MapPinned,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SidebarAdmin({
  activeSection,
  setActiveSection,
  userName,
  userDni,
  userHouse,
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <aside className="sidebar-user">
      <div className="sidebar-user__top">
        <h2 className="sidebar-user__logo">Jardines de las ramblas</h2>

        <nav className="sidebar-user__nav">
          <button
            className={`sidebar-user__link ${activeSection === "comunicados" ? "active" : ""}`}
            onClick={() => setActiveSection("comunicados")}
          >
            Comunicados
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "incidencias" ? "active" : ""}`}
            onClick={() => setActiveSection("incidencias")}
          >
            Incidencias
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "zonas" ? "active" : ""}`}
            onClick={() => setActiveSection("zonas")}
          >
            Zonas Públicas
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "reuniones" ? "active" : ""}`}
            onClick={() => setActiveSection("reuniones")}
          >
            Reuniones
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "documentos" ? "active" : ""}`}
            onClick={() => setActiveSection("documentos")}
          >
            Documentos
          </button>
        </nav>
      </div>

      <div className="sidebar-user__bottom">
        <div className="sidebar-user__profile">
          <div className="sidebar-user__avatar">
            {userName?.[0] || "A"}
          </div>

          <div className="sidebar-user__info">
            <strong>{userName}</strong>
            <span>DNI: {userDni}</span>
            <span>Propiedad: {userHouse}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline-danger w-100 mt-3"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}