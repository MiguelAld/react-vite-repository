import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { Building } from "./Building.js";

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
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
  building_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: "users",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

User.belongsTo(Building, {
  foreignKey: "building_id",
  as: "building",
});