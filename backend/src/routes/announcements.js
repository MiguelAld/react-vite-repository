import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Announcement } from "../models/Announcement.js";
import { User } from "../models/User.js";
import { NovededRead } from "../models/NovededRead.js";
import { sequelize } from "../config/sequelize.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten imágenes"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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
        [sequelize.literal("CASE WHEN type = 'urgente' THEN 0 ELSE 1 END"), "ASC"],
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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, type, created_by } = req.body;

    if (!title || !description || !created_by) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const user = await User.findByPk(created_by);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const finalType = type || "informacion";

    const announcement = await Announcement.create({
      title,
      description,
      type: finalType,
      is_featured: finalType === "urgente",
      image_url: req.file ? `/uploads/${req.file.filename}` : null,
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
    res.status(500).json({ error: error.message || "Error al crear anuncio" });
  }
});

/* editar anuncio */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, created_by, keep_image } = req.body;

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

    const finalType = type || "informacion";

    announcement.title = title;
    announcement.description = description;
    announcement.type = finalType;
    announcement.is_featured = finalType === "urgente";

    if (req.file) {
      if (announcement.image_url) {
        const oldImagePath = path.join(
          uploadsDir,
          path.basename(announcement.image_url)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      announcement.image_url = `/uploads/${req.file.filename}`;
    } else if (keep_image !== "true") {
      if (announcement.image_url) {
        const oldImagePath = path.join(
          uploadsDir,
          path.basename(announcement.image_url)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      announcement.image_url = null;
    }

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
    res.status(500).json({ error: error.message || "Error al editar anuncio" });
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

    if (announcement.image_url) {
      const imagePath = path.join(uploadsDir, path.basename(announcement.image_url));

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await announcement.destroy();

    res.json({ message: "Anuncio eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar anuncio" });
  }
});

export default router;