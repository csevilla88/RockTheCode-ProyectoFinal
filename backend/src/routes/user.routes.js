import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  toggleFavoritePlayer,
  getAllUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";

const userRouter = Router();

// Rutas públicas
userRouter.post("/register", register);
userRouter.post("/login", login);

// Rutas protegidas (usuario autenticado)
userRouter.get("/profile", isAuth, getProfile);
userRouter.put("/profile", isAuth, updateProfile);
userRouter.put("/favorites/:playerId", isAuth, toggleFavoritePlayer);

// Rutas de admin
userRouter.get("/", isAuth, isAdmin, getAllUsers);
userRouter.delete("/:id", isAuth, isAdmin, deleteUser);

export default userRouter;
