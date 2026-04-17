import {
  FileText,
  CalendarDays,
  Wrench,
  LogOut,
  House,
  UserCircle2,
} from "lucide-react";

export default function SidebarUser({
  activeSection,
  setActiveSection,
  userName,
  userDni,
  userHouse,
}) {
  return (
    <aside className="user-sketch-layout">
      <div className="user-sketch-top-icon">
        <button
          className={`user-sketch-home-btn ${
            activeSection === "inicio" ? "active" : ""
          }`}
          onClick={() => setActiveSection("inicio")}
          title="Inicio"
        >
          <House size={28} />
        </button>
      </div>

      <div className="user-sketch-profile-card">
        <div className="user-sketch-profile-row">
          <UserCircle2 size={22} />
          <span className="user-sketch-profile-name">{userName}</span>
        </div>
        <p><strong>DNI:</strong> {userDni}</p>
        <p><strong>Vivienda:</strong> {userHouse}</p>
      </div>

      <div className="user-sketch-nav">
        <button
          className={`user-sketch-nav-item ${
            activeSection === "documentos" ? "active" : ""
          }`}
          onClick={() => setActiveSection("documentos")}
        >
          <div className="user-sketch-nav-icon">
            <FileText size={34} />
          </div>
          <span>Documentos</span>
        </button>

        <button
          className={`user-sketch-nav-item ${
            activeSection === "reuniones" ? "active" : ""
          }`}
          onClick={() => setActiveSection("reuniones")}
        >
          <div className="user-sketch-nav-icon">
            <CalendarDays size={34} />
          </div>
          <span>Reuniones</span>
        </button>

        <button
          className={`user-sketch-nav-item ${
            activeSection === "incidencias" ? "active" : ""
          }`}
          onClick={() => setActiveSection("incidencias")}
        >
          <div className="user-sketch-nav-icon">
            <Wrench size={34} />
          </div>
          <span>Incidencias</span>
        </button>

        <button className="user-sketch-nav-item user-sketch-nav-item--logout">
          <div className="user-sketch-nav-icon">
            <LogOut size={34} />
          </div>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}