import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

/* listar usuarios */
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "dni",
        "name",
        "email",
        "phone",
        "role",
        "vivienda",
        "is_active",
        "created_at",
      ],
      order: [["id", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

/* crear usuario */
router.post("/", async (req, res) => {
  try {
    const { dni, name, email, phone, role, vivienda } = req.body;

    if (!dni || !name || !role) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const existing = await User.findOne({ where: { dni } });

    if (existing) {
      return res.status(400).json({ error: "Ya existe un usuario con ese DNI" });
    }

    const newUser = await User.create({
      dni,
      name,
      email: email || null,
      phone: phone || null,
      role,
      vivienda: vivienda || null,
      password_hash: null,
      is_active: true,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

/* activar / desactivar usuario */
router.patch("/:id/active", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.is_active = !!is_active;
    await user.save();

    res.json({ message: "Estado actualizado correctamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

export default router;