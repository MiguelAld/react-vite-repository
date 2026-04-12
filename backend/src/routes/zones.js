import express from "express";
import { Zone } from "../models/Zone.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const zones = await Zone.findAll({
      where: { is_active: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });

    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener zonas" });
  }
});

export default router;