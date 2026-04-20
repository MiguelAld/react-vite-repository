import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";
import { User } from "./User.js";

const Meeting = sequelize.define(
  "Meeting",
  {
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meeting_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "meetings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Meeting.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

export default Meeting;