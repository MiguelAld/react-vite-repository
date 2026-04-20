import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const NovededRead = sequelize.define(
  "NovededRead",
  {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    novedad_type: {
      type: DataTypes.ENUM("reunion", "announcement"),
      allowNull: false,
    },
    novedad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "novedad_reads",
    timestamps: false,
    indexes: [
      {
        fields: ["user_id", "novedad_type", "novedad_id"],
        unique: true,
      },
    ],
  }
);
