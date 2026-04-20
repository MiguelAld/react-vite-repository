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
        "apellidos",
        "email",
        "phone",
        "role",
        "portal",
        "vivienda",
        "is_active",
        "created_at",
      ],
      order: [
        ["portal", "ASC"],
        ["vivienda", "ASC"],
        ["name", "ASC"],
      ],
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
    const { dni, name, apellidos, email, phone, role, portal, vivienda } = req.body;

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
      apellidos: apellidos || null,
      email: email || null,
      phone: phone || null,
      role,
      portal: portal || null,
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

/* editar usuario */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { dni, name, apellidos, email, phone, role, portal, vivienda } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!dni || !name || !role) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const existing = await User.findOne({ where: { dni } });

    if (existing && existing.id !== user.id) {
      return res.status(400).json({ error: "Ya existe otro usuario con ese DNI" });
    }

    user.dni = dni;
    user.name = name;
    user.apellidos = apellidos || null;
    user.email = email || null;
    user.phone = phone || null;
    user.role = role;
    user.portal = portal || null;
    user.vivienda = vivienda || null;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar usuario" });
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