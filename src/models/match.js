import { DataTypes } from "sequelize";
import { sequelize } from "../../db.js";
import Team from "./team.js";

export const Match = sequelize.define(
  "matches",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    id_team_local: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    id_team_visitor: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    match_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    match_hour: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: { isIn: [["programado", "en_venta", "agotado", "en_curso", "finalizado", "cancelado"]] },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "matches",
  }
);

// Associations (optional helper)
Match.belongsTo(Team, { as: "local", foreignKey: "id_team_local" });
Match.belongsTo(Team, { as: "visitor", foreignKey: "id_team_visitor" });

export default Match;
