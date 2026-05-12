import express from "express";
import cors from "cors";
import { sequelize } from "./config/sequelize.js";

import authRoutes from "./routes/auth.js";
import meetingsRoutes from "./routes/meetings.js";
import usersRoutes from "./routes/users.js";
import incidentsRoutes from "./routes/incidents.js";
import zonesRoutes from "./routes/zones.js";
import announcementsRoutes from "./routes/announcements.js";
import novededReadsRoutes from "./routes/novedad-reads.js";
import documentsRoutes from "./routes/documents.js";
import reservationsRoutes from "./routes/reservations.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "../uploads");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/meetings", meetingsRoutes);
app.use("/users", usersRoutes);
app.use("/incidents", incidentsRoutes);
app.use("/zones", zonesRoutes);
app.use("/announcements", announcementsRoutes);
app.use("/novedad-reads", novededReadsRoutes);
app.use("/documents", documentsRoutes);
app.use("/reservations", reservationsRoutes);

app.use("/uploads", express.static(uploadsPath));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a MySQL");

    await sequelize.sync({ alter: false });
    console.log("✅ Tablas sincronizadas");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error DB:", err);
  }
})();