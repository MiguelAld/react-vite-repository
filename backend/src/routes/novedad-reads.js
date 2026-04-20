import express from "express";
import { NovededRead } from "../models/NovededRead.js";
import Meeting from "../models/Meeting.js";
import { Announcement } from "../models/Announcement.js";
import { sequelize } from "../config/sequelize.js";

const router = express.Router();

/* Marcar novedad como leída */
router.post("/mark-read", async (req, res) => {
  try {
    const { user_id, novedad_type, novedad_id } = req.body;

    if (!user_id || !novedad_type || !novedad_id) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (!["reunion", "announcement"].includes(novedad_type)) {
      return res.status(400).json({ error: "Tipo de novedad inválido" });
    }

    // Crear o actualizar el registro
    await NovededRead.upsert(
      {
        user_id,
        novedad_type,
        novedad_id,
        read_at: new Date(),
      },
      {
        conflictFields: ["user_id", "novedad_type", "novedad_id"],
      }
    );

    res.json({ message: "Novedad marcada como leída" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al marcar como leído" });
  }
});

/* Contar novedades no leídas del usuario actual */
router.get("/count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Contar reuniones no leídas
    const unreadsReuniones = await sequelize.query(
      `
      SELECT COUNT(DISTINCT m.id) as count FROM meetings m
      WHERE NOT EXISTS (
        SELECT 1 FROM novedad_reads nr
        WHERE nr.user_id = ? AND nr.novedad_type = 'reunion' AND nr.novedad_id = m.id
      )
      `,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Contar anuncios no leídos
    const unreadsAnuncios = await sequelize.query(
      `
      SELECT COUNT(DISTINCT a.id) as count FROM announcements a
      WHERE NOT EXISTS (
        SELECT 1 FROM novedad_reads nr
        WHERE nr.user_id = ? AND nr.novedad_type = 'announcement' AND nr.novedad_id = a.id
      )
      `,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const totalUnread =
      (unreadsReuniones[0]?.count || 0) + (unreadsAnuncios[0]?.count || 0);

    res.json({
      unreuniones: unreadsReuniones[0]?.count || 0,
      unanuncios: unreadsAnuncios[0]?.count || 0,
      total: totalUnread,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al contar novedades" });
  }
});

/* Marcar todas las novedades como leídas para un usuario */
router.post("/mark-all-read/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Obtener todas las reuniones
    const meetings = await Meeting.findAll({
      attributes: ["id"],
    });

    // Obtener todos los anuncios
    const announcements = await Announcement.findAll({
      attributes: ["id"],
    });

    const now = new Date();

    // Crear registros de lectura para reuniones
    for (const meeting of meetings) {
      await NovededRead.upsert({
        user_id: userId,
        novedad_type: "reunion",
        novedad_id: meeting.id,
        read_at: now,
      });
    }

    // Crear registros de lectura para anuncios
    for (const announcement of announcements) {
      await NovededRead.upsert({
        user_id: userId,
        novedad_type: "announcement",
        novedad_id: announcement.id,
        read_at: now,
      });
    }

    res.json({ message: "Todas las novedades marcadas como leídas" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al marcar como leído" });
  }
});

export default router;
