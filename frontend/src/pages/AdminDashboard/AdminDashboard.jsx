import { useState } from "react";

export default function AdminDashboard() {
  const [section, setSection] = useState("inicio");

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        
        {/* Sidebar */}
        <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white p-3">
          <h4 className="mb-4">Admin Panel</h4>

          <div className="d-grid gap-2">
            <button className="btn btn-outline-light text-start" onClick={() => setSection("inicio")}>
              Inicio
            </button>
            <button className="btn btn-outline-light text-start" onClick={() => setSection("incidencias")}>
              Incidencias
            </button>
            <button className="btn btn-outline-light text-start" onClick={() => setSection("reportes")}>
              Reportes
            </button>
            <button className="btn btn-outline-light text-start" onClick={() => setSection("documentos")}>
              Documentos
            </button>
            <button className="btn btn-outline-light text-start" onClick={() => setSection("reuniones")}>
              Reuniones
            </button>
            <button className="btn btn-outline-light text-start" onClick={() => setSection("usuarios")}>
              Usuarios
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-12 col-md-9 col-lg-10 p-4 bg-light">
          {section === "inicio" && (
            <>
              <h2 className="mb-4">Resumen general</h2>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>Incidencias pendientes</h5>
                      <p className="display-6">4</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>Documentos subidos</h5>
                      <p className="display-6">12</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>Próximas reuniones</h5>
                      <p className="display-6">2</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {section === "incidencias" && (
            <>
              <h2 className="mb-4">Gestión de incidencias</h2>
              <div className="card shadow-sm">
                <div className="card-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Zona</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Luz rota en garaje</td>
                        <td>Garaje</td>
                        <td><span className="badge bg-warning text-dark">Pendiente</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {section === "reportes" && <h2>Sección Reportes</h2>}
          {section === "documentos" && <h2>Sección Documentos</h2>}
          {section === "reuniones" && <h2>Sección Reuniones</h2>}
          {section === "usuarios" && <h2>Sección Usuarios</h2>}
        </main>
      </div>
    </div>
  );
}