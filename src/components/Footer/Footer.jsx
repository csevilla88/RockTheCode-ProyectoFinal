import { Link } from "react-router-dom";
import clubLogo from "../../assets/img/logoClub.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_container">
        <div className="footer_grid">
          <div className="footer_section">
            <div className="footer_brand">
              <img src={clubLogo} alt="Logo CFS Malgrat" className="footer_logo-icon" />
              <div>
                <h3 className="footer_title">CFS Malgrat</h3>
                <p className="footer_motto">1,2,3 Malgrat!</p>
              </div>
            </div>
            <p className="footer_description">
              Club de Fútbol Malgrat, fundado en 1988. Más de 35 años de historia,
              pasión y compromiso con el fútbol.
            </p>
          </div>

          <div className="footer_section">
            <h4 className="footer_heading">Navegación</h4>
            <nav className="footer_nav">
              <Link to="/" className="footer_link">Inicio</Link>
              <Link to="/jugadores" className="footer_link">Plantilla</Link>
              <Link to="/partidos" className="footer_link">Partidos</Link>
              <Link to="/noticias" className="footer_link">Noticias</Link>
            </nav>
          </div>

          <div className="footer_section">
            <h4 className="footer_heading">Club</h4>
            <nav className="footer_nav">
              <Link to="/registro" className="footer_link">Hazte socio</Link>
              <Link to="/login" className="footer_link">Área privada</Link>
            </nav>
          </div>

          <div className="footer_section">
            <h4 className="footer_heading">Contacto</h4>
            <div className="footer_contact">
              <p>📍 Estadio El Municipal</p>
              <p>📧 info@cfsmalgrat.com</p>
              <p>📞 +34 900 123 456</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

