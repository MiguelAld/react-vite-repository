import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { User } from "./User.js";

export const Announcement = sequelize.define(
  "Announcement",
  {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("informacion", "aviso", "urgente"),
      allowNull: false,
      defaultValue: "informacion",
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "announcements",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Announcement.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});