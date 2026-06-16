import { useCallback, useState } from "react";
import Modal from "../../components/Modal/Modal";

// Sólo enviamos al backend los campos editables del partido. Así
// evitamos mandar `scorers` populados, `_id`, `__v`, timestamps, etc.
const EDITABLE_FIELDS = [
  "opponent", "date", "competition", "stadium", "homeAway",
  "goalsFor", "goalsAgainst", "attendance", "referee", "season",
];

const EMPTY = {
  opponent: "",
  date: "",
  competition: "Liga",
  stadium: "",
  homeAway: "local",
  goalsFor: 0,
  goalsAgainst: 0,
  result: "victoria",
  attendance: 0,
  referee: "",
  season: "",
};

const toDateTimeInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  // input datetime-local espera "YYYY-MM-DDTHH:mm"
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const buildInitial = (match) => {
  if (!match) return { ...EMPTY };
  const base = { ...EMPTY };
  EDITABLE_FIELDS.forEach((k) => {
    if (match[k] !== undefined && match[k] !== null) base[k] = match[k];
  });
  base.date = toDateTimeInput(match.date);
  if (match.result) base.result = match.result;
  return base;
};

/**
 * Formulario completo de partido (crear/editar).
 * Los goleadores no se gestionan aquí (requiere selector de jugadores),
 * se editarán desde la propia página del partido o se mantienen los
 * existentes al actualizar.
 */
const MatchFormModal = ({ isOpen, onClose, onSubmit, match, submitting }) => {
  const [form, setForm] = useState(() => buildInitial(match));
  const [error, setError] = useState("");
  const isEdit = Boolean(match?._id);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (!form.opponent || !form.date || !form.stadium || !form.season) {
        setError("Rival, fecha, estadio y temporada son obligatorios");
        return;
      }

      // Calcular resultado automáticamente
      const gf = Number(form.goalsFor);
      const ga = Number(form.goalsAgainst);
      let result = form.result;
      if (gf > ga) result = "victoria";
      else if (gf < ga) result = "derrota";
      else result = "empate";

      // Sólo los campos editables (descarta _id, __v, scorers, etc.)
      const payload = {};
      EDITABLE_FIELDS.forEach((k) => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          payload[k] = form[k];
        }
      });
      payload.goalsFor = gf;
      payload.goalsAgainst = ga;
      payload.attendance = Number(form.attendance) || 0;
      payload.result = result;

      try {
        await onSubmit(payload);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Error");
      }
    },
    [form, onSubmit]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar partido" : "Crear partido"}
      size="lg"
    >
      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-form_error">{error}</div>}

        <div className="admin-form_grid">
          <label className="admin-form_field">
            <span>Rival*</span>
            <input name="opponent" value={form.opponent} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Fecha y hora*</span>
            <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Competición*</span>
            <select name="competition" value={form.competition} onChange={handleChange}>
              <option>Liga</option>
              <option>Copa del Rey</option>
              <option>Champions League</option>
              <option>Amistoso</option>
              <option>Supercopa</option>
            </select>
          </label>

          <label className="admin-form_field">
            <span>Local / Visitante*</span>
            <select name="homeAway" value={form.homeAway} onChange={handleChange}>
              <option value="local">Local</option>
              <option value="visitante">Visitante</option>
            </select>
          </label>

          <label className="admin-form_field">
            <span>Estadio*</span>
            <input name="stadium" value={form.stadium} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Temporada* (p.ej. 2025-2026)</span>
            <input name="season" value={form.season} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Goles a favor</span>
            <input type="number" name="goalsFor" min="0" value={form.goalsFor} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Goles en contra</span>
            <input type="number" name="goalsAgainst" min="0" value={form.goalsAgainst} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Asistencia</span>
            <input type="number" name="attendance" min="0" value={form.attendance} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Árbitro</span>
            <input name="referee" value={form.referee} onChange={handleChange} />
          </label>
        </div>

        <p className="admin-form_hint">
          ℹ️ El resultado (victoria / empate / derrota) se calcula automáticamente
          a partir del marcador.
        </p>

        <div className="admin-form_actions">
          <button type="button" className="admin-form_btn admin-form_btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="admin-form_btn admin-form_btn--primary" disabled={submitting}>
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear partido"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MatchFormModal;
