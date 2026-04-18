import express from "express";
import { Zone } from "../models/Zone.js";
import { sequelize, Op } from "../config/sequelize.js";

const router = express.Router();

/* usuario: solo zonas activas */
router.get("/", async (req, res) => {
  try {
    const zones = await Zone.findAll({
      where: { is_active: true },
      attributes: ["id", "name"],
      order: [["order", "ASC"]],
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
      attributes: ["id", "name", "is_active", "order", "created_at"],
      order: [["order", "ASC"]],
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
      created_by: null,
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

/* admin: cambiar orden de zona */
router.patch("/:id/order", async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.body; // "up" o "down"

    if (!["up", "down"].includes(direction)) {
      return res.status(400).json({ error: "Dirección inválida" });
    }

    const zone = await Zone.findByPk(id);

    if (!zone) {
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    if (direction === "up") {
      // Buscar la zona anterior (order menor más cercano)
      const prevZone = await Zone.findOne({
        where: { order: { [Op.lt]: zone.order } },
        order: [["order", "DESC"]],
      });

      if (prevZone) {
        const tempOrder = zone.order;
        zone.order = prevZone.order;
        prevZone.order = tempOrder;
        await zone.save();
        await prevZone.save();
      }
    } else {
      // Buscar la zona siguiente (order mayor más cercano)
      const nextZone = await Zone.findOne({
        where: { order: { [Op.gt]: zone.order } },
        order: [["order", "ASC"]],
      });

      if (nextZone) {
        const tempOrder = zone.order;
        zone.order = nextZone.order;
        nextZone.order = tempOrder;
        await zone.save();
        await nextZone.save();
      }
    }

    const updatedZone = await Zone.findByPk(id);

    res.json({
      message: "Orden actualizado",
      zone: updatedZone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando orden" });
  }
});

export default router;