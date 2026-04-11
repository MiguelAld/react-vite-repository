import { useState } from "react";
import { apiLogin, checkDni, setPassword } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [step, setStep] = useState("dni");
  const [dni, setDni] = useState("");
  const [password, setPasswordValue] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleCheckDni = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await checkDni(dni.trim());

      if (data.hasPassword) {
        setStep("login");
      } else {
        setStep("setPassword");
      }
    } catch (e) {
      setErr(e.message || "Error comprobando DNI");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await setPassword(dni.trim(), password);
      setPasswordValue("");
      setStep("login");
    } catch (e) {
      setErr(e.message || "Error creando contraseña");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await apiLogin(dni.trim(), password);
      login(data);

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/vecino");
      }
    } catch (e) {
      setErr(e.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {err && <div className="alert alert-danger">{err}</div>}

      {step === "dni" && (
        <form onSubmit={handleCheckDni}>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input
              className="form-control"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ej: 12345678A"
              autoComplete="username"
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Comprobando..." : "Continuar"}
          </button>
        </form>
      )}

      {step === "setPassword" && (
        <form onSubmit={handleSetPassword}>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input className="form-control" value={dni} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Nueva contraseña</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Crea tu contraseña"
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      )}

      {step === "login" && (
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">DNI</label>
            <input className="form-control" value={dni} disabled />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPasswordValue(e.target.value)}
              placeholder="Introduce tu contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      )}
    </>
  );
}