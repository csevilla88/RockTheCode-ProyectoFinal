import { useState, useCallback, useEffect } from "react";
import {
  getPlayers,
  deletePlayer,
  getMatches,
  deleteMatch,
  getNews as fetchNews,
  deleteNews,
  getAllUsers,
  deleteUser,
} from "../../api/api";
import Loader from "../../components/Loader/Loader";
import "./Admin.css";

const TABS = [
  { key: "players", label: "Jugadores" },
  { key: "matches", label: "Partidos" },
  { key: "news", label: "Noticias" },
  { key: "users", label: "Usuarios" },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("players");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async (tab) => {
    setLoading(true);
    setMessage("");
    try {
      let res;
      switch (tab) {
        case "players":
          res = await getPlayers({ limit: 200 });
          setData(res.data.players);
          break;
        case "matches":
          res = await getMatches({ limit: 200 });
          setData(res.data.matches);
          break;
        case "news":
          res = await fetchNews({ limit: 200 });
          setData(res.data.news);
          break;
        case "users":
          res = await getAllUsers();
          setData(res.data);
          break;
      }
    } catch (err) {
      setMessage("Error cargando datos: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;

      try {
        switch (activeTab) {
          case "players":
            await deletePlayer(id);
            break;
          case "matches":
            await deleteMatch(id);
            break;
          case "news":
            await deleteNews(id);
            break;
          case "users":
            await deleteUser(id);
            break;
        }
        setMessage("Elemento eliminado correctamente");
        loadData(activeTab);
      } catch (err) {
        setMessage("Error: " + (err.response?.data?.message || err.message));
      }
    },
    [activeTab, loadData]
  );

  const renderTable = () => {
    if (loading) return <Loader text="Cargando datos..." />;
    if (!data.length) return <p className="admin_empty">No hay datos</p>;

    switch (activeTab) {
      case "players":
        return (
          <table className="admin_table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Nacionalidad</th>
                <th>Estado</th>
                <th>Goles</th>
                <th>PJ</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p._id}>
                  <td>{p.number}</td>
                  <td><strong>{p.name} {p.lastName}</strong></td>
                  <td>{p.position}</td>
                  <td>{p.nationality}</td>
                  <td>
                    <span className={`admin_badge admin_badge--${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.goals}</td>
                  <td>{p.matchesPlayed}</td>
                  <td>
                    <button className="admin_btn-delete" onClick={() => handleDelete(p._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "matches":
        return (
          <table className="admin_table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Rival</th>
                <th>Competición</th>
                <th>Resultado</th>
                <th>Marcador</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((m) => (
                <tr key={m._id}>
                  <td>{new Date(m.date).toLocaleDateString("es-ES")}</td>
                  <td><strong>{m.opponent}</strong></td>
                  <td>{m.competition}</td>
                  <td>
                    <span className={`admin_badge admin_badge--${m.result}`}>
                      {m.result}
                    </span>
                  </td>
                  <td>{m.goalsFor} - {m.goalsAgainst}</td>
                  <td>
                    <button className="admin_btn-delete" onClick={() => handleDelete(m._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "news":
        return (
          <table className="admin_table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((n) => (
                <tr key={n._id}>
                  <td>{new Date(n.date).toLocaleDateString("es-ES")}</td>
                  <td><strong>{n.title}</strong></td>
                  <td>{n.category}</td>
                  <td>{n.author}</td>
                  <td>
                    <button className="admin_btn-delete" onClick={() => handleDelete(n._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "users":
        return (
          <table className="admin_table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u._id}>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin_badge admin_badge--${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString("es-ES")}</td>
                  <td>
                    <button className="admin_btn-delete" onClick={() => handleDelete(u._id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin">
      <div className="admin_header">
        <h1 className="admin_title">Panel de Administración</h1>
        <p className="admin_subtitle">Gestión del contenido del CFS Malgrat</p>
      </div>

      <div className="admin_tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`admin_tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div className={`admin_message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <div className="admin_content">{renderTable()}</div>
    </div>
  );
};

export default Admin;

