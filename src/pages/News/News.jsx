import { useState, useCallback, useMemo } from "react";
import { getNews } from "../../api/api";
import useFetch from "../../hooks/useFetch";
import NewsCard from "../../components/NewsCard/NewsCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import Loader from "../../components/Loader/Loader";
import "./News.css";

const CATEGORIES = [
  { value: "", label: "Todas" },
  { value: "fichajes", label: "Fichajes" },
  { value: "partidos", label: "Partidos" },
  { value: "entrenamiento", label: "Entrenamiento" },
  { value: "comunidad", label: "Comunidad" },
  { value: "institucional", label: "Institucional" },
];

const News = () => {
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    page: 1,
    limit: 9,
  });

  const fetchParams = useMemo(() => {
    const params = { ...filters };
    if (!params.category) delete params.category;
    if (!params.search) delete params.search;
    return params;
  }, [filters]);

  const { data, loading, error } = useFetch(getNews, fetchParams);

  const handleSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading && !data) return <Loader text="Cargando noticias..." />;

  return (
    <div className="news-page">
      <div className="news-page_header">
        <h1 className="news-page_title">Noticias</h1>
        <p className="news-page_subtitle">
          Toda la actualidad del CFS Malgrat
        </p>
      </div>

      <div className="news-page_filters">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar noticias..."
        />

        <div className="news-page_categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`news-page_cat-btn ${
                filters.category === cat.value ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="news-page_error">{error}</p>}

      {data && (
        <>
          <div className="news-page_grid">
            {data.news.map((article) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>

          {data.news.length === 0 && (
            <p className="news-page_empty">No se encontraron noticias</p>
          )}

          {data.totalPages > 1 && (
            <div className="news-page_pagination">
              <button
                disabled={data.page === 1}
                onClick={() => handlePageChange(data.page - 1)}
                className="news-page_page-btn"
              >
                ← Anterior
              </button>
              <span className="news-page_page-info">
                Página {data.page} de {data.totalPages}
              </span>
              <button
                disabled={data.page === data.totalPages}
                onClick={() => handlePageChange(data.page + 1)}
                className="news-page_page-btn"
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

export default News;

