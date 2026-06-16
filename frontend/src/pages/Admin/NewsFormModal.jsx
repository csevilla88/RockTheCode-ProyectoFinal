import { useCallback, useState } from "react";
import Modal from "../../components/Modal/Modal";

// Campos que se envían al backend al crear/editar una noticia.
// Importante: NO incluimos `relatedPlayers`, `relatedMatch`, `_id`,
// `__v`, `createdAt`, `updatedAt` ni `image` (esos los gestiona el
// backend o se envían aparte). Si se enviase `relatedPlayers` como
// array vacío vía FormData se convertiría en "" y Mongoose intentaría
// castear esa cadena a ObjectId -> CastError.
const EDITABLE_FIELDS = [
  "title",
  "summary",
  "content",
  "category",
  "author",
  "date",
];

const EMPTY = {
  title: "",
  summary: "",
  content: "",
  category: "institucional",
  author: "CFS Malgrat",
  date: "",
};

const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const buildInitial = (article) => {
  if (!article) {
    return { ...EMPTY, date: new Date().toISOString().slice(0, 10) };
  }
  const base = { ...EMPTY };
  EDITABLE_FIELDS.forEach((k) => {
    if (article[k] !== undefined && article[k] !== null) base[k] = article[k];
  });
  base.date = toDateInput(article.date);
  // Guardamos la URL de la imagen actual aparte (sólo lectura) para
  // mostrarla en el formulario; NO se envía al backend.
  base.__currentImage = article.image || "";
  return base;
};

/**
 * Formulario completo de noticia (crear/editar) con soporte para
 * subida de imagen vía Cloudinary (FormData).
 */
const NewsFormModal = ({ isOpen, onClose, onSubmit, article, submitting }) => {
  const [form, setForm] = useState(() => buildInitial(article));
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const isEdit = Boolean(article?._id);

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

      if (!form.title || !form.content || !form.category) {
        setError("Título, contenido y categoría son obligatorios");
        return;
      }

      // Solo enviamos los campos editables (evita relatedPlayers/_id/etc.)
      const cleanForm = {};
      EDITABLE_FIELDS.forEach((k) => {
        if (form[k] !== "" && form[k] !== null && form[k] !== undefined) {
          cleanForm[k] = form[k];
        }
      });

      let payload;
      if (file) {
        payload = new FormData();
        Object.entries(cleanForm).forEach(([k, v]) => {
          payload.append(k, v);
        });
        payload.append("image", file);
      } else {
        payload = cleanForm;
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
      title={isEdit ? "Editar noticia" : "Crear noticia"}
      size="lg"
    >
      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-form_error">{error}</div>}

        <div className="admin-form_grid">
          <label className="admin-form_field admin-form_field--full">
            <span>Título*</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label className="admin-form_field">
            <span>Categoría*</span>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="fichajes">Fichajes</option>
              <option value="partidos">Partidos</option>
              <option value="entrenamiento">Entrenamiento</option>
              <option value="comunidad">Comunidad</option>
              <option value="institucional">Institucional</option>
            </select>
          </label>

          <label className="admin-form_field">
            <span>Autor</span>
            <input name="author" value={form.author} onChange={handleChange} />
          </label>

          <label className="admin-form_field">
            <span>Fecha</span>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
          </label>

          <label className="admin-form_field admin-form_field--full">
            <span>Resumen</span>
            <input name="summary" value={form.summary} onChange={handleChange} />
          </label>

          <label className="admin-form_field admin-form_field--full">
            <span>Contenido*</span>
            <textarea name="content" rows="6" value={form.content} onChange={handleChange} required />
          </label>

          <label className="admin-form_field admin-form_field--full">
            <span>Imagen</span>
            <input type="file" accept="image/*" onChange={handleFile} />
            {form.__currentImage && !file && (
              <small>Actual: <a href={form.__currentImage} target="_blank" rel="noreferrer">ver imagen</a></small>
            )}
          </label>
        </div>

        <div className="admin-form_actions">
          <button type="button" className="admin-form_btn admin-form_btn--cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="admin-form_btn admin-form_btn--primary" disabled={submitting}>
            {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear noticia"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewsFormModal;
