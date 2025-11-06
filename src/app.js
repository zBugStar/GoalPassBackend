import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { sequelize } from "../db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);

// Basic health
app.get("/", (req, res) => res.json({ ok: true }));

// Make sure DB connection is established before exporting app
const testDbConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Database connected");
	} catch (err) {
		console.error("Unable to connect to DB:", err);
	}
};

testDbConnection();

export default app;
