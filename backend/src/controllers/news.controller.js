import News from "../models/News.js";

/**
 * GET /api/news - Obtener todas las noticias (con filtros)
 */
export const getNews = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await News.countDocuments(filter);

    const news = await News.find(filter)
      .populate("relatedPlayers", "name lastName number position image")
      .populate("relatedMatch", "opponent date result goalsFor goalsAgainst")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      news,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/news/:id - Obtener una noticia por ID
 */
export const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id)
      .populate("relatedPlayers", "name lastName number position image")
      .populate("relatedMatch", "opponent date result goalsFor goalsAgainst competition");

    if (!news) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/news - Crear una noticia (solo admin)
 */
export const createNews = async (req, res, next) => {
  try {
    const newsData = { ...req.body };

    if (req.file) {
      newsData.image = req.file.path;
    }

    const newNews = await News.create(newsData);
    res.status(201).json({
      message: "Noticia creada correctamente",
      news: newNews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/news/:id - Actualizar una noticia (solo admin)
 */
export const updateNews = async (req, res, next) => {
  try {
    const newsData = { ...req.body };

    if (req.file) {
      newsData.image = req.file.path;
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      newsData,
      { new: true, runValidators: true }
    )
      .populate("relatedPlayers", "name lastName number position")
      .populate("relatedMatch", "opponent date result");

    if (!updatedNews) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }

    res.status(200).json({
      message: "Noticia actualizada",
      news: updatedNews,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/news/:id - Eliminar una noticia (solo admin)
 */
export const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
    res.status(200).json({ message: "Noticia eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
