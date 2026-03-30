import { House, Wrench, CalendarDays, FileText, LogOut, Bell } from "lucide-react";

export default function SidebarUser({ activeSection, setActiveSection, userName, userDni, userHouse }) {
  return (
    <aside className="sidebar-user">
      <div className="sidebar-user__top">
        <h2 className="sidebar-user__logo">Comunidad</h2>

        <nav className="sidebar-user__nav">
          <button
            className={`sidebar-user__link ${activeSection === "inicio" ? "active" : ""}`}
            onClick={() => setActiveSection("inicio")}
          >
            <House size={18} />
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
            className={`sidebar-user__link ${activeSection === "reuniones" ? "active" : ""}`}
            onClick={() => setActiveSection("reuniones")}
          >
            <CalendarDays size={18} />
            <span>Reuniones</span>
            <span className="sidebar-user__dot">
              <Bell size={14} />
            </span>
          </button>

          <button
            className={`sidebar-user__link ${activeSection === "documentos" ? "active" : ""}`}
            onClick={() => setActiveSection("documentos")}
          >
            <FileText size={18} />
            <span>Documentos</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-user__bottom">
        <div className="sidebar-user__profile">
          <div className="sidebar-user__avatar">
            {userName?.[0] || "U"}
          </div>

          <div className="sidebar-user__info">
            <strong>{userName}</strong>
            <span>DNI: {userDni}</span>
            <span>Casa: {userHouse}</span>
          </div>
        </div>

        <button className="sidebar-user__logout">
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}