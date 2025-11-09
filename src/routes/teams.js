import express from "express";
import { body } from "express-validator";
import * as teamController from "../controllers/teamController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Public endpoints
router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeamById);

// Admin-only endpoints
router.post(
  "/",
  authenticate,
  authorizeRoles("administrador"),
  [body("name").notEmpty().withMessage("name required"), body("stadium").notEmpty().withMessage("stadium required")],
  teamController.createTeam
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("administrador"),
  [body("name").optional().notEmpty(), body("stadium").optional().notEmpty()],
  teamController.updateTeam
);

router.delete("/:id", authenticate, authorizeRoles("administrador"), teamController.deleteTeam);

export default router;
