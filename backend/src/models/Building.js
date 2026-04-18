import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Building = sequelize.define(
  "Building",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "buildings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);
