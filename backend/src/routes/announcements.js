import express from "express";
import { Announcement } from "../models/Announcement.js";
import { User } from "../models/User.js";
import { NovededRead } from "../models/NovededRead.js";

const router = express.Router();

/* listar anuncios */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const announcements = await Announcement.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "apellidos"],
        },
      ],
      order: [
        ["is_featured", "DESC"],
        ["created_at", "DESC"],
      ],
    });

    if (userId) {
      const announcementsWithReadStatus = await Promise.all(
        announcements.map(async (ann) => {
          const read = await NovededRead.findOne({
            where: {
              user_id: userId,
              novedad_type: "announcement",
              novedad_id: ann.id,
            },
          });

          return {
            ...ann.toJSON(),
            is_read: !!read,
          };
        })
      );

      return res.json(announcementsWithReadStatus);
    }

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener anuncios" });
  }
});

/* crear anuncio */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      is_featured,
      image_url,
      created_by,
    } = req.body;

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
      type: type || "informacion",
      is_featured: !!is_featured,
      image_url: image_url || null,
      created_by,
    });

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

/* editar anuncio */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      is_featured,
      image_url,
      created_by,
    } = req.body;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ error: "Anuncio no encontrado" });
    }

    if (Number(announcement.created_by) !== Number(created_by)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para editar este anuncio" });
    }

    if (!title || !description) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    announcement.title = title;
    announcement.description = description;
    announcement.type = type || "informacion";
    announcement.is_featured = !!is_featured;
    announcement.image_url = image_url || null;

    await announcement.save();

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

/* destacar / quitar destacado */
router.patch("/:id/feature", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ error: "Anuncio no encontrado" });
    }

    announcement.is_featured = !!is_featured;
    await announcement.save();

    res.json({ message: "Estado destacado actualizado", announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando destacado" });
  }
});

/* eliminar anuncio */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { created_by } = req.body;

    const announcement = await Announcement.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ error: "Anuncio no encontrado" });
    }

    if (Number(announcement.created_by) !== Number(created_by)) {
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