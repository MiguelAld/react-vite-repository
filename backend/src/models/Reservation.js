import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { User } from "./User.js";

const Reservation = sequelize.define(
  "Reservation",
  {
    reservation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "PENDIENTE",
        "APROBADA",
        "RECHAZADA",
        "CANCELADA"
      ),
      allowNull: false,
      defaultValue: "PENDIENTE",
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    reviewed_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Reservation.belongsTo(User, {
  foreignKey: "created_by",
  as: "requester",
});

Reservation.belongsTo(User, {
  foreignKey: "reviewed_by",
  as: "reviewer",
});

export default Reservation;