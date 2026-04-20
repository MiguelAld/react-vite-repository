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

export default router;