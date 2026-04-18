import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Zone = sequelize.define(
  "Zone",
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
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "zones",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);