import { useState } from "react";
import { createMeeting } from "../../services/api";

export default function CreateMeeting() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [meetingDate, setMeetingDate] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {

      await createMeeting({
        title,
        description,
        meeting_date: meetingDate,
        created_by: 1
      });

      alert("Reunión creada");

      setTitle("");
      setDescription("");
      setMeetingDate("");

    } catch (error) {
      console.error(error);
      alert("Error creando reunión");
    }
  };

  return (
    <div className="card p-4">

      <h2>Crear reunión</h2>

      <form onSubmit={submit}>

        <div className="mb-3">
          <label className="form-label">Título</label>

          <input
            className="form-control"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>

          <textarea
            className="form-control"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha</label>

          <input
            type="datetime-local"
            className="form-control"
            value={meetingDate}
            onChange={(e)=>setMeetingDate(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary">
          Crear reunión
        </button>

      </form>

    </div>
  );
}