import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  toggleFavoritePlayer,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../controllers/user.controller.js";
import { isAuth, isAdmin } from "../middlewares/auth.js";
import { upload } from "../config/cloudinary.js";

const userRouter = Router();

// Rutas públicas
userRouter.post("/register", upload.single("avatar"), register);
userRouter.post("/login", login);

// Rutas protegidas (usuario autenticado)
userRouter.get("/profile", isAuth, getProfile);
userRouter.put("/profile", isAuth, upload.single("avatar"), updateProfile);
userRouter.put("/favorites/:playerId", isAuth, toggleFavoritePlayer);

// Rutas de admin
userRouter.get("/", isAuth, isAdmin, getAllUsers);
userRouter.patch("/:id/role", isAuth, isAdmin, updateUserRole);
userRouter.delete("/:id", isAuth, isAdmin, deleteUser);

export default userRouter;
