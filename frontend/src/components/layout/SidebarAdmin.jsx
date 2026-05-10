import {
  Megaphone,
  Wrench,
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
        <h2 className="sidebar-user__logo">Jardines de las Ramblas</h2>

        <nav className="sidebar-user__nav">
          <button
            type="button"
            className={`sidebar-user__link ${
              activeSection === "comunicados" || activeSection === "reportes"
                ? "active"
                : ""
            }`}
            onClick={() => setActiveSection("comunicados")}
          >
            <Megaphone size={18} />
            <span>Comunicados</span>
          </button>

          <button
            type="button"
            className={`sidebar-user__link ${
              activeSection === "incidencias" ? "active" : ""
            }`}
            onClick={() => setActiveSection("incidencias")}
          >
            <Wrench size={18} />
            <span>Incidencias</span>
          </button>

          <button
            type="button"
            className={`sidebar-user__link ${
              activeSection === "zonas" ? "active" : ""
            }`}
            onClick={() => setActiveSection("zonas")}
          >
            <MapPinned size={18} />
            <span>Zonas Públicas</span>
          </button>

          <button
            type="button"
            className={`sidebar-user__link ${
              activeSection === "reuniones" ? "active" : ""
            }`}
            onClick={() => setActiveSection("reuniones")}
          >
            <CalendarDays size={18} />
            <span>Reuniones</span>
          </button>

          <button
            type="button"
            className={`sidebar-user__link ${
              activeSection === "documentos" ? "active" : ""
            }`}
            onClick={() => setActiveSection("documentos")}
          >
            <FileText size={18} />
            <span>Documentos</span>
          </button>

          <button
            type="button"
            className={`sidebar-user__link ${
              activeSection === "usuarios" ? "active" : ""
            }`}
            onClick={() => setActiveSection("usuarios")}
          >
            <Users size={18} />
            <span>Usuarios</span>
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
          type="button"
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