import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import clubLogo from "../../assets/img/logoClub.png";
import "../Login/Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e) => {
      clearError();
      setLocalError("");
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [clearError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (formData.password !== formData.confirmPassword) {
        setLocalError("Las contraseñas no coinciden");
        return;
      }

      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      if (result.success) {
        navigate("/");
      }
    },
    [formData, register, navigate]
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card_header">
          <img src={clubLogo} alt="Logo CFS Malgrat" className="auth-card_icon" />
          <h1 className="auth-card_title">Registro</h1>
          <p className="auth-card_subtitle">
            Únete a la familia del CFS Malgrat
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {(error || localError) && (
            <div className="auth-form_error">{error || localError}</div>
          )}

          <div className="auth-form_group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              required
              minLength={3}
            />
          </div>

          <div className="auth-form_group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="auth-form_group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div className="auth-form_group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-form_submit"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-card_footer">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="auth-card_link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

