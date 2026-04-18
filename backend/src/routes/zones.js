import express from "express";
import { Zone } from "../models/Zone.js";

const router = express.Router();

/* usuario: solo zonas activas */
router.get("/", async (req, res) => {
  try {
    const zones = await Zone.findAll({
      where: { is_active: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener zonas" });
  }
});

/* admin: todas las zonas */
router.get("/all", async (req, res) => {
  try {
    const zones = await Zone.findAll({
      attributes: ["id", "name", "is_active", "created_at"],
      order: [["name", "ASC"]],
    });

    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener todas las zonas" });
  }
});

/* admin: crear zona */
router.post("/", async (req, res) => {
  try {
    const { name, created_by } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "El nombre de la zona es obligatorio" });
    }

    const existing = await Zone.findOne({
      where: { name: name.trim() },
    });

    if (existing) {
      return res.status(400).json({ error: "Ya existe una zona con ese nombre" });
    }

    const zone = await Zone.create({
      name: name.trim(),
      created_by: created_by || null,
      is_active: true,
    });

    res.status(201).json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear zona" });
  }
});

/* admin: activar/desactivar zona */
router.patch("/:id/active", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const zone = await Zone.findByPk(id);

    if (!zone) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    zone.is_active = !!is_active;
    await zone.save();

    res.json({
      message: "Estado de la zona actualizado correctamente",
      zone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la zona" });
  }
});

export default router;