import { useState, useEffect, useRef } from "react";

/**
 * Hook avanzado para debounce de valores
 * Útil para búsquedas en tiempo real sin sobrecargar el servidor
 * Usa useRef para gestionar el timeout de forma limpia
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    // Limpiar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Crear nuevo timer
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup al desmontar o cambiar valor
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
