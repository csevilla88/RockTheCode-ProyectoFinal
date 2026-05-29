import { useParams, Link } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { getNewsById } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader/Loader";
import "./NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();
  const fetchNews = useCallback(() => getNewsById(id), [id]);
  const { data: article, loading, error } = useFetch(fetchNews);

  const formattedDate = useMemo(() => {
    if (!article) return "";
    return new Date(article.date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [article]);

  if (loading) return <Loader text="Cargando noticia..." />;
  if (error) return <p className="news-detail_error">{error}</p>;
  if (!article) return <p className="news-detail_error">Noticia no encontrada</p>;

  return (
    <div className="news-detail">
      <article className="news-detail_article">
        {article.image && (
          <div className="news-detail_image-wrapper">
            <img src={article.image} alt={article.title} className="news-detail_image" />
          </div>
        )}

        <div className="news-detail_content">
          <div className="news-detail_meta">
            <span className="news-detail_category">{article.category}</span>
            <span className="news-detail_date">{formattedDate}</span>
            <span className="news-detail_author">Por {article.author}</span>
          </div>

          <h1 className="news-detail_title">{article.title}</h1>

          {article.summary && (
            <p className="news-detail_summary">{article.summary}</p>
          )}

          <div className="news-detail_body">
            <p>{article.content}</p>
          </div>

          {article.relatedPlayers && article.relatedPlayers.length > 0 && (
            <div className="news-detail_related">
              <h3>Jugadores mencionados</h3>
              <div className="news-detail_related-list">
                {article.relatedPlayers.map((player) => (
                  <Link
                    key={player._id}
                    to={`/jugadores/${player._id}`}
                    className="news-detail_related-tag"
                  >
                    #{player.number} {player.name} {player.lastName}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {article.relatedMatch && (
            <div className="news-detail_related">
              <h3>Partido relacionado</h3>
              <Link
                to={`/partidos/${article.relatedMatch._id}`}
                className="news-detail_related-match"
              >
                CFS Malgrat vs {article.relatedMatch.opponent} (
                {article.relatedMatch.goalsFor}-{article.relatedMatch.goalsAgainst})
              </Link>
            </div>
          )}
        </div>
      </article>

      <Link to="/noticias" className="news-detail_back">
        ← Volver a noticias
      </Link>
    </div>
  );
};

export default NewsDetail;

