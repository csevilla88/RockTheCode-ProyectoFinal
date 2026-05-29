import Player from "../models/Player.js";
import { cloudinary } from "../config/cloudinary.js";

/**
 * GET /api/players - Obtener todos los jugadores (con filtros opcionales)
 */
export const getPlayers = async (req, res, next) => {
  try {
    const { position, status, search, sort, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (position) filter.position = position;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { nationality: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { number: 1 };
    if (sort === "goals") sortOption = { goals: -1 };
    if (sort === "name") sortOption = { lastName: 1 };
    if (sort === "age") sortOption = { age: 1 };
    if (sort === "matches") sortOption = { matchesPlayed: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Player.countDocuments(filter);

    const players = await Player.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      players,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/players/:id - Obtener un jugador por ID
 */
export const getPlayerById = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }
    res.status(200).json(player);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/players - Crear un jugador (solo admin)
 */
export const createPlayer = async (req, res, next) => {
  try {
    const playerData = { ...req.body };

    if (req.file) {
      playerData.image = req.file.path;
    }

    const newPlayer = await Player.create(playerData);
    res.status(201).json({
      message: "Jugador creado correctamente",
      player: newPlayer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/players/:id - Actualizar un jugador (solo admin)
 */
export const updatePlayer = async (req, res, next) => {
  try {
    const playerData = { ...req.body };

    if (req.file) {
      // Eliminar imagen anterior de Cloudinary si existe
      const existingPlayer = await Player.findById(req.params.id);
      if (existingPlayer?.image) {
        const publicId = existingPlayer.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`cfs-malgrat/${publicId}`);
      }
      playerData.image = req.file.path;
    }

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      playerData,
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    res.status(200).json({
      message: "Jugador actualizado",
      player: updatedPlayer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/players/:id - Eliminar un jugador (solo admin)
 */
export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    // Eliminar imagen de Cloudinary si existe
    if (player.image) {
      const publicId = player.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`cfs-malgrat/${publicId}`);
    }

    res.status(200).json({ message: "Jugador eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/players/stats/top - Obtener estadísticas top
 */
export const getTopStats = async (req, res, next) => {
  try {
    const topScorers = await Player.find({ status: "activo" })
      .sort({ goals: -1 })
      .limit(5);

    const topAssisters = await Player.find({ status: "activo" })
      .sort({ assists: -1 })
      .limit(5);

    const mostMatches = await Player.find()
      .sort({ matchesPlayed: -1 })
      .limit(5);

    res.status(200).json({
      topScorers,
      topAssisters,
      mostMatches,
    });
  } catch (error) {
    next(error);
  }
};
