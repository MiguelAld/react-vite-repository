import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Ban,
  Plus,
  X,
} from "lucide-react";

import {
  getReservations,
  createReservation,
  createAdminReservation,
  updateReservationStatus,
} from "../../services/api";

import { useAuth } from "../../context/AuthContext";

export default function CalendarReservations({ mode = "user", onReservationsChange, }) {
  const { user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    purpose: "",
    notes: "",
  });

  const isAdminMode = mode === "admin";

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReservations();
      const safeReservations = data || [];

      setReservations(safeReservations);
      onReservationsChange?.(safeReservations);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error cargando reservas");
    } finally {
      setLoading(false);
    }
  };

  const toDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const reservationDateKey = (reservation) => {
    if (!reservation?.reservation_date) return "";
    return String(reservation.reservation_date).slice(0, 10);
  };

  const getReservationsForDate = (date) => {
    const key = toDateKey(date);

    return reservations.filter(
      (reservation) => reservationDateKey(reservation) === key
    );
  };

  const getActiveReservationsForDate = (date) => {
    return getReservationsForDate(date).filter((reservation) =>
      ["PENDIENTE", "APROBADA"].includes(reservation.status)
    );
  };

  const selectedDateReservations = getReservationsForDate(selectedDate);

  const selectedDateActiveReservations =
    getActiveReservationsForDate(selectedDate);

  const hasBlockedReservation = selectedDateActiveReservations.length > 0;

  const isPastSelectedDate = useMemo(() => {
    const target = new Date(selectedDate);
    target.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return target < today;
  }, [selectedDate]);

  const formatLongDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatReservationDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(
      `${String(dateString).slice(0, 10)}T00:00:00`
    ).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getPersonName = (person) => {
    if (!person) return "—";

    return [person.name, person.apellidos].filter(Boolean).join(" ") || "—";
  };

  const getProperty = (person) => {
    if (!person) return "—";

    return [person.portal, person.vivienda].filter(Boolean).join(" ") || "—";
  };

  const getStatusClass = (status) => {
    if (status === "APROBADA") return "reservation-status--approved";
    if (status === "RECHAZADA") return "reservation-status--rejected";
    if (status === "CANCELADA") return "reservation-status--cancelled";
    return "reservation-status--pending";
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleOpenForm = () => {
    setError("");
    setFormData({
      purpose: "",
      notes: "",
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      purpose: "",
      notes: "",
    });
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();

    try {
      if (!user?.id) {
        throw new Error("No se ha detectado el usuario");
      }

      setLoading(true);
      setError("");

      const payload = {
        reservation_date: toDateKey(selectedDate),
        purpose: formData.purpose.trim(),
        notes: formData.notes.trim(),
        created_by: user.id,
      };

      if (isAdminMode) {
        await createAdminReservation(payload);
      } else {
        await createReservation(payload);
      }

      await loadReservations();
      handleCloseForm();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error guardando la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleReservationStatus = async (reservationId, newStatus) => {
    try {
      if (!user?.id) {
        throw new Error("No se ha detectado el administrador");
      }

      setLoading(true);
      setError("");

      await updateReservationStatus(reservationId, newStatus, user.id);
      await loadReservations();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error actualizando la reserva");
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = reservations.filter(
    (reservation) => reservation.status === "PENDIENTE"
  ).length;

  const approvedCount = reservations.filter(
    (reservation) => reservation.status === "APROBADA"
  ).length;

  const currentMonthCount = reservations.filter((reservation) => {
    const date = new Date(`${reservationDateKey(reservation)}T00:00:00`);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const reservationFormModal = showForm
    ? createPortal(
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card reservation-form-modal">
            <div className="dashboard-header-row">
              <div>
                <h2
                  className="dashboard-title"
                  style={{ fontSize: "1.5rem" }}
                >
                  {isAdminMode
                    ? "Crear reserva manual"
                    : "Solicitar reserva del salón social"}
                </h2>

                <p className="dashboard-subtitle mb-0">
                  Día seleccionado:{" "}
                  <strong>
                    {selectedDate.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCloseForm}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitReservation}>
              <div className="mb-3">
                <label className="form-label">Motivo de la reserva</label>

                <input
                  type="text"
                  className="form-control"
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      purpose: e.target.value,
                    }))
                  }
                  placeholder="Ej: Cumpleaños familiar, reunión de vecinos..."
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Notas opcionales</label>

                <textarea
                  className="form-control"
                  rows="5"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Añade cualquier detalle relevante..."
                />
              </div>

              <div className="mt-4 d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseForm}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : isAdminMode
                    ? "Crear reserva"
                    : "Enviar solicitud"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div className="reservations-system">
        {isAdminMode && (
          <div className="reservations-admin-summary">
            <div className="reservations-admin-summary__item">
              <strong>{pendingCount}</strong>
              <span>Pendientes</span>
            </div>

            <div className="reservations-admin-summary__item">
              <strong>{approvedCount}</strong>
              <span>Aprobadas</span>
            </div>

            <div className="reservations-admin-summary__item">
              <strong>{currentMonthCount}</strong>
              <span>Este mes</span>
            </div>
          </div>
        )}

        <div className="reservations-calendar-layout">
          <article className="reservations-calendar-card">
            <div className="reservations-calendar-card__header">
              <div>
                <h3>Calendario del salón social</h3>

                <p>
                  Los días pendientes o aprobados aparecen marcados
                  automáticamente.
                </p>

                <div className="reservation-calendar-legend">
                  <span className="reservation-calendar-legend__item">
                    <i className="reservation-calendar-legend__dot reservation-calendar-legend__dot--today" />
                    Día actual
                  </span>

                  <span className="reservation-calendar-legend__item">
                    <i className="reservation-calendar-legend__dot reservation-calendar-legend__dot--selected" />
                    Día seleccionado
                  </span>

                  <span className="reservation-calendar-legend__item">
                    <i className="reservation-calendar-legend__dot reservation-calendar-legend__dot--pending" />
                    Pendiente
                  </span>

                  <span className="reservation-calendar-legend__item">
                    <i className="reservation-calendar-legend__dot reservation-calendar-legend__dot--approved" />
                    Ocupado
                  </span>
                </div>
              </div>
            </div>

            <Calendar
              locale="es-ES"
              formatShortWeekday={(locale, date) =>
                date
                  .toLocaleDateString("es-ES", { weekday: "short" })
                  .replace(".", "")
              }
              value={selectedDate}
              onChange={handleDateSelect}
              onClickDay={handleDateSelect}
              tileClassName={({ date, view }) => {
                if (view !== "month") return null;

                const dayReservations = getActiveReservationsForDate(date);

                if (
                  dayReservations.some(
                    (reservation) => reservation.status === "APROBADA"
                  )
                ) {
                  return "reservation-calendar-day reservation-calendar-day--approved";
                }

                if (
                  dayReservations.some(
                    (reservation) => reservation.status === "PENDIENTE"
                  )
                ) {
                  return "reservation-calendar-day reservation-calendar-day--pending";
                }

                return null;
              }}
              tileContent={({ date, view }) => {
                if (view !== "month") return null;

                const count = getActiveReservationsForDate(date).length;

                return count > 0 ? (
                  <span className="reservation-calendar-badge">{count}</span>
                ) : null;
              }}
            />
          </article>

          <article className="reservations-detail-card">
            <div className="reservations-detail-card__header">
              <div className="reservations-detail-card__icon">
                <CalendarCheck size={28} />
              </div>

              <div>
                <h3>{formatLongDate(selectedDate)}</h3>
                <p>Disponibilidad y reservas para este día.</p>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading && <p className="text-muted">Cargando...</p>}

            {!loading && selectedDateReservations.length === 0 && (
              <div className="reservations-empty-day">
                <strong>Día disponible</strong>
                <p>No hay solicitudes ni reservas registradas.</p>
              </div>
            )}

            {!loading && selectedDateReservations.length > 0 && (
              <div className="reservations-day-list">
                {selectedDateReservations.map((reservation) => (
                  <div key={reservation.id} className="reservation-day-item">
                    <div className="reservation-day-item__top">
                      <strong>{reservation.purpose}</strong>

                      <span
                        className={`reservation-status ${getStatusClass(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </div>

                    <p>
                      <strong>Fecha:</strong>{" "}
                      {formatReservationDate(reservation.reservation_date)}
                    </p>

                    {reservation.notes && (
                      <p>
                        <strong>Notas:</strong> {reservation.notes}
                      </p>
                    )}

                    {isAdminMode && (
                      <>
                        <p>
                          <strong>Solicitante:</strong>{" "}
                          {getPersonName(reservation.requester)}
                        </p>

                        <p>
                          <strong>Vivienda:</strong>{" "}
                          {getProperty(reservation.requester)}
                        </p>
                      </>
                    )}

                    {isAdminMode && reservation.status === "PENDIENTE" && (
                      <div className="reservation-admin-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleReservationStatus(reservation.id, "APROBADA")
                          }
                        >
                          <CheckCircle2 size={16} />
                          Aprobar
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleReservationStatus(
                              reservation.id,
                              "RECHAZADA"
                            )
                          }
                        >
                          <XCircle size={16} />
                          Rechazar
                        </button>
                      </div>
                    )}

                    {isAdminMode && reservation.status === "APROBADA" && (
                      <div className="reservation-admin-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleReservationStatus(
                              reservation.id,
                              "CANCELADA"
                            )
                          }
                        >
                          <Ban size={16} />
                          Cancelar reserva
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary reservations-main-action"
              onClick={handleOpenForm}
              disabled={hasBlockedReservation || isPastSelectedDate}
            >
              <Plus size={16} />
              {isAdminMode ? "Crear reserva manual" : "Solicitar reserva"}
            </button>

            {hasBlockedReservation && (
              <small className="text-muted">
                Este día ya tiene una reserva.
              </small>
            )}

            {isPastSelectedDate && (
              <small className="text-muted">
                No se pueden crear reservas para fechas pasadas.
              </small>
            )}
          </article>
        </div>
      </div>

      {reservationFormModal}
    </>
  );
}