import LoginForm from "../../components/LoginForm/LoginForm";
import logoComunidad from "../../assets/images/logo-comunidad.png";
import bannerComunidad from "../../assets/images/banner-comunidad.png";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page">

      <div className="login-overlay" />

      <main className="login-layout">
        <section className="login-panel login-panel--form">
          <div className="login-form-card">
            <div className="login-brand">
              <img
                src={logoComunidad}
                alt="Logo Jardines de las Ramblas"
                className="login-brand__logo"
              />

              <div className="login-brand__text">
                <strong>Jardines de las Ramblas</strong>
                <span>Portal de la comunidad</span>
              </div>
            </div>

            <div className="login-card__header">
              <span className="login-kicker">Acceso privado</span>

              <h1>Bienvenido de nuevo</h1>

              <p>
                Accede con tu DNI para entrar al portal o activar tu cuenta por
                primera vez.
              </p>
            </div>

            <LoginForm />

            <p className="login-footer-text">
              Plataforma interna para vecinos y administración.
            </p>
          </div>
        </section>

        <section className="login-panel login-panel--visual">
          <div className="login-visual-card">
            <div className="login-visual-banner">
              <img src={bannerComunidad} alt="Jardines de las Ramblas" />
            </div>

            <div className="login-visual-content">
              <span className="login-visual-tag">Comunidad digital</span>

              <h2 className="login-title">
                <span>Jardines de</span>
                <span>Las Ramblas</span>
              </h2>

              <p>
                Un espacio centralizado para consultar comunicados, enviar
                incidencias y acceder a la documentación de la comunidad.
              </p>
            </div>

            <div className="login-visual-stats">
              <div>
                <strong>24/7</strong>
                <span>Acceso online</span>
              </div>

              <div>
                <strong>4</strong>
                <span>Áreas principales</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Comunidad</span>
                <span>conectada</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}