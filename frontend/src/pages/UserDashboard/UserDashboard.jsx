import { useEffect, useState } from "react";
import SidebarUser from "../../components/layout/SidebarUser";
import Topbar from "../../components/layout/Topbar";
import { getMeetings } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "../../assets/dashboard.css";

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [meetings, setMeetings] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getMeetings()
      .then(setMeetings)
      .catch(console.error);
  }, []);

  const userName = user?.name || "Vecino";
  const userDni = user?.dni || "Sin DNI";
  const userHouse = user?.vivienda || "Sin vivienda";

  return (
    <div className="dashboard-shell">
      <SidebarUser
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userName={userName}
        userDni={userDni}
        userHouse={userHouse}
      />

      <div className="dashboard-content">
        <Topbar />

        <main className="dashboard-main">
          {activeSection === "inicio" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Bienvenido, {userName}</h1>
              <p className="dashboard-subtitle">
                Consulta el estado de tu comunidad, reuniones, incidencias y documentos.
              </p>

              <div className="dashboard-cards">
                <div className="dashboard-card summary-accent-green">
                  <h5>Próxima reunión</h5>
                  <p>
                    {meetings.length > 0
                      ? new Date(meetings[0].meeting_date).toLocaleString()
                      : "No hay reuniones programadas"}
                  </p>
                </div>

                <div className="dashboard-card summary-accent-yellow">
                  <h5>Incidencias abiertas</h5>
                  <p>Pendiente de conectar con datos reales</p>
                </div>

                <div className="dashboard-card summary-accent-blue">
                  <h5>Documentos recientes</h5>
                  <p>Pendiente de conectar con datos reales</p>
                </div>
              </div>
            </section>
          )}

          {activeSection === "incidencias" && (
            <section className="dashboard-panel">
              <div className="dashboard-header-row">
                <div>
                  <h1 className="dashboard-title">Mis incidencias</h1>
                  <p className="dashboard-subtitle">
                    Aquí verás tus incidencias creadas y su estado.
                  </p>
                </div>

                <button className="btn btn-primary">Nueva incidencia</button>
              </div>

              <div className="dashboard-table-wrap">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Zona</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Luz fundida</td>
                      <td>Garaje</td>
                      <td><span className="badge text-bg-warning">Pendiente</span></td>
                      <td>04/03/2026</td>
                    </tr>
                    <tr>
                      <td>Fuga de agua</td>
                      <td>Baños públicos</td>
                      <td><span className="badge text-bg-primary">En proceso</span></td>
                      <td>02/03/2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeSection === "reuniones" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Reuniones</h1>
              <p className="dashboard-subtitle">
                Aquí verás las reuniones creadas por el administrador.
              </p>

              {meetings.length === 0 ? (
                <p className="dashboard-empty">No hay reuniones programadas.</p>
              ) : (
                <div className="dashboard-list">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="dashboard-list-item">
                      <h5>{meeting.title}</h5>
                      <p>
                        <strong>Fecha:</strong>{" "}
                        {new Date(meeting.meeting_date).toLocaleString()}
                      </p>
                      <p>{meeting.description || "Sin descripción"}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "documentos" && (
            <section className="dashboard-panel">
              <h1 className="dashboard-title">Documentos</h1>
              <p className="dashboard-subtitle">
                Aquí verás los documentos subidos por la administración.
              </p>

              <div className="dashboard-list">
                <div className="dashboard-list-item">
                  <h5>Normativa piscina.pdf</h5>
                  <p>Publicado por administración</p>
                </div>
                <div className="dashboard-list-item">
                  <h5>Acta reunión marzo.pdf</h5>
                  <p>Publicado por administración</p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}