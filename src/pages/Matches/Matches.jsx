import { useState, useCallback, useMemo } from "react";
import { getMatches } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import MatchCard from "../../components/MatchCard/MatchCard";
import Loader from "../../components/Loader/Loader";
import "./Matches.css";

const COMPETITIONS = ["Todas", "Liga", "Copa del Rey", "Champions League", "Amistoso"];
const RESULTS = ["Todos", "victoria", "derrota", "empate"];

const Matches = () => {
  const [filters, setFilters] = useState({
    competition: "",
    result: "",
    page: 1,
    limit: 12,
  });

  const fetchParams = useMemo(() => {
    const params = { ...filters };
    if (!params.competition) delete params.competition;
    if (!params.result) delete params.result;
    return params;
  }, [filters]);

  const { data, loading, error } = useFetch(getMatches, fetchParams);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "Todas" || value === "Todos" ? "" : value,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading && !data) return <Loader text="Cargando partidos..." />;

  return (
    <div className="matches-page">
      <div className="matches-page_header">
        <h1 className="matches-page_title">Partidos</h1>
        <p className="matches-page_subtitle">
          Resultados y estadísticas de todos los encuentros
        </p>
      </div>

      <div className="matches-page_filters">
        <div className="matches-page_filter">
          <label>Competición</label>
          <select
            value={filters.competition || "Todas"}
            onChange={(e) => handleFilterChange("competition", e.target.value)}
          >
            {COMPETITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="matches-page_filter">
          <label>Resultado</label>
          <select
            value={filters.result || "Todos"}
            onChange={(e) => handleFilterChange("result", e.target.value)}
          >
            {RESULTS.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="matches-page_error">{error}</p>}

      {data && (
        <>
          <p className="matches-page_count">
            {data.total} partido{data.total !== 1 ? "s" : ""}
          </p>

          <div className="matches-page_grid">
            {data.matches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="matches-page_pagination">
              <button
                disabled={data.page === 1}
                onClick={() => handlePageChange(data.page - 1)}
                className="matches-page_page-btn"
              >
                ← Anterior
              </button>
              <span className="matches-page_page-info">
                Página {data.page} de {data.totalPages}
              </span>
              <button
                disabled={data.page === data.totalPages}
                onClick={() => handlePageChange(data.page + 1)}
                className="matches-page_page-btn"
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

export default Matches;

