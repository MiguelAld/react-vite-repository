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
    scheduled_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    start_time: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "10:00",
    },
    end_time: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "11:00",
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