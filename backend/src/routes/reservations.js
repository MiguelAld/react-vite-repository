import express from "express";
import { Op } from "sequelize";
import Reservation from "../models/Reservation.js";
import { User } from "../models/User.js";

const router = express.Router();

const ACTIVE_RESERVATION_STATUSES = ["PENDIENTE", "APROBADA"];

const getFullReservation = async (reservationId) => {
  return Reservation.findByPk(reservationId, {
    include: [
      {
        model: User,
        as: "requester",
        attributes: [
          "id",
          "name",
          "apellidos",
          "dni",
          "portal",
          "vivienda",
          "role",
        ],
        required: false,
      },
      {
        model: User,
        as: "reviewer",
        attributes: ["id", "name", "apellidos", "role"],
        required: false,
      },
    ],
  });
};

const isPastDate = (dateString) => {
  const selectedDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
};

/* GET reservas */
router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: User,
          as: "requester",
          attributes: [
            "id",
            "name",
            "apellidos",
            "dni",
            "portal",
            "vivienda",
            "role",
          ],
          required: false,
        },
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name", "apellidos", "role"],
          required: false,
        },
      ],
      order: [
        ["reservation_date", "ASC"],
        ["created_at", "ASC"],
      ],
    });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

/* POST crear solicitud de reserva de vecino */
router.post("/", async (req, res) => {
  try {
    const { reservation_date, purpose, notes, created_by } = req.body;

    if (!reservation_date || !purpose || !created_by) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (isPastDate(reservation_date)) {
      return res.status(400).json({
        error: "No puedes solicitar una reserva para una fecha pasada",
      });
    }

    const user = await User.findByPk(created_by);

    if (!user) {
      return res.status(400).json({ error: "El usuario solicitante no existe" });
    }

    const existingReservation = await Reservation.findOne({
      where: {
        reservation_date,
        status: {
          [Op.in]: ACTIVE_RESERVATION_STATUSES,
        },
      },
    });

    if (existingReservation) {
      return res.status(409).json({
        error:
          "Ese día ya tiene una reserva pendiente o aprobada. Selecciona otra fecha.",
      });
    }

    const reservation = await Reservation.create({
      reservation_date,
      purpose,
      notes: notes || null,
      created_by,
      status: "PENDIENTE",
    });

    const fullReservation = await getFullReservation(reservation.id);

    res.status(201).json(fullReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la reserva" });
  }
});

/* POST crear reserva manual desde admin */
router.post("/manual", async (req, res) => {
  try {
    const { reservation_date, purpose, notes, created_by } = req.body;

    if (!reservation_date || !purpose || !created_by) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    if (isPastDate(reservation_date)) {
      return res.status(400).json({
        error: "No puedes crear una reserva para una fecha pasada",
      });
    }

    const admin = await User.findByPk(created_by);

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        error: "Solo un administrador puede crear reservas manuales",
      });
    }

    const existingReservation = await Reservation.findOne({
      where: {
        reservation_date,
        status: {
          [Op.in]: ACTIVE_RESERVATION_STATUSES,
        },
      },
    });

    if (existingReservation) {
      return res.status(409).json({
        error:
          "Ese día ya tiene una reserva pendiente o aprobada. Selecciona otra fecha.",
      });
    }

    const reservation = await Reservation.create({
      reservation_date,
      purpose,
      notes: notes || null,
      created_by,
      reviewed_by: created_by,
      reviewed_at: new Date(),
      status: "APROBADA",
    });

    const fullReservation = await getFullReservation(reservation.id);

    res.status(201).json(fullReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la reserva manual" });
  }
});

/* PATCH aprobar / rechazar / cancelar */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewed_by } = req.body;

    const allowedStatuses = [
      "PENDIENTE",
      "APROBADA",
      "RECHAZADA",
      "CANCELADA",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Estado de reserva no válido" });
    }

    if (!reviewed_by) {
      return res.status(400).json({ error: "Falta el administrador revisor" });
    }

    const admin = await User.findByPk(reviewed_by);

    if (!admin || admin.role !== "ADMIN") {
      return res.status(403).json({
        error: "Solo un administrador puede gestionar reservas",
      });
    }

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (status === "APROBADA") {
      const conflictingReservation = await Reservation.findOne({
        where: {
          id: {
            [Op.ne]: reservation.id,
          },
          reservation_date: reservation.reservation_date,
          status: "APROBADA",
        },
      });

      if (conflictingReservation) {
        return res.status(409).json({
          error: "Ya existe una reserva aprobada para ese día",
        });
      }
    }

    reservation.status = status;
    reservation.reviewed_by = reviewed_by;
    reservation.reviewed_at = new Date();

    await reservation.save();

    const updatedReservation = await getFullReservation(reservation.id);

    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la reserva" });
  }
});

export default router;