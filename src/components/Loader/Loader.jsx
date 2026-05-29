import "./Loader.css";

const Loader = ({ text = "Cargando..." }) => {
  return (
    <div className="loader">
      <div className="loader_spinner">
        <div className="loader_ball"></div>
      </div>
      <p className="loader_text">{text}</p>
    </div>
  );
};

export default Loader;

