import express from "express";
import Meeting from "../models/Meeting.js";

const router = express.Router();


/* GET reuniones */
router.get("/", async (req, res) => {
  try {

    const meetings = await Meeting.findAll({
      order: [["meeting_date", "ASC"]]
    });

    res.json(meetings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reuniones" });
  }
});


/* POST crear reunión (admin) */
router.post("/", async (req, res) => {
  try {

    const { title, description, meeting_date, created_by } = req.body;

    if (!title || !meeting_date) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const meeting = await Meeting.create({
      title,
      description,
      meeting_date,
      created_by
    });

    res.status(201).json(meeting);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear reunión" });
  }
});

export default router;