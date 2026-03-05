import Background from "../components/Background/Background.jsx";
import LoginForm from "../components/LoginForm/LoginForm.jsx";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-page">
      <Background />

      <div className="container login-shell">
        <div className="login-card card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="badge bg-light text-dark border">🏡</div>
              <div>
                <h1 className="h5 mb-0">Portal de la Comunidad</h1>
                <small className="text-secondary">
                  Reuniones · Incidencias · Documentos
                </small>
              </div>
            </div>

            <h2 className="h4 mb-1">Iniciar sesión</h2>
            <p className="text-secondary mb-3">
              Accede con tu DNI (vecino) o credenciales de administración.
            </p>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}