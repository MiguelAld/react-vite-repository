import express from "express";
import { Incident } from "../models/Incident.js";
import { User } from "../models/User.js";
import { Zone } from "../models/Zone.js";

const router = express.Router();

/* listar incidencias para admin */
router.get("/", async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "dni", "vivienda", "role"],
        },
        {
          model: Zone,
          as: "zone",
          attributes: ["id", "name"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener incidencias" });
  }
});

/* cambiar estado de incidencia */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PENDIENTE", "EN_PROCESO", "RESUELTA"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const incident = await Incident.findByPk(id);

    if (!incident) {
      return res.status(404).json({ error: "Incidencia no encontrada" });
    }

    incident.status = status;

    if (status === "RESUELTA") {
      incident.closed_at = new Date();
    } else {
      incident.closed_at = null;
    }

    await incident.save();

    res.json({ message: "Estado actualizado correctamente", incident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

export default router;