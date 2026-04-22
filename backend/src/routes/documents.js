import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { Document } from "../models/Document.js";
import { User } from "../models/User.js";

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
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Solo se permiten archivos PDF"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/* listar documentos */
router.get("/", async (_req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "name", "apellidos"],
          required: false,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener documentos" });
  }
});

/* subir documento */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, uploaded_by } = req.body;

    if (!title || !uploaded_by || !req.file) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const user = await User.findByPk(uploaded_by);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const document = await Document.create({
      title,
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      mime_type: req.file.mimetype,
      size_bytes: req.file.size,
      uploaded_by,
    });

    const fullDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: "uploader",
          attributes: ["id", "name", "apellidos"],
          required: false,
        },
      ],
    });

    res.status(201).json(fullDocument);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error al subir documento" });
  }
});

/* borrar documento */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id);

    if (!document) {
      return res.status(404).json({ error: "Documento no encontrado" });
    }

    const filePath = path.join(uploadsDir, document.stored_name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await document.destroy();

    res.json({ message: "Documento eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar documento" });
  }
});

export default router;