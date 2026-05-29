import { useMemo } from "react";
import { Link } from "react-router-dom";
import "./MatchCard.css";

const RESULT_CONFIG = {
  victoria: { label: "Victoria", className: "win", icon: "✅" },
  derrota: { label: "Derrota", className: "loss", icon: "❌" },
  empate: { label: "Empate", className: "draw", icon: "🤝" },
};

const MatchCard = ({ match }) => {
  const resultConfig = useMemo(
    () => RESULT_CONFIG[match.result] || RESULT_CONFIG.empate,
    [match.result]
  );

  const formattedDate = useMemo(() => {
    return new Date(match.date).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [match.date]);

  return (
    <Link to={`/partidos/${match._id}`} className="match-card">
      <div className="match-card_header">
        <span className="match-card_competition">{match.competition}</span>
        <span className="match-card_date">{formattedDate}</span>
      </div>

      <div className="match-card_body">
        <div className="match-card_team match-card_team--home">
          <span className="match-card_team-name">
            {match.homeAway === "local" ? "CFS Malgrat" : match.opponent}
          </span>
        </div>

        <div className={`match-card_score match-card_score--${resultConfig.className}`}>
          <span className="match-card_goals">
            {match.homeAway === "local"
              ? `${match.goalsFor} - ${match.goalsAgainst}`
              : `${match.goalsAgainst} - ${match.goalsFor}`}
          </span>
          <span className="match-card_result">{resultConfig.label}</span>
        </div>

        <div className="match-card_team match-card_team--away">
          <span className="match-card_team-name">
            {match.homeAway === "visitante" ? "CFS Malgrat" : match.opponent}
          </span>
        </div>
      </div>

      <div className="match-card_footer">
        <span className="match-card_stadium">📍 {match.stadium}</span>
        {match.attendance > 0 && (
          <span className="match-card_attendance">
            👥 {match.attendance.toLocaleString("es-ES")}
          </span>
        )}
      </div>
    </Link>
  );
};

export default MatchCard;

