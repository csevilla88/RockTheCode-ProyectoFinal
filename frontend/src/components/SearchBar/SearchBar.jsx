import { useState, useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useEffect } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch, placeholder = "Buscar...", delay = 500 }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleClear = useCallback(() => {
    setQuery("");
  }, []);

  return (
    <div className="search-bar">
      <span className="search-bar_icon">🔍</span>
      <input
        type="text"
        className="search-bar_input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar"
      />
      {query && (
        <button
          className="search-bar_clear"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;

