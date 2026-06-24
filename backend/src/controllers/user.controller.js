import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * POST /api/users/register - Registro de usuario
 * Acepta multipart/form-data con un campo opcional `avatar` (imagen).
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario o email ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      username,
      email,
      password: hashedPassword,
    };
    if (req.file) {
      userData.avatar = req.file.path;
    }

    const createdUser = await User.create(userData);

    const newUser = await User.findById(createdUser._id).populate("favoritePlayers");
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Usuario registrado correctamente",
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/login - Inicio de sesión
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate("favoritePlayers");
    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = generateToken(user);

    // Eliminamos password manualmente antes de enviar
    const userObj = user.toJSON();

    res.status(200).json({
      message: "Login exitoso",
      user: userObj,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/profile - Obtener perfil del usuario autenticado
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("favoritePlayers");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile - Actualizar perfil del usuario autenticado.
 * Soporta multipart/form-data para subir una imagen de avatar.
 * Campos opcionales: username, avatar (URL o archivo), password.
 * NOTA: el email NO es editable: es la credencial de acceso.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar, password } = req.body;
    const updates = {};

    if (username !== undefined && username !== "") updates.username = username;

    if (req.file) {
      updates.avatar = req.file.path;
    } else if (avatar !== undefined) {
      updates.avatar = avatar;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "La contraseña debe tener al menos 6 caracteres",
        });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    // Comprobar duplicados de username (excluyendo al propio usuario)
    if (updates.username) {
      const conflict = await User.findOne({
        _id: { $ne: req.user._id },
        username: updates.username,
      });
      if (conflict) {
        return res.status(400).json({
          message: "El nombre de usuario ya está en uso",
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).populate("favoritePlayers");

    res.status(200).json({
      message: "Perfil actualizado",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/favorites/:playerId - Toggle jugador favorito
 */
export const toggleFavoritePlayer = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.favoritePlayers.indexOf(playerId);
    if (index === -1) {
      user.favoritePlayers.push(playerId);
    } else {
      user.favoritePlayers.splice(index, 1);
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate("favoritePlayers");

    res.status(200).json({
      message: index === -1 ? "Jugador añadido a favoritos" : "Jugador eliminado de favoritos",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users - Obtener todos los usuarios (solo admin)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("favoritePlayers");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id - Eliminar usuario (solo admin)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/:id/role - Cambiar rol de usuario (solo admin)
 */
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Rol no válido" });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (req.user._id.toString() === id && role !== "admin") {
      return res.status(400).json({
        message: "No puedes quitarte el rol de admin a ti mismo",
      });
    }

    if (targetUser.role === "admin" && role === "user") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Debe existir al menos un usuario con rol admin",
        });
      }
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      message: "Rol actualizado correctamente",
      user: targetUser,
    });
  } catch (error) {
    next(error);
  }
};
