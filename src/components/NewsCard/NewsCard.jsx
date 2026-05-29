import { useMemo } from "react";
import { Link } from "react-router-dom";
import "./NewsCard.css";

const CATEGORY_CONFIG = {
  fichajes: { label: "Fichajes", color: "#e91e63" },
  partidos: { label: "Partidos", color: "#2196f3" },
  entrenamiento: { label: "Entrenamiento", color: "#4caf50" },
  comunidad: { label: "Comunidad", color: "#ff9800" },
  institucional: { label: "Institucional", color: "#9c27b0" },
};

const NewsCard = ({ article }) => {
  const categoryConfig = useMemo(
    () => CATEGORY_CONFIG[article.category] || { label: article.category, color: "#666" },
    [article.category]
  );

  const formattedDate = useMemo(() => {
    return new Date(article.date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [article.date]);

  return (
    <Link to={`/noticias/${article._id}`} className="news-card">
      <div className="news-card_image-wrapper">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="news-card_image"
            loading="lazy"
          />
        ) : (
          <div className="news-card_placeholder">
            <span>📰</span>
          </div>
        )}
        <span
          className="news-card_category"
          style={{ background: categoryConfig.color }}
        >
          {categoryConfig.label}
        </span>
      </div>

      <div className="news-card_content">
        <h3 className="news-card_title">{article.title}</h3>
        <p className="news-card_summary">
          {article.summary || article.content?.substring(0, 120) + "..."}
        </p>

        <div className="news-card_footer">
          <span className="news-card_date">📅 {formattedDate}</span>
          <span className="news-card_author">✍️ {article.author}</span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;

