import { useState, useCallback } from "react";
import Modal from "../../components/Modal/Modal";

/**
 * Modal de edición del perfil del usuario autenticado.
 * Campos: username, email, avatar (archivo) y, opcionalmente,
 * nueva contraseña + confirmación.
 */
const ProfileFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  submitting,
}) => {
  const [form, setForm] = useState({
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleAvatar = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarFile(null);
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");

      if (form.password && form.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (form.password && form.password !== form.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      let payload;
      if (avatarFile) {
        payload = new FormData();
        payload.append("username", form.username);
        if (form.password) payload.append("password", form.password);
        payload.append("avatar", avatarFile);
      } else {
        payload = {
          username: form.username,
        };
        if (form.password) payload.password = form.password;
      }

      try {
        await onSubmit(payload);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Error");
      }
    },
    [form, avatarFile, onSubmit]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar perfil"
      size="md"
    >
      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="admin-form_error">{error}</div>}

        <div className="profile-form_avatar">
          <div className="profile-form_avatar-preview">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Previsualización del avatar" />
            ) : (
              <span>{form.username?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>
          <label className="admin-form_field">
            <span>Cambiar avatar</span>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleAvatar}
            />
            <small>Opcional. Sube una imagen para tu perfil.</small>
          </label>
        </div>

        <div className="admin-form_grid">
          <label className="admin-form_field">
            <span>Nombre de usuario*</span>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </label>

          <label className="admin-form_field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={user?.email || ""}
              disabled
              readOnly
            />
            <small>El email es tu credencial de acceso y no se puede cambiar.</small>
          </label>

          <label className="admin-form_field">
            <span>Nueva contraseña</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              placeholder="Dejar vacío para no cambiarla"
            />
          </label>

          <label className="admin-form_field">
            <span>Confirmar contraseña</span>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength={6}
              placeholder="Repite la nueva contraseña"
              disabled={!form.password}
            />
          </label>
        </div>

        <div className="admin-form_actions">
          <button
            type="button"
            className="admin-form_btn admin-form_btn--cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="admin-form_btn admin-form_btn--primary"
            disabled={submitting}
          >
            {submitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProfileFormModal;
