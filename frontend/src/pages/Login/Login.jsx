import Background from "../../components/Background/Background";
import LoginForm from "../../components/LoginForm/LoginForm";
import logoComunidad from "../../assets/logo-comunidad.png";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <Background />

      <div className="login-overlay" />

      <div className="login-shell">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand__logo">
              <img src={logoComunidad} alt="Logo comunidad" />
            </div>

            <div className="login-brand__text">
              <span>Portal de la Comunidad</span>
              <small>Reuniones · Incidencias · Documentos</small>
            </div>
          </div>

          <div className="login-card__header">
            <h1>Jardines de las Ramblas</h1>
            <p>Accede con tu DNI para entrar o activar tu cuenta.</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}