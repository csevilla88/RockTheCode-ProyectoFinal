import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook avanzado para fetch de datos con cache, loading, error y refetch
 * Usa useRef para evitar race conditions y useCallback para memoización
 */
const useFetch = (fetchFunction, params = null, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  const execute = useCallback(
    async (overrideParams = null) => {
      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const finalParams = overrideParams || params;
        const response = await fetchFunction(finalParams);

        if (mountedRef.current) {
          setData(response.data);
          setLoading(false);
        }

        return response.data;
      } catch (err) {
        if (err.name !== "AbortError" && mountedRef.current) {
          const errorMessage =
            err.response?.data?.message || err.message || "Error desconocido";
          setError(errorMessage);
          setLoading(false);
        }
        return null;
      }
    },
    [fetchFunction, params]
  );

  useEffect(() => {
    mountedRef.current = true;

    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  const refetch = useCallback(
    (newParams) => {
      return execute(newParams);
    },
    [execute]
  );

  return { data, loading, error, refetch };
};

export default useFetch;
