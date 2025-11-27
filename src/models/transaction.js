import { DataTypes } from "sequelize";
import { sequelize } from "../../db.js";
import User from "./user.js";
import Match from "./match.js";

export const Transaction = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_users: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_matches: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    number_tickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "COP",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "transactions",
  }
);

Transaction.belongsTo(User, { as: "user", foreignKey: "id_users" });
Transaction.belongsTo(Match, { as: "match", foreignKey: "id_matches" });

export default Transaction;
