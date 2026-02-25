// src/pages/Login.jsx
import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [dni, setDni] = useState("");
  const [pwd, setPwd] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // UI only (sin backend)
    alert("Login UI listo ✅ (más adelante conectamos con backend)");
  };

  return (
    <div className="lg-page">
      <div className="lg-bg" />

      <div className="lg-wrap">
        <header className="lg-brand">
          <div className="lg-logo">🏡</div>
          <div>
            <h1 className="lg-title">Portal de la Comunidad</h1>
            <p className="lg-subtitle">
              Reuniones · Incidencias · Documentos · Avisos
            </p>
          </div>
        </header>

        <section className="lg-card" aria-label="Formulario de inicio de sesión">
          <h2 className="lg-card-title">Iniciar sesión</h2>
          <p className="lg-card-help">
            Introduce tu DNI y contraseña para acceder.
          </p>

          <form onSubmit={submit} className="lg-form">
            <div className="lg-field">
              <label className="lg-label" htmlFor="dni">DNI</label>
              <input
                id="dni"
                className="lg-input"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 12345678A"
                autoComplete="username"
              />
            </div>

            <div className="lg-field">
              <label className="lg-label" htmlFor="pwd">Contraseña</label>
              <input
                id="pwd"
                className="lg-input"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </div>

            <button className="lg-btn" type="submit">
              Entrar
            </button>

            <div className="lg-footer">
              <button
                type="button"
                className="lg-link"
                onClick={() => alert("Luego añadimos recuperar contraseña")}
              >
                ¿Olvidaste tu contraseña?
              </button>

              <span className="lg-muted">v0.1 TFG</span>
            </div>
          </form>
        </section>

        <footer className="lg-note">
          <span className="lg-dot" />
          <span>
            Acceso privado para vecinos y administración de la urbanización.
          </span>
        </footer>
      </div>
    </div>
  );
}