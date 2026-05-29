import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import clubLogo from "../../assets/img/logoClub.png";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e) => {
      clearError();
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    [clearError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await login(formData);
      if (result.success) {
        navigate("/");
      }
    },
    [formData, login, navigate]
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card_header">
          <img src={clubLogo} alt="Logo CFS Malgrat" className="auth-card_icon" />
          <h1 className="auth-card_title">Iniciar Sesión</h1>
          <p className="auth-card_subtitle">
            Accede al portal del CFS Malgrat
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-form_error">{error}</div>}

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
              placeholder="••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="auth-form_submit"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-card_footer">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="auth-card_link">
            Regístrate aquí
          </Link>
        </p>

        <div className="auth-card_demo">
          <p>Cuentas de prueba:</p>
          <p><strong>Admin:</strong> admin@cfsmalgrat.com / admin123</p>
          <p><strong>Usuario:</strong> fan@cfsmalgrat.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

