import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "dni", "name", "email", "role", "vivienda", "created_at"],
      order: [["id", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

export default router;