import express from "express";
import { Building } from "../models/Building.js";

const router = express.Router();

/* listar bloques activos */
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.findAll({
      where: { is_active: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(buildings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener bloques" });
  }
});

/* admin: todos los bloques */
router.get("/all", async (req, res) => {
  try {
    const buildings = await Building.findAll({
      attributes: ["id", "name", "is_active", "created_at"],
      order: [["name", "ASC"]],
    });

    res.json(buildings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener bloques" });
  }
});

/* admin: crear bloque */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "El nombre del bloque es obligatorio" });
    }

    const existing = await Building.findOne({
      where: { name: name.trim() },
    });

    if (existing) {
      return res.status(400).json({ error: "Ya existe un bloque con ese nombre" });
    }

    const building = await Building.create({
      name: name.trim(),
      is_active: true,
    });

    res.status(201).json(building);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando bloque" });
  }
});

/* admin: activar/desactivar bloque */
router.patch("/:id/active", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const building = await Building.findByPk(id);

    if (!building) {
      return res.status(404).json({ error: "Bloque no encontrado" });
    }

    building.is_active = !!is_active;
    await building.save();

    res.json({
      message: "Estado del bloque actualizado",
      building,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando bloque" });
  }
});

export default router;
