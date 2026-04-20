import express from "express";
import { Announcement } from "../models/Announcement.js";
import { User } from "../models/User.js";

const router = express.Router();

/* Listar anuncios */
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener anuncios" });
  }
});

/* Crear anuncio */
router.post("/", async (req, res) => {
  try {
    const { title, description, created_by } = req.body;

    if (!title || !description || !created_by) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const user = await User.findByPk(created_by);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const announcement = await Announcement.create({
      title,
      description,
      created_by,
    });

    // Incluir creator en la respuesta
    const result = await Announcement.findByPk(announcement.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos"],
        },
      ],
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear anuncio" });
  }
});

/* Editar anuncio */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, created_by } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: "Anuncio no encontrado" });
    }

    // Solo el creador puede editar
    if (announcement.created_by !== created_by) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para editar este anuncio" });
    }

    if (!title || !description) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    announcement.title = title;
    announcement.description = description;
    await announcement.save();

    // Incluir creator en la respuesta
    const result = await Announcement.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos"],
        },
      ],
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar anuncio" });
  }
});

/* Eliminar anuncio */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { created_by } = req.body;

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: "Anuncio no encontrado" });
    }

    // Solo el creador puede eliminar
    if (announcement.created_by !== created_by) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar este anuncio" });
    }

    await announcement.destroy();
    res.json({ message: "Anuncio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar anuncio" });
  }
});

export default router;
