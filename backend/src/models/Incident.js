import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { User } from "./User.js";
import { Zone } from "./Zone.js";

export const Incident = sequelize.define(
  "Incident",
  {
    zone_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    custom_zone: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDIENTE", "EN_PROCESO", "RESUELTA"),
      allowNull: false,
      defaultValue: "PENDIENTE",
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "incidents",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Incident.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

Incident.belongsTo(Zone, {
  foreignKey: "zone_id",
  as: "zone",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});