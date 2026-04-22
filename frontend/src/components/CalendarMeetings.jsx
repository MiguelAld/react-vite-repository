import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Edit2, Trash2, X, Plus } from "lucide-react";

export default function CalendarMeetings() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "10:00",
  });

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err.message || "Error cargando reuniones");
    } finally {
      setLoading(false);
    }
  };

  const getMeetingsForDate = (date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.meeting_date);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const formatMeetingDateTime = (dateString) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      time: "10:00",
    });
    setShowForm(true);
  };

  const handleEdit = (meeting) => {
    const meetingDate = new Date(meeting.meeting_date);

    setSelectedDate(meetingDate);
    setEditingId(meeting.id);
    setFormData({
      title: meeting.title || "",
      description: meeting.description || "",
      time: meetingDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!user?.id) {
        throw new Error("No se ha detectado el usuario administrador");
      }

      const [hours, minutes] = formData.time.split(":");
      const meetingDate = new Date(selectedDate);
      meetingDate.setHours(Number(hours), Number(minutes), 0, 0);

      const meetingData = {
        title: formData.title,
        description: formData.description,
        meeting_date: meetingDate.toISOString().slice(0, 19).replace("T", " "),
        created_by: user.id,
      };

      if (editingId) {
        await updateMeeting(editingId, meetingData);
      } else {
        await createMeeting(meetingData);
      }

      await loadMeetings();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        time: "10:00",
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Error guardando reunión");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar reunión?")) return;

    try {
      setLoading(true);
      setError("");
      await deleteMeeting(id, user.id);
      await loadMeetings();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error eliminando reunión");
    } finally {
      setLoading(false);
    }
  };

  const dateMeetings = getMeetingsForDate(selectedDate);

  return (
    <div className="calendar-meetings calendar-meetings--stacked">
      <div className="calendar-meetings__calendar calendar-meetings__calendar--full">
        <Calendar
          value={selectedDate}
          onChange={handleDateSelect}
          onClickDay={handleDateSelect}
          tileContent={({ date }) => {
            const count = getMeetingsForDate(date).length;
            return count > 0 ? <div className="calendar-badge">{count}</div> : null;
          }}
        />
      </div>

      <div className="calendar-meetings__below">
        <div className="calendar-meetings__header calendar-meetings__header--column">
          <h3>
            {selectedDate.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>

          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            Crear reunión
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {dateMeetings.length > 0 ? (
          <div className="calendar-meetings__list">
            {dateMeetings.map((meeting) => (
              <div key={meeting.id} className="calendar-meetings__item">
                <div className="calendar-meetings__item-header">
                  <h4>{meeting.title}</h4>

                  <div className="calendar-meetings__item-actions">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEdit(meeting)}
                      title="Editar reunión"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(meeting.id)}
                      title="Eliminar reunión"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="calendar-meetings__item-body">
                  <p className="calendar-meetings__item-description">
                    {meeting.description || "Sin descripción"}
                  </p>

                  <p className="calendar-meetings__item-datetime">
                    <strong>Fecha y hora:</strong>{" "}
                    {formatMeetingDateTime(meeting.meeting_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-meetings__empty">
            <p className="text-muted">No hay reuniones para este día.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="calendar-meetings__form-overlay">
          <div className="calendar-meetings__form">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>{editingId ? "Editar reunión" : "Nueva reunión"}</h4>

              <button
                type="button"
                className="btn btn-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-muted mb-3">
              Día seleccionado:{" "}
              <strong>
                {selectedDate.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </strong>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Título</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}