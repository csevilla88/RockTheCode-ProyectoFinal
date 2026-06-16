import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader/Loader";

/**
 * Ruta accesible SOLO para usuarios NO autenticados.
 * Si el usuario ya tiene sesión, redirige a la home (o al destino indicado).
 *
 * Se usa en /login y /registro para evitar que un usuario logueado
 * pueda crear cuentas adicionales o volver a entrar.
 */
const PublicOnlyRoute = ({ children, redirectTo = "/" }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
