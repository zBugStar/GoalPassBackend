import express from "express";
import { body } from "express-validator";
import * as matchController from "../controllers/matchController.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Public endpoints
router.get("/", matchController.getMatches);
router.get("/:id", matchController.getMatchById);

// Admin endpoints
router.post(
  "/",
  authenticate,
  authorizeRoles("administrador"),
  [body("id_team_local").notEmpty().withMessage("id_team_local required"), body("id_team_visitor").notEmpty().withMessage("id_team_visitor required")],
  matchController.createMatch
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("administrador"),
  [body("state").optional().isIn(["programado","en_venta","agotado","en_curso","finalizado","cancelado"])],
  matchController.updateMatch
);

router.delete("/:id", authenticate, authorizeRoles("administrador"), matchController.deleteMatch);

export default router;
