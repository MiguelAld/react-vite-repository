import {
  LayoutDashboard,
  Wrench,
  BarChart3,
  FileText,
  CalendarDays,
  Users,
  MapPinned,
} from "lucide-react";

export default function SidebarAdmin({
  activeSection,
  setActiveSection,
  userName,
  userDni,
  userHouse,
}) {
  return (
    <aside className="sidebar-user">
      <div className="sidebar-user__top">
        <h2 className="sidebar-user__logo">Comunidad</h2>

        <nav className="sidebar-user__nav">
          <button
            className={`sidebar-user__link ${activeSection === "inicio" ? "active" : ""}`}
            onClick={() => setActiveSection("inicio")}
          >
            <LayoutDashboard size={18} />
            <span>Inicio</span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "incidencias" ? "active" : ""}`}
            onClick={() => setActiveSection("incidencias")}
          >
            <Wrench size={18} />
            <span>Incidencias</span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "zonas" ? "active" : ""}`}
            onClick={() => setActiveSection("zonas")}
          >
            <MapPinned size={18} />
            <span>Zonas</span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "documentos" ? "active" : ""}`}
            onClick={() => setActiveSection("documentos")}
          >
            <FileText size={18} />
            <span>Documentos</span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "reuniones" ? "active" : ""}`}
            onClick={() => setActiveSection("reuniones")}
          >
            <CalendarDays size={18} />
            <span>Reuniones</span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveSection("usuarios")}
          >
            <Users size={18} />
            <span>Usuarios</span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "reportes" ? "active" : ""}`}
            onClick={() => setActiveSection("reportes")}
          >
            <BarChart3 size={18} />
            <span>Reportes</span>
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
            <span>Casa: {userHouse}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}