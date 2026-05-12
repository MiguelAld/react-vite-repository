import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

/* ============================================
   FORMATEAR USUARIO PARA ENVIAR AL FRONTEND
   Siempre devuelve nombre, apellidos, portal y vivienda
   ============================================ */
const buildAuthUser = (user) => ({
  id: user.id,
  dni: user.dni,
  name: user.name,
  apellidos: user.apellidos,
  role: user.role,
  portal: user.portal,
  vivienda: user.vivienda,
  is_active: user.is_active,
});

/* ============================================
   1) COMPROBAR DNI
   ============================================ */
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
        error:
          "Este usuario está inhabilitado. Consulta con la administración de la comunidad.",
      });
    }

    return res.json({
      exists: true,
      hasPassword: !!user.password_hash,
      user: buildAuthUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error comprobando DNI" });
  }
});

/* ============================================
   2) CREAR CONTRASEÑA LA PRIMERA VEZ
   ============================================ */
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
        error:
          "Este usuario está inhabilitado. Consulta con la administración de la comunidad.",
      });
    }

    if (user.password_hash) {
      return res
        .status(400)
        .json({ error: "Este usuario ya tiene contraseña" });
    }

    const hash = await bcrypt.hash(password, 10);

    user.password_hash = hash;
    await user.save();

    return res.json({
      message: "Contraseña creada correctamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creando contraseña" });
  }
});

/* ============================================
   3) LOGIN NORMAL
   ============================================ */
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
        error:
          "Este usuario está inhabilitado. Consulta con la administración de la comunidad.",
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "2h" }
    );

    return res.json({
      token,
      user: buildAuthUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error de login" });
  }
});

export default router;