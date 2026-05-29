import Match from "../models/Match.js";

/**
 * GET /api/matches - Obtener todos los partidos (con filtros)
 */
export const getMatches = async (req, res, next) => {
  try {
    const { competition, result, season, homeAway, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (competition) filter.competition = competition;
    if (result) filter.result = result;
    if (season) filter.season = season;
    if (homeAway) filter.homeAway = homeAway;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Match.countDocuments(filter);

    const matches = await Match.find(filter)
      .populate("scorers.player", "name lastName number position")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      matches,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/matches/:id - Obtener un partido por ID
 */
export const getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate(
      "scorers.player",
      "name lastName number position image"
    );
    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }
    res.status(200).json(match);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/matches - Crear un partido (solo admin)
 */
export const createMatch = async (req, res, next) => {
  try {
    const newMatch = await Match.create(req.body);
    res.status(201).json({
      message: "Partido creado correctamente",
      match: newMatch,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/matches/:id - Actualizar un partido (solo admin)
 */
export const updateMatch = async (req, res, next) => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("scorers.player", "name lastName number");

    if (!updatedMatch) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }

    res.status(200).json({
      message: "Partido actualizado",
      match: updatedMatch,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/matches/:id - Eliminar un partido (solo admin)
 */
export const deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({ message: "Partido no encontrado" });
    }
    res.status(200).json({ message: "Partido eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/matches/stats/summary - Resumen estadístico de partidos
 */
export const getMatchStats = async (req, res, next) => {
  try {
    const totalMatches = await Match.countDocuments();
    const victories = await Match.countDocuments({ result: "victoria" });
    const draws = await Match.countDocuments({ result: "empate" });
    const defeats = await Match.countDocuments({ result: "derrota" });

    const goalsData = await Match.aggregate([
      {
        $group: {
          _id: null,
          totalGoalsFor: { $sum: "$goalsFor" },
          totalGoalsAgainst: { $sum: "$goalsAgainst" },
          avgAttendance: { $avg: "$attendance" },
        },
      },
    ]);

    res.status(200).json({
      totalMatches,
      victories,
      draws,
      defeats,
      totalGoalsFor: goalsData[0]?.totalGoalsFor || 0,
      totalGoalsAgainst: goalsData[0]?.totalGoalsAgainst || 0,
      avgAttendance: Math.round(goalsData[0]?.avgAttendance || 0),
    });
  } catch (error) {
    next(error);
  }
};
