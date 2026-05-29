import { Link, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import clubLogo from "../../assets/img/logoClub.png";
import "./Header.css";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    setMenuOpen(false);
    navigate("/");
  }, [logout, navigate]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="header">
      <div className="header_container">
        <Link to="/" className="header_logo" onClick={closeMenu}>
          <img src={clubLogo} alt="Logo CFS Malgrat" className="header_logo-icon" />
          <div className="header_logo-text">
            <span className="header_logo-name">CFS Malgrat</span>
            <span className="header_logo-motto">1,2,3 Malgrat!</span>
          </div>
        </Link>

        <button
          className={`header_hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Menú de navegación"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`header_nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="header_link" onClick={closeMenu}>
            Inicio
          </Link>
          <Link to="/jugadores" className="header_link" onClick={closeMenu}>
            Plantilla
          </Link>
          <Link to="/partidos" className="header_link" onClick={closeMenu}>
            Partidos
          </Link>
          <Link to="/noticias" className="header_link" onClick={closeMenu}>
            Noticias
          </Link>

          <div className="header_auth">
            {isAuthenticated ? (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="header_link header_link--admin"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/perfil"
                  className="header_link header_link--profile"
                  onClick={closeMenu}
                >
                  {user?.username}
                </Link>
                <button
                  className="header_btn header_btn--logout"
                  onClick={handleLogout}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="header_btn header_btn--login"
                  onClick={closeMenu}
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="header_btn header_btn--register"
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

