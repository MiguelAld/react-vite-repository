import Background from "../../components/Background/Background";
import LoginForm from "../../components/LoginForm/LoginForm";
import logoComunidad from "../../assets/logo-comunidad.png";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <Background />

      <div className="login-bg-soft" />

      <main className="login-layout">
        <section className="login-panel login-panel--form">
          <div className="login-form-wrap">
            <div className="login-logo-mobile">
              <img src={logoComunidad} alt="Jardines de las Ramblas" />
            </div>

            <div className="login-kicker">Portal privado de la comunidad</div>

            <h1 className="login-title">Bienvenido</h1>

            <p className="login-description">
              Accede con tu DNI para consultar comunicados, gestionar incidencias
              y revisar documentos de la comunidad.
            </p>

            <LoginForm />

            <p className="login-footer-note">
              Jardines de las Ramblas · Acceso exclusivo para vecinos
            </p>
          </div>
        </section>

        <section className="login-panel login-panel--visual">
          <div className="login-visual-card">
            <div className="login-visual-logo">
              <img src={logoComunidad} alt="Logo comunidad" />
            </div>

            <div className="login-visual-content">
              <span className="login-visual-tag">Comunidad digital</span>

              <h2>Jardines de las Ramblas</h2>

              <p>
                Un espacio centralizado para mantener informados a los vecinos,
                comunicar incidencias y acceder a documentos importantes.
              </p>
            </div>

            <div className="login-visual-stats">
              <div>
                <strong>24/7</strong>
                <span>Acceso online</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Áreas principales</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Comunidad conectada</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}