import { DataTypes } from "sequelize";
import { sequelize } from "../../db.js";
import Match from "./match.js";
import SoccerStand from "./soccerStand.js";

export const MatchStandPrice = sequelize.define(
  "match_stand_prices",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_match: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_stand: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "match_stand_prices",
  }
);

MatchStandPrice.belongsTo(Match, { as: "match", foreignKey: "id_match" });
MatchStandPrice.belongsTo(SoccerStand, { as: "stand", foreignKey: "id_stand" });

export default MatchStandPrice;
