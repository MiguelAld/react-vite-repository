import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const User = sequelize.define("User", {
  dni: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING(80),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true, // <- ESTO ES LO IMPORTANTE
  },
  role: {
    type: DataTypes.ENUM("VECINO", "ADMIN"),
    allowNull: false,
    defaultValue: "VECINO",
  },
  vivienda: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});