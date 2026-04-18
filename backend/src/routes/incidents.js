import express from "express";
import { Incident } from "../models/Incident.js";
import { User } from "../models/User.js";
import { Zone } from "../models/Zone.js";

const router = express.Router();

/* comunidad/admin: listar todas las incidencias */
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
          required: false,
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

/* vecino: listar solo sus incidencias */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const incidents = await Incident.findAll({
      where: { created_by: userId },
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
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener incidencias del usuario" });
  }
});

/* vecino: crear incidencia */
router.post("/", async (req, res) => {
  try {
    const { zone_id, custom_zone, created_by, title, description } = req.body;

    if (!created_by || !title || !description) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const usingCustomZone = !zone_id && custom_zone;
    const usingNormalZone = zone_id && !custom_zone;

    if (!usingCustomZone && !usingNormalZone) {
      return res.status(400).json({
        error: "Debes seleccionar una zona o indicar una zona personalizada",
      });
    }

    const incident = await Incident.create({
      zone_id: usingNormalZone ? zone_id : null,
      custom_zone: usingCustomZone ? custom_zone.trim() : null,
      created_by,
      title,
      description,
      status: "PENDIENTE",
    });

    const fullIncident = await Incident.findByPk(incident.id, {
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
          required: false,
        },
      ],
    });

    res.status(201).json(fullIncident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear incidencia" });
  }
});

/* admin: cambiar estado */
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
    incident.closed_at = status === "RESUELTA" ? new Date() : null;

    await incident.save();

    res.json({ message: "Estado actualizado correctamente", incident });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});

/* admin: borrar incidencia */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findByPk(id);

    if (!incident) {
      return res.status(404).json({ error: "Incidencia no encontrada" });
    }

    await incident.destroy();

    res.json({ message: "Incidencia eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar incidencia" });
  }
});

export default router;