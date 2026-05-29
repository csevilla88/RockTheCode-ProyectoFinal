import { Router } from "express";
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";
import { upload } from "../config/cloudinary.js";

const newsRouter = Router();

// Rutas públicas
newsRouter.get("/", getNews);
newsRouter.get("/:id", getNewsById);

// Rutas protegidas (solo admin)
newsRouter.post("/", isAuth, isAdmin, upload.single("image"), createNews);
newsRouter.put("/:id", isAuth, isAdmin, upload.single("image"), updateNews);
newsRouter.delete("/:id", isAuth, isAdmin, deleteNews);

export default newsRouter;
