import { useState } from "react";
import { createMeeting } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CreateMeeting() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meeting_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!user || !user.id) {
        throw new Error("No se ha detectado el usuario administrador. Vuelve a iniciar sesión.");
      }

      await createMeeting({
        title: formData.title,
        description: formData.description,
        meeting_date: formData.meeting_date,
        created_by: user.id,
      });

      setMessage("Reunión creada correctamente");
      setFormData({
        title: "",
        description: "",
        meeting_date: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al crear reunión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-block">
      <h3>Crear reunión</h3>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha y hora</label>
          <input
            type="datetime-local"
            className="form-control"
            name="meeting_date"
            value={formData.meeting_date}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear reunión"}
        </button>
      </form>
    </div>
  );
}