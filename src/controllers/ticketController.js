import { Ticket } from "../models/ticket.js";
import { User } from "../models/user.js";
import { Match } from "../models/match.js";

// helper to sanitize ticket
const sanitize = (t) => {
  if (!t) return null;
  const obj = { ...t.dataValues };
  return obj;
};

// Admin: create ticket
export const createTicket = async (req, res) => {
  try {
    const { id_users, id_matches, id_match_stand_price, ticket_code, price, state } = req.body;
    if (!id_users || !id_matches || price === undefined) return res.status(400).json({ message: "id_users, id_matches and price are required" });

    // validate existence
    const user = await User.findByPk(id_users);
    const match = await Match.findByPk(id_matches);
    if (!match) return res.status(400).json({ message: "Match not found" });

    const ticket = await Ticket.create({ id_users, id_matches, id_match_stand_price: id_match_stand_price || null, ticket_code: ticket_code || null, price, state: state || undefined });
    return res.status(201).json({ ticket: sanitize(ticket) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: list all tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ include: [{ association: "user" }, { association: "match" }, { association: "msp" }] });
    return res.json({ tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get my tickets (user)
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({ where: { id_users: req.user.id }, include: [{ association: "match" }, { association: "msp" }] });
    return res.json({ tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get ticket by id (admin or owner)
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id, { include: [{ association: "user" }, { association: "match" }, { association: "msp" }] });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (req.user.rol !== "administrador" && ticket.id_users !== req.user.id) return res.status(403).json({ message: "Forbidden" });
    return res.json({ ticket: sanitize(ticket) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: update ticket
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const updatable = {};
    const { id_users, id_matches, id_match_stand_price, ticket_code, price, state } = req.body;
    if (id_users !== undefined) updatable.id_users = id_users;
    if (id_matches !== undefined) updatable.id_matches = id_matches;
    if (id_match_stand_price !== undefined) updatable.id_match_stand_price = id_match_stand_price;
    if (ticket_code !== undefined) updatable.ticket_code = ticket_code;
    if (price !== undefined) updatable.price = price;
    if (state !== undefined) updatable.state = state;

    await ticket.update(updatable);
    return res.json({ ticket: sanitize(ticket) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    await ticket.destroy();
    return res.json({ message: "Ticket deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default { createTicket, getTickets, getMyTickets, getTicketById, updateTicket, deleteTicket };
