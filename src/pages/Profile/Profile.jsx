import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toggleFavorite } from "../../api/api";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const handleRemoveFavorite = useCallback(
    async (playerId) => {
      try {
        const res = await toggleFavorite(playerId);
        updateUser(res.data.user);
      } catch (err) {
        console.error("Error:", err);
      }
    },
    [updateUser]
  );

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "—";
    return new Date(user.createdAt).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [user]);

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-page_header">
        <div className="profile-page_avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <span>{user.username?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="profile-page_info">
          <h1 className="profile-page_name">{user.username}</h1>
          <p className="profile-page_email">{user.email}</p>
          <span className="profile-page_role">
            {user.role === "admin" ? "Administrador" : "Socio"}
          </span>
          <p className="profile-page_since">Miembro desde {memberSince}</p>
        </div>
      </div>

      <section className="profile-page_favorites">
        <h2 className="profile-page_section-title">
          Jugadores Favoritos ({user.favoritePlayers?.length || 0})
        </h2>

        {user.favoritePlayers && user.favoritePlayers.length > 0 ? (
          <div className="profile-page_fav-grid">
            {user.favoritePlayers.map((player) => {
              const p = typeof player === "object" ? player : null;
              if (!p) return null;

              return (
                <div key={p._id} className="profile-page_fav-card">
                  <Link to={`/jugadores/${p._id}`} className="profile-page_fav-link">
                    <div className="profile-page_fav-avatar">
                      {p.name?.[0]}{p.lastName?.[0]}
                    </div>
                    <div className="profile-page_fav-info">
                      <span className="profile-page_fav-name">
                        {p.name} {p.lastName}
                      </span>
                      <span className="profile-page_fav-pos">
                        #{p.number} · {p.position}
                      </span>
                    </div>
                  </Link>
                  <button
                    className="profile-page_fav-remove"
                    onClick={() => handleRemoveFavorite(p._id)}
                    aria-label="Eliminar de favoritos"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="profile-page_empty">
            No tienes jugadores favoritos todavía.{" "}
            <Link to="/jugadores">Explora la plantilla</Link>
          </p>
        )}
      </section>
    </div>
  );
};

export default Profile;

