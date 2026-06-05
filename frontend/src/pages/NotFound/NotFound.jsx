import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <span className="not-found_icon">⚽</span>
      <h1 className="not-found_code">404</h1>
      <h2 className="not-found_title">Página no encontrada</h2>
      <p className="not-found_text">
        Parece que esta jugada se fue fuera del campo.
      </p>
      <Link to="/" className="not-found_btn">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;

