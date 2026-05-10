import express from "express";
import { Zone } from "../models/Zone.js";
import { sequelize, Op } from "../config/sequelize.js";

const router = express.Router();

/* ============================================
   USUARIO: SOLO ZONAS ACTIVAS
   ============================================ */
router.get("/", async (req, res) => {
  try {
    const zones = await Zone.findAll({
      where: { is_active: true },
      attributes: ["id", "name"],
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });

    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener zonas" });
  }
});

/* ============================================
   ADMIN: TODAS LAS ZONAS
   ============================================ */
router.get("/all", async (req, res) => {
  try {
    const zones = await Zone.findAll({
      attributes: ["id", "name", "is_active", "order", "created_at"],
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });

    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener todas las zonas" });
  }
});

/* ============================================
   ADMIN: CREAR ZONA
   La nueva zona se coloca al final
   ============================================ */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "El nombre de la zona es obligatorio",
      });
    }

    const cleanName = name.trim();

    const existing = await Zone.findOne({
      where: { name: cleanName },
    });

    if (existing) {
      return res.status(400).json({
        error: "Ya existe una zona con ese nombre",
      });
    }

    const maxOrderZone = await Zone.findOne({
      order: [
        ["order", "DESC"],
        ["id", "DESC"],
      ],
    });

    const nextOrder = maxOrderZone ? Number(maxOrderZone.order) + 1 : 1;

    const zone = await Zone.create({
      name: cleanName,
      created_by: null,
      is_active: true,
      order: nextOrder,
    });

    res.status(201).json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear zona" });
  }
});

/* ============================================
   ADMIN: ACTIVAR / DESACTIVAR ZONA
   ============================================ */
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

/* ============================================
   ADMIN: CAMBIAR ORDEN
   Mueve SOLO una posición arriba o abajo
   ============================================ */
router.patch("/:id/order", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { direction } = req.body;

    if (!["up", "down"].includes(direction)) {
      await transaction.rollback();
      return res.status(400).json({ error: "Dirección inválida" });
    }

    const zone = await Zone.findByPk(id, { transaction });

    if (!zone) {
      await transaction.rollback();
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    let targetZone = null;

    if (direction === "up") {
      targetZone = await Zone.findOne({
        where: {
          order: {
            [Op.lt]: zone.order,
          },
        },
        order: [
          ["order", "DESC"],
          ["id", "DESC"],
        ],
        transaction,
      });
    }

    if (direction === "down") {
      targetZone = await Zone.findOne({
        where: {
          order: {
            [Op.gt]: zone.order,
          },
        },
        order: [
          ["order", "ASC"],
          ["id", "ASC"],
        ],
        transaction,
      });
    }

    if (!targetZone) {
      await transaction.commit();

      const zones = await Zone.findAll({
        attributes: ["id", "name", "is_active", "order", "created_at"],
        order: [
          ["order", "ASC"],
          ["id", "ASC"],
        ],
      });

      return res.json({
        message: "La zona ya está en el límite",
        zones,
      });
    }

    const currentOrder = zone.order;

    zone.order = targetZone.order;
    targetZone.order = currentOrder;

    await zone.save({ transaction });
    await targetZone.save({ transaction });

    await transaction.commit();

    const zones = await Zone.findAll({
      attributes: ["id", "name", "is_active", "order", "created_at"],
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });

    res.json({
      message: "Orden actualizado",
      zones,
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);
    res.status(500).json({ error: "Error actualizando orden" });
  }
});

/* ============================================
   ADMIN: ELIMINAR ZONA
   Si tiene incidencias asociadas, puede fallar.
   En ese caso, mejor desactivarla.
   ============================================ */
router.delete("/:id", async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const zone = await Zone.findByPk(id, { transaction });

    if (!zone) {
      await transaction.rollback();
      return res.status(404).json({ error: "Zona no encontrada" });
    }

    await zone.destroy({ transaction });

    const remainingZones = await Zone.findAll({
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
      transaction,
    });

    for (let index = 0; index < remainingZones.length; index++) {
      remainingZones[index].order = index + 1;
      await remainingZones[index].save({ transaction });
    }

    await transaction.commit();

    const zones = await Zone.findAll({
      attributes: ["id", "name", "is_active", "order", "created_at"],
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });

    res.json({
      message: "Zona eliminada correctamente",
      zones,
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    res.status(500).json({
      error:
        "No se pudo eliminar la zona. Si ya tiene incidencias asociadas, es mejor desactivarla en vez de borrarla.",
    });
  }
});

export default router;