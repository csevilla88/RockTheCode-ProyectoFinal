import { useState, useCallback, useMemo } from "react";
import { getPlayers, toggleFavorite } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loader from "../../components/Loader/Loader";
import "./Players.css";

const POSITIONS = ["Todas", "Portero", "Defensa", "Centrocampista", "Delantero"];
const STATUSES = ["Todos", "activo", "retirado", "cedido"];
const SORT_OPTIONS = [
  { value: "number", label: "Dorsal" },
  { value: "goals", label: "Goles" },
  { value: "name", label: "Nombre" },
  { value: "age", label: "Edad" },
  { value: "matches", label: "Partidos" },
];

const Players = () => {
  const { isAuthenticated, user, updateUser } = useAuth();
  const [filters, setFilters] = useState({
    position: "",
    status: "",
    search: "",
    sort: "number",
    page: 1,
    limit: 20,
  });

  const fetchParams = useMemo(() => {
    const params = { ...filters };
    if (!params.position) delete params.position;
    if (!params.status) delete params.status;
    if (!params.search) delete params.search;
    return params;
  }, [filters]);

  const { data, loading, error, refetch } = useFetch(getPlayers, fetchParams);

  const handleSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "Todas" || value === "Todos" ? "" : value,
      page: 1,
    }));
  }, []);

  const handleToggleFavorite = useCallback(
    async (playerId) => {
      if (!isAuthenticated) return;
      try {
        const res = await toggleFavorite(playerId);
        updateUser(res.data.user);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [isAuthenticated, updateUser]
  );

  const favoriteIds = useMemo(() => {
    return user?.favoritePlayers?.map((p) => (typeof p === "object" ? p._id : p)) || [];
  }, [user]);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading && !data) return <Loader text="Cargando plantilla..." />;

  return (
    <div className="players-page">
      <div className="players-page_header">
        <h1 className="players-page_title">Plantilla</h1>
        <p className="players-page_subtitle">
          Conoce a todos los jugadores del CFS Malgrat
        </p>
      </div>

      <div className="players-page_filters">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar jugador..."
        />

        <div className="players-page_filter-group">
          <div className="players-page_filter">
            <label>Posición</label>
            <select
              value={filters.position || "Todas"}
              onChange={(e) => handleFilterChange("position", e.target.value)}
            >
              {POSITIONS.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <div className="players-page_filter">
            <label>Estado</label>
            <select
              value={filters.status || "Todos"}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="players-page_filter">
            <label>Ordenar por</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && <p className="players-page_error">{error}</p>}

      {data && (
        <>
          <p className="players-page_count">
            {data.total} jugador{data.total !== 1 ? "es" : ""} encontrado
            {data.total !== 1 ? "s" : ""}
          </p>

          <div className="players-page_grid">
            {data.players.map((player) => (
              <PlayerCard
                key={player._id}
                player={player}
                isFavorite={favoriteIds.includes(player._id)}
                onToggleFavorite={isAuthenticated ? handleToggleFavorite : null}
              />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="players-page_pagination">
              <button
                disabled={data.page === 1}
                onClick={() => handlePageChange(data.page - 1)}
                className="players-page_page-btn"
              >
                ← Anterior
              </button>
              <span className="players-page_page-info">
                Página {data.page} de {data.totalPages}
              </span>
              <button
                disabled={data.page === data.totalPages}
                onClick={() => handlePageChange(data.page + 1)}
                className="players-page_page-btn"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Players;

