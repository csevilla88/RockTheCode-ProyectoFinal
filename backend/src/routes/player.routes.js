import { Router } from "express";
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getTopStats,
} from "../controllers/player.controller.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";
import { upload } from "../config/cloudinary.js";

const playerRouter = Router();

// Rutas públicas
playerRouter.get("/", getPlayers);
playerRouter.get("/stats/top", getTopStats);
playerRouter.get("/:id", getPlayerById);

// Rutas protegidas (solo admin)
playerRouter.post("/", isAuth, isAdmin, upload.single("image"), createPlayer);
playerRouter.put("/:id", isAuth, isAdmin, upload.single("image"), updatePlayer);
playerRouter.delete("/:id", isAuth, isAdmin, deletePlayer);

export default playerRouter;
