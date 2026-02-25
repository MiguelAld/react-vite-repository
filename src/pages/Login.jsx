// src/pages/Login.jsx
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [dni, setDni] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // de momento solo llamamos al backend (lo haremos en el paso 2)
    alert("UI lista. Ahora conectamos con backend.");
  };

  return (
    <div className="lg-page">
      <div className="lg-container">
        <div className="lg-header">
          <div className="lg-logo">🏡</div>
          <div>
            <h1 className="lg-title">Portal de la Comunidad</h1>
            <p className="lg-subtitle">
              Reuniones · Incidencias · Documentos · Avisos
            </p>
          </div>
        </div>

        <div className="lg-card">
          <h2 className="lg-card-title">Iniciar sesión</h2>
          <p className="lg-card-help">Introduce tu DNI y contraseña.</p>

          {error && <div className="lg-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="lg-field">
              <label className="lg-label">DNI</label>
              <input
                className="lg-input"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 12345678A"
                autoComplete="username"
                required
              />
            </div>

            <div className="lg-field">
              <label className="lg-label">Contraseña</label>
              <input
                type="password"
                className="lg-input"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button className="lg-btn" type="submit">
              Entrar
            </button>

            <div className="lg-footer">
              <button type="button" className="lg-link">
                ¿Olvidaste tu contraseña?
              </button>
              <span className="lg-version">v0.1 TFG</span>
            </div>
          </form>
        </div>

        <div className="lg-note">
          <span className="lg-dot"></span>
          <span>Acceso privado para vecinos y administración.</span>
        </div>
      </div>
    </div>
  );
}