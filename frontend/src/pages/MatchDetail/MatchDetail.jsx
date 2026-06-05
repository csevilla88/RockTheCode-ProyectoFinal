import { useParams, Link } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { getMatchById } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader/Loader";
import "./MatchDetail.css";

const MatchDetail = () => {
  const { id } = useParams();
  const fetchMatch = useCallback(() => getMatchById(id), [id]);
  const { data: match, loading, error } = useFetch(fetchMatch);

  const formattedDate = useMemo(() => {
    if (!match) return "";
    return new Date(match.date).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [match]);

  if (loading) return <Loader text="Cargando partido..." />;
  if (error) return <p className="match-detail_error">{error}</p>;
  if (!match) return <p className="match-detail_error">Partido no encontrado</p>;

  const resultClass =
    match.result === "victoria" ? "win" : match.result === "derrota" ? "loss" : "draw";

  return (
    <div className="match-detail">
      <div className={`match-detail_hero match-detail_hero--${resultClass}`}>
        <span className="match-detail_competition">{match.competition}</span>
        <span className="match-detail_season">{match.season}</span>

        <div className="match-detail_scoreboard">
          <div className="match-detail_team">
            <span className="match-detail_team-name">
              {match.homeAway === "local" ? "CFS Malgrat" : match.opponent}
            </span>
          </div>

          <div className="match-detail_score">
            {match.homeAway === "local"
              ? `${match.goalsFor} - ${match.goalsAgainst}`
              : `${match.goalsAgainst} - ${match.goalsFor}`}
          </div>

          <div className="match-detail_team">
            <span className="match-detail_team-name">
              {match.homeAway === "visitante" ? "CFS Malgrat" : match.opponent}
            </span>
          </div>
        </div>

        <span className="match-detail_result-badge">
          {match.result.charAt(0).toUpperCase() + match.result.slice(1)}
        </span>
      </div>

      <div className="match-detail_info-grid">
        <div className="match-detail_info-card">
          <span className="match-detail_info-icon">📅</span>
          <span className="match-detail_info-label">Fecha</span>
          <span className="match-detail_info-value">{formattedDate}</span>
        </div>
        <div className="match-detail_info-card">
          <span className="match-detail_info-icon">📍</span>
          <span className="match-detail_info-label">Estadio</span>
          <span className="match-detail_info-value">{match.stadium}</span>
        </div>
        <div className="match-detail_info-card">
          <span className="match-detail_info-icon">👥</span>
          <span className="match-detail_info-label">Asistencia</span>
          <span className="match-detail_info-value">
            {match.attendance?.toLocaleString("es-ES")}
          </span>
        </div>
        <div className="match-detail_info-card">
          <span className="match-detail_info-icon">⚖️</span>
          <span className="match-detail_info-label">Árbitro</span>
          <span className="match-detail_info-value">{match.referee}</span>
        </div>
      </div>

      {match.scorers && match.scorers.length > 0 && (
        <div className="match-detail_scorers">
          <h3>Goleadores del CFS Malgrat</h3>
          <ul className="match-detail_scorers-list">
            {match.scorers.map((scorer, index) => (
              <li key={index} className="match-detail_scorer">
                <span className="match-detail_scorer-icon">⚽</span>
                {scorer.player ? (
                  <Link
                    to={`/jugadores/${scorer.player._id}`}
                    className="match-detail_scorer-name"
                  >
                    {scorer.player.name} {scorer.player.lastName}
                  </Link>
                ) : (
                  <span className="match-detail_scorer-name">Jugador</span>
                )}
                <span className="match-detail_scorer-minute">
                  min. {scorer.minute}'
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/partidos" className="match-detail_back">
        ← Volver a partidos
      </Link>
    </div>
  );
};

export default MatchDetail;

