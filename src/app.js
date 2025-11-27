import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import teamsRoutes from "./routes/teams.js";
import matchesRoutes from "./routes/matches.js";
import soccerStandsRoutes from "./routes/soccerStands.js";
import ticketsRoutes from "./routes/tickets.js";
import transactionsRoutes from "./routes/transactions.js";
import { sequelize } from "../db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
// Usuarios CRUD (self + admin)
app.use("/api/users", usersRoutes);
// Equipos CRUD (lectura pública, creación/actualización/eliminación solo admin)
app.use("/api/teams", teamsRoutes);
// Partidos CRUD (lectura pública, creación/actualización/eliminación solo admin)
app.use("/api/matches", matchesRoutes);
// Soccer stands (public read, admin-only write)
app.use("/api/stands", soccerStandsRoutes);
// Tickets (user own + admin management)
app.use("/api/tickets", ticketsRoutes);
// Transactions (payments) - users can create and list their own; admin manages all
app.use("/api/transactions", transactionsRoutes);

// Salud básica
app.get("/", (req, res) => res.json({ ok: true }));

// Asegurarse de que la conexión a la base de datos esté establecida antes de exportar la app
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
