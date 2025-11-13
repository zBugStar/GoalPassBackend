import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import teamsRoutes from "./routes/teams.js";
import matchesRoutes from "./routes/matches.js";
import { sequelize } from "../db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);
// Users CRUD (self + admin)
app.use("/api/users", usersRoutes);
// Teams CRUD (public read, admin-only create/update/delete)
app.use("/api/teams", teamsRoutes);
// Matches CRUD (public read, admin-only create/update/delete)
app.use("/api/matches", matchesRoutes);

// Basic health
app.get("/", (req, res) => res.json({ ok: true }));

// Make sure DB connection is established before exporting app
const testDbConnection = async () => {
	try {
		await sequelize.authenticate();
		// await User.sync({ alter: true });
		console.log("Database connected");
	} catch (err) {
		console.error("Unable to connect to DB:", err);
	}
};

testDbConnection();

export default app;
