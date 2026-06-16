import { useState, useCallback } from "react";
import Modal from "../../components/Modal/Modal";

// Campos editables del modelo Player. Cualquier otro campo (imagen,
// _id, __v, timestamps, etc.) se gestiona aparte para evitar enviar
// datos no esperados al backend.
const EDITABLE_FIELDS = [
  "name", "lastName", "position", "number", "nationality",
  "birthDate", "age", "height", "weight",
  "goals", "assists", "yellowCards", "redCards", "matchesPlayed",
  "status", "bio",
];

const NUMERIC_FIELDS = [
  "number", "age", "height", "weight",
  "goals", "assists", "yellowCards", "redCards", "matchesPlayed",
];

const EMPTY = {
  name: "",
  lastName: "",
  position: "Centrocampista",
  number: "",
  nationality: "",
  birthDate: "",
  age: "",
  height: "",
  weight: "",
  goals: 0,
  assists: 0,
  yellowCards: 0,
  redCards: 0,
  matchesPlayed: 0,
  status: "activo",
  bio: "",
};

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const buildInitial = (player) => {
  if (!player) return { ...EMPTY, __currentImage: "" };
  const base = { ...EMPTY };
  EDITABLE_FIELDS.forEach((k) => {
    if (player[k] !== undefined && player[k] !== null) base[k] = player[k];
  });
  base.birthDate = toDateInput(player.birthDate);
  // URL de la imagen actual (solo para preview, NO se envía al backend)
  base.__currentImage = player.image || "";
  return base;
};

/**
 * Formulario completo de jugador (crear o editar).
 * Incluye TODOS los campos del modelo: número, nacionalidad,
 * fecha de nacimiento (la edad se calcula automáticamente al
 * guardar si hay birthDate), altura, peso, estadísticas, imagen,
 * biografía y estado.
 */
const PlayerFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  player,
  submitting,
}) => {
  const [form, setForm] = useState(() => buildInitial(player));
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  // Cuando cambia el jugador a editar, resetear formulario
  const isEdit = Boolean(player?._id);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFile = useCallback((e) => {
    setFile(e.target.files?.[0] || null);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      // Validación mínima
      if (!form.name || !form.lastName || !form.nationality) {
        setError("Nombre, apellido y nacionalidad son obligatorios");
        return;
      }
      if (!form.birthDate && !form.age) {
        setError("Debes indicar la edad o la fecha de nacimiento");
        return;
      }

      // Construir payload SOLO con los campos editables (descarta
      // _id, __v, image URL, timestamps, __currentImage, etc.)
      const cleanForm = {};
      EDITABLE_FIELDS.forEach((k) => {
        const v = form[k];
        if (v !== "" && v !== null && v !== undefined) cleanForm[k] = v;
      });

      // Si hay birthDate, NO enviamos `age`: lo recalcula el backend.
      if (cleanForm.birthDate) {
        delete cleanForm.age;
      }

      // Si hay imagen → FormData; si no, JSON normal
      let payload;
      if (file) {
        payload = new FormData();
        Object.entries(cleanForm).forEach(([k, v]) => {
          payload.append(k, v);
        });
        payload.append("image", file);
      } else {
        payload = cleanForm;
        // Cast numéricos
        NUMERIC_FIELDS.forEach((k) => {
          if (payload[k] !== undefined) payload[k] = Number(payload[k]);
        });
      }

      try {
        await onSubmit(payload);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Error");
      }
    },
    [form, file, onSubmit]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar jugador" : "Crear jugador"}
      size="lg"
    >
      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-form_error">{error}</div>}

        <div className="admin-form_grid">
          <label className="admin-form_field">
            <span>Nombre*</span>
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Apellido*</span>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Posición*</span>
            <select name="position" value={form.position} onChange={handleChange}>
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Centrocampista">Centrocampista</option>
              <option value="Delantero">Delantero</option>
            </select>
          </label>

          <label className="admin-form_field">
            <span>Dorsal</span>
            <input type="number" name="number" min="1" max="99" value={form.number} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Nacionalidad*</span>
            <input name="nationality" value={form.nationality} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Fecha de nacimiento</span>
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            <small>Si la indicas, la edad se calcula automáticamente</small>
          </label>

          <label className="admin-form_field">
            <span>Edad</span>
            <input type="number" name="age" min="16" max="50" value={form.age} onChange={handleChange} disabled={Boolean(form.birthDate)} />
          </label>

          <label className="admin-form_field">
            <span>Altura (cm)</span>
            <input type="number" name="height" min="150" max="210" value={form.height} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Peso (kg)</span>
            <input type="number" name="weight" min="50" max="120" value={form.weight} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Estado</span>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="activo">activo</option>
              <option value="retirado">retirado</option>
              <option value="cedido">cedido</option>
            </select>
          </label>

          <label className="admin-form_field">
            <span>Partidos jugados</span>
            <input type="number" name="matchesPlayed" min="0" value={form.matchesPlayed} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Goles</span>
            <input type="number" name="goals" min="0" value={form.goals} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Asistencias</span>
            <input type="number" name="assists" min="0" value={form.assists} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Tarjetas amarillas</span>
            <input type="number" name="yellowCards" min="0" value={form.yellowCards} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Tarjetas rojas</span>
            <input type="number" name="redCards" min="0" value={form.redCards} onChange={handleChange} />
          </label>

          <label className="admin-form_field admin-form_field--full">
            <span>Imagen</span>
            <input type="file" accept="image/*" onChange={handleFile} />
            {form.__currentImage && !file && (
              <small>Actual: <a href={form.__currentImage} target="_blank" rel="noreferrer">ver imagen</a></small>
            )}
            {!form.__currentImage && !file && (
              <small>Sin imagen. Sube una para asignarla.</small>
            )}
          </label>

          <label className="admin-form_field admin-form_field--full">
            <span>Biografía</span>
            <textarea name="bio" rows="3" value={form.bio} onChange={handleChange} />
          </label>
        </div>

        <div className="admin-form_actions">
          <button type="button" className="admin-form_btn admin-form_btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="admin-form_btn admin-form_btn--primary" disabled={submitting}>
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear jugador"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PlayerFormModal;
