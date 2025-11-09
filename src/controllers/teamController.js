import { Team } from "../models/team.js";

// Create a team (admin only)
export const createTeam = async (req, res) => {
  try {
    const { name, city, stadium, image_url } = req.body;
    if (!name || !stadium) return res.status(400).json({ message: "name and stadium are required" });

    const team = await Team.create({ name, city: city || null, stadium, image_url: image_url || null });
    return res.status(201).json({ team });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Public: list teams
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    return res.json({ teams });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Public: get team by id
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    return res.json({ team });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update team (admin only)
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const updatable = ["name", "city", "stadium", "image_url"];
    const data = {};
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) data[k] = req.body[k];
    });

    await team.update(data);
    return res.json({ team });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete team (admin only)
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });
    await team.destroy();
    return res.json({ message: "Team deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { createTeam, getTeams, getTeamById, updateTeam, deleteTeam };
