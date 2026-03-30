import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Meeting = sequelize.define("Meeting", {
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT
  },

  meeting_date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  created_by: {
    type: DataTypes.BIGINT,
    allowNull: false
  }

}, {
  tableName: "meetings",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

export default Meeting;