import { Match } from "../models/match.js";
import { Team } from "../models/team.js";

const VALID_STATES = ["programado", "en_venta", "agotado", "en_curso", "finalizado", "cancelado"];

export const createMatch = async (req, res) => {
  try {
    const { id_team_local, id_team_visitor, match_date, match_hour, state } = req.body;

    if (!id_team_local || !id_team_visitor) return res.status(400).json({ message: "id_team_local and id_team_visitor are required" });
    if (id_team_local === id_team_visitor) return res.status(400).json({ message: "Local and visitor teams must be different" });
    if (state && !VALID_STATES.includes(state)) return res.status(400).json({ message: "Invalid state" });

    // Ensure teams exist
    const local = await Team.findByPk(id_team_local);
    const visitor = await Team.findByPk(id_team_visitor);
    if (!local || !visitor) return res.status(400).json({ message: "One or both teams not found" });

    const match = await Match.create({ id_team_local, id_team_visitor, match_date: match_date || null, match_hour: match_hour || null, state: state || null });
    return res.status(201).json({ match });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({ include: [ { association: 'local' }, { association: 'visitor' } ] });
    return res.json({ matches });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id, { include: [ { association: 'local' }, { association: 'visitor' } ] });
    if (!match) return res.status(404).json({ message: "Match not found" });
    return res.json({ match });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });

    const { id_team_local, id_team_visitor, match_date, match_hour, state } = req.body;
    if (id_team_local !== undefined && id_team_visitor !== undefined && id_team_local === id_team_visitor)
      return res.status(400).json({ message: "Local and visitor teams must be different" });
    if (state && !VALID_STATES.includes(state)) return res.status(400).json({ message: "Invalid state" });

    // If changing teams, ensure they exist
    if (id_team_local) {
      const local = await Team.findByPk(id_team_local);
      if (!local) return res.status(400).json({ message: "Local team not found" });
    }
    if (id_team_visitor) {
      const visitor = await Team.findByPk(id_team_visitor);
      if (!visitor) return res.status(400).json({ message: "Visitor team not found" });
    }

    const updatable = {};
    if (id_team_local !== undefined) updatable.id_team_local = id_team_local;
    if (id_team_visitor !== undefined) updatable.id_team_visitor = id_team_visitor;
    if (match_date !== undefined) updatable.match_date = match_date;
    if (match_hour !== undefined) updatable.match_hour = match_hour;
    if (state !== undefined) updatable.state = state;

    await match.update(updatable);
    return res.json({ match });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    await match.destroy();
    return res.json({ message: "Match deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { createMatch, getMatches, getMatchById, updateMatch, deleteMatch };
