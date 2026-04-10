import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

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
        vivienda: user.vivienda
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de login" });
  }
});

export default router;