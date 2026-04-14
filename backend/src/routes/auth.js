import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

/* 1) Comprobar DNI */
router.post("/check-dni", async (req, res) => {
  try {
    const { dni } = req.body;

    if (!dni) {
      return res.status(400).json({ error: "Falta el DNI" });
    }

    const user = await User.findOne({ where: { dni } });

    if (!user) {
      return res.status(404).json({ error: "DNI no encontrado" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: "Este usuario está inhabilitado. Consulta con la administración de la comunidad.",
      });
    }

    return res.json({
      exists: true,
      hasPassword: !!user.password_hash,
      user: {
        id: user.id,
        dni: user.dni,
        name: user.name,
        role: user.role,
        vivienda: user.vivienda,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error comprobando DNI" });
  }
});

/* 2) Crear contraseña la primera vez */
router.post("/set-password", async (req, res) => {
  try {
    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const user = await User.findOne({ where: { dni } });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: "Este usuario está inhabilitado. Consulta con la administración de la comunidad.",
      });
    }

    if (user.password_hash) {
      return res.status(400).json({ error: "Este usuario ya tiene contraseña" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password_hash = hash;
    await user.save();

    return res.json({ message: "Contraseña creada correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando contraseña" });
  }
});

/* 3) Login normal */
router.post("/login", async (req, res) => {
  try {
    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({ error: "Faltan credenciales" });
    }

    const user = await User.findOne({ where: { dni } });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    if (!user.is_active) {
      return res.status(403).json({
        error: "Este usuario está inhabilitado. Consulta con la administración de la comunidad.",
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        dni: user.dni,
        name: user.name,
        role: user.role,
        vivienda: user.vivienda,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de login" });
  }
});

export default router;