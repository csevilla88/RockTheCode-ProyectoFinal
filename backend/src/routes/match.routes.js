import { Router } from "express";
import {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchStats,
} from "../controllers/match.controller.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";

const matchRouter = Router();

// Rutas públicas
matchRouter.get("/", getMatches);
matchRouter.get("/stats/summary", getMatchStats);
matchRouter.get("/:id", getMatchById);

// Rutas protegidas (solo admin)
matchRouter.post("/", isAuth, isAdmin, createMatch);
matchRouter.put("/:id", isAuth, isAdmin, updateMatch);
matchRouter.delete("/:id", isAuth, isAdmin, deleteMatch);

export default matchRouter;
