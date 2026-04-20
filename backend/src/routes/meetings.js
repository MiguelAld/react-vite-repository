import express from "express";
import Meeting from "../models/Meeting.js";
import { User } from "../models/User.js";

const router = express.Router();

/* GET reuniones */
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos", "dni", "role"],
          required: false,
        },
      ],
      order: [["meeting_date", "ASC"]],
    });

    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reuniones" });
  }
});

/* POST crear reunión */
router.post("/", async (req, res) => {
  try {
    const { title, description, meeting_date, created_by } = req.body;

    if (!title || !meeting_date || !created_by) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const user = await User.findByPk(created_by);

    if (!user) {
      return res.status(400).json({ error: "El usuario creador no existe" });
    }

    const meeting = await Meeting.create({
      title,
      description: description || null,
      meeting_date,
      created_by,
    });

    const fullMeeting = await Meeting.findByPk(meeting.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos", "dni", "role"],
          required: false,
        },
      ],
    });

    res.status(201).json(fullMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear reunión" });
  }
});

/* PUT editar reunión */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, meeting_date, created_by } = req.body;

    const meeting = await Meeting.findByPk(id);

    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada" });
    }

    if (!title || !meeting_date || !created_by) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (Number(meeting.created_by) !== Number(created_by)) {
      return res.status(403).json({ error: "No tienes permiso para editar esta reunión" });
    }

    meeting.title = title;
    meeting.description = description || null;
    meeting.meeting_date = meeting_date;

    await meeting.save();

    const updatedMeeting = await Meeting.findByPk(meeting.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos", "dni", "role"],
          required: false,
        },
      ],
    });

    res.json(updatedMeeting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar reunión" });
  }
});

/* DELETE eliminar reunión */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { created_by } = req.body;

    const meeting = await Meeting.findByPk(id);

    if (!meeting) {
      return res.status(404).json({ error: "Reunión no encontrada" });
    }

    if (Number(meeting.created_by) !== Number(created_by)) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta reunión" });
    }

    await meeting.destroy();

    res.json({ message: "Reunión eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar reunión" });
  }
});

export default router;