import { DataTypes } from "sequelize";
import { sequelize } from "../../db.js";
import User from "./user.js";
import Match from "./match.js";
import MatchStandPrice from "./matchStandPrice.js";

export const Ticket = sequelize.define(
  "tickets",
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
      allowNull: false,
    },
    id_match_stand_price: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    ticket_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "vendido",
      validate: { isIn: [["pendiente", "vendido", "anulado", "usado"]] },
    },
    purchased_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "tickets",
  }
);

Ticket.belongsTo(User, { as: "user", foreignKey: "id_users" });
Ticket.belongsTo(Match, { as: "match", foreignKey: "id_matches" });
Ticket.belongsTo(MatchStandPrice, { as: "msp", foreignKey: "id_match_stand_price" });

export default Ticket;
