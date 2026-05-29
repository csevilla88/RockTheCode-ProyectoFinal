import { useParams, Link } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { getPlayerById, toggleFavorite } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import Loader from "../../components/Loader/Loader";
import "./PlayerDetail.css";

const POSITION_COLORS = {
  Portero: "#ff9800",
  Defensa: "#2196f3",
  Centrocampista: "#4caf50",
  Delantero: "#f44336",
};

const PlayerDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user, updateUser } = useAuth();

  const fetchPlayer = useCallback(() => getPlayerById(id), [id]);
  const { data: player, loading, error } = useFetch(fetchPlayer);

  const isFavorite = useMemo(() => {
    if (!user || !player) return false;
    return user.favoritePlayers?.some(
      (p) => (typeof p === "object" ? p._id : p) === player._id
    );
  }, [user, player]);

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated || !player) return;
    try {
      const res = await toggleFavorite(player._id);
      updateUser(res.data.user);
    } catch (err) {
      console.error("Error:", err);
    }
  }, [isAuthenticated, player, updateUser]);

  const initials = useMemo(
    () => player ? `${player.name?.[0] || ""}${player.lastName?.[0] || ""}` : "",
    [player]
  );

  if (loading) return <Loader text="Cargando jugador..." />;
  if (error) return <p className="player-detail_error">{error}</p>;
  if (!player) return <p className="player-detail_error">Jugador no encontrado</p>;

  const posColor = POSITION_COLORS[player.position] || "#666";

  return (
    <div className="player-detail">
      <div className="player-detail_hero" style={{ borderColor: posColor }}>
        <div className="player-detail_image-section">
          {player.image ? (
            <img
              src={player.image}
              alt={`${player.name} ${player.lastName}`}
              className="player-detail_photo"
            />
          ) : (
            <div className="player-detail_avatar">{initials}</div>
          )}
        </div>

        <div className="player-detail_info">
          <div className="player-detail_top">
            <span className="player-detail_number">{player.number}</span>
            <span
              className="player-detail_position"
              style={{ background: posColor }}
            >
              {player.position}
            </span>
            {player.status !== "activo" && (
              <span className={`player-detail_status player-detail_status--${player.status}`}>
                {player.status}
              </span>
            )}
          </div>

          <h1 className="player-detail_name">
            {player.name} <strong>{player.lastName}</strong>
          </h1>

          <div className="player-detail_meta">
            <span>🌍 {player.nationality}</span>
            <span>📅 {player.age} años</span>
            <span>📏 {player.height} cm</span>
            <span>⚖️ {player.weight} kg</span>
          </div>

          {isAuthenticated && (
            <button
              className={`player-detail_fav-btn ${isFavorite ? "active" : ""}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? "★ En favoritos" : "☆ Añadir a favoritos"}
            </button>
          )}
        </div>
      </div>

      <div className="player-detail_stats-grid">
        <div className="player-detail_stat-card">
          <span className="player-detail_stat-value">{player.matchesPlayed}</span>
          <span className="player-detail_stat-label">Partidos Jugados</span>
        </div>
        <div className="player-detail_stat-card">
          <span className="player-detail_stat-value">{player.goals}</span>
          <span className="player-detail_stat-label">Goles</span>
        </div>
        <div className="player-detail_stat-card">
          <span className="player-detail_stat-value">{player.assists}</span>
          <span className="player-detail_stat-label">Asistencias</span>
        </div>
        <div className="player-detail_stat-card">
          <span className="player-detail_stat-value">{player.yellowCards}</span>
          <span className="player-detail_stat-label">Tarjetas Amarillas</span>
        </div>
        <div className="player-detail_stat-card">
          <span className="player-detail_stat-value">{player.redCards}</span>
          <span className="player-detail_stat-label">Tarjetas Rojas</span>
        </div>
        <div className="player-detail_stat-card">
          <span className="player-detail_stat-value">
            {player.matchesPlayed > 0
              ? (player.goals / player.matchesPlayed).toFixed(2)
              : "0.00"}
          </span>
          <span className="player-detail_stat-label">Goles/Partido</span>
        </div>
      </div>

      {player.bio && (
        <div className="player-detail_bio">
          <h3>Biografía</h3>
          <p>{player.bio}</p>
        </div>
      )}

      <Link to="/jugadores" className="player-detail_back">
        ← Volver a la plantilla
      </Link>
    </div>
  );
};

export default PlayerDetail;

