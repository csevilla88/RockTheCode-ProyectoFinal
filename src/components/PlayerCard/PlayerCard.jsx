import { Link } from "react-router-dom";
import { useMemo } from "react";
import "./PlayerCard.css";

const POSITION_COLORS = {
  Portero: "#ff9800",
  Defensa: "#2196f3",
  Centrocampista: "#4caf50",
  Delantero: "#f44336",
};

const PlayerCard = ({ player, isFavorite, onToggleFavorite }) => {
  const positionColor = useMemo(
    () => POSITION_COLORS[player.position] || "#666",
    [player.position]
  );

  const initials = useMemo(
    () => `${player.name?.[0] || ""}${player.lastName?.[0] || ""}`,
    [player.name, player.lastName]
  );

  return (
    <article className="player-card">
      <div className="player-card_image-wrapper">
        {player.image ? (
          <img
            src={player.image}
            alt={`${player.name} ${player.lastName}`}
            className="player-card_image"
            loading="lazy"
          />
        ) : (
          <div className="player-card_avatar">{initials}</div>
        )}
        <span
          className="player-card_number"
          style={{ background: positionColor }}
        >
          {player.number}
        </span>
        {player.status !== "activo" && (
          <span className={`player-card_status player-card_status--${player.status}`}>
            {player.status}
          </span>
        )}
        {onToggleFavorite && (
          <button
            className={`player-card_fav ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(player._id);
            }}
            aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        )}
      </div>

      <Link to={`/jugadores/${player._id}`} className="player-card_content">
        <h3 className="player-card_name">
          {player.name} <strong>{player.lastName}</strong>
        </h3>
        <span
          className="player-card_position"
          style={{ color: positionColor, borderColor: positionColor }}
        >
          {player.position}
        </span>

        <div className="player-card_stats">
          <div className="player-card_stat">
            <span className="player-card_stat-value">{player.goals}</span>
            <span className="player-card_stat-label">Goles</span>
          </div>
          <div className="player-card_stat">
            <span className="player-card_stat-value">{player.assists}</span>
            <span className="player-card_stat-label">Asist.</span>
          </div>
          <div className="player-card_stat">
            <span className="player-card_stat-value">{player.matchesPlayed}</span>
            <span className="player-card_stat-label">PJ</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PlayerCard;

