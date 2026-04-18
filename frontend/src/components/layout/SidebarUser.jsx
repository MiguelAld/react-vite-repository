import {
  House,
  FileText,
  CalendarDays,
  Wrench,
  Bell,
  LogOut,
} from "lucide-react";

export default function SidebarUser({
  activeSection,
  setActiveSection,
  onLogout,
}) {
  return (
    <aside className="user-app-sidebar">
      <div className="user-app-sidebar__brand">
        <div className="user-app-sidebar__logo">
          <House size={22} />
        </div>
        <span>Comunidad</span>
      </div>

      <nav className="user-app-sidebar__nav">
        <button
          className={`user-app-sidebar__link ${
            activeSection === "inicio" ? "active" : ""
          }`}
          onClick={() => setActiveSection("inicio")}
        >
          <House size={18} />
          <span>Inicio</span>
        </button>

        <button
          className={`user-app-sidebar__link ${
            activeSection === "documentos" ? "active" : ""
          }`}
          onClick={() => setActiveSection("documentos")}
        >
          <FileText size={18} />
          <span>Documentos</span>
        </button>

        <button
          className={`user-app-sidebar__link ${
            activeSection === "reuniones" ? "active" : ""
          }`}
          onClick={() => setActiveSection("reuniones")}
        >
          <CalendarDays size={18} />
          <span>Reuniones</span>
        </button>

        <button
          className={`user-app-sidebar__link ${
            activeSection === "incidencias" ? "active" : ""
          }`}
          onClick={() => setActiveSection("incidencias")}
        >
          <Wrench size={18} />
          <span>Incidencias</span>
        </button>

        <button
          className={`user-app-sidebar__link ${
            activeSection === "novedades" ? "active" : ""
          }`}
          onClick={() => setActiveSection("novedades")}
        >
          <Bell size={18} />
          <span>Novedades</span>
        </button>
      </nav>

      <button className="user-app-sidebar__logout" onClick={onLogout}>
        <LogOut size={18} />
        <span>Cerrar sesión</span>
      </button>
    </aside>
  );
}