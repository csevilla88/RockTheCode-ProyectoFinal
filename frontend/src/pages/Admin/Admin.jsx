import { useState, useCallback, useEffect } from "react";
import {
  getPlayers,
  deletePlayer,
  updatePlayer,
  getMatches,
  deleteMatch,
  getNews as fetchNews,
  deleteNews,
  getAllUsers,
  updateUserRole,
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
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [playerForm, setPlayerForm] = useState(null);

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

  const startEditPlayer = useCallback((player) => {
    setEditingPlayerId(player._id);
    setPlayerForm({
      name: player.name,
      lastName: player.lastName,
      position: player.position,
      number: player.number,
      nationality: player.nationality,
      age: player.age,
      goals: player.goals,
      assists: player.assists,
      matchesPlayed: player.matchesPlayed,
      status: player.status,
    });
    setMessage("");
  }, []);

  const cancelEditPlayer = useCallback(() => {
    setEditingPlayerId(null);
    setPlayerForm(null);
  }, []);

  const handlePlayerInputChange = useCallback((key, value) => {
    setPlayerForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const savePlayerEdit = useCallback(async (playerId) => {
    if (!playerForm) return;

    try {
      const payload = {
        ...playerForm,
        number: Number(playerForm.number),
        age: Number(playerForm.age),
        goals: Number(playerForm.goals),
        assists: Number(playerForm.assists),
        matchesPlayed: Number(playerForm.matchesPlayed),
      };

      await updatePlayer(playerId, payload);
      setMessage("Jugador actualizado correctamente");
      setEditingPlayerId(null);
      setPlayerForm(null);
      loadData("players");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  }, [playerForm, loadData]);

  const handleRoleChange = useCallback(async (userId, role) => {
    try {
      await updateUserRole(userId, role);
      setMessage("Rol actualizado correctamente");
      loadData("users");
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.message || err.message));
    }
  }, [loadData]);

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
                  <td>
                    {editingPlayerId === p._id ? (
                      <input className="admin_input" type="number" value={playerForm?.number ?? ""} onChange={(e) => handlePlayerInputChange("number", e.target.value)} />
                    ) : p.number}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <div className="admin_inline-grid">
                        <input className="admin_input" value={playerForm?.name ?? ""} onChange={(e) => handlePlayerInputChange("name", e.target.value)} />
                        <input className="admin_input" value={playerForm?.lastName ?? ""} onChange={(e) => handlePlayerInputChange("lastName", e.target.value)} />
                      </div>
                    ) : <strong>{p.name} {p.lastName}</strong>}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <select className="admin_select" value={playerForm?.position ?? p.position} onChange={(e) => handlePlayerInputChange("position", e.target.value)}>
                        <option value="Portero">Portero</option>
                        <option value="Defensa">Defensa</option>
                        <option value="Centrocampista">Centrocampista</option>
                        <option value="Delantero">Delantero</option>
                      </select>
                    ) : p.position}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <input className="admin_input" value={playerForm?.nationality ?? ""} onChange={(e) => handlePlayerInputChange("nationality", e.target.value)} />
                    ) : p.nationality}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <select className="admin_select" value={playerForm?.status ?? p.status} onChange={(e) => handlePlayerInputChange("status", e.target.value)}>
                        <option value="activo">activo</option>
                        <option value="retirado">retirado</option>
                        <option value="cedido">cedido</option>
                      </select>
                    ) : (
                      <span className={`admin_badge admin_badge--${p.status}`}>
                        {p.status}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <input className="admin_input" type="number" value={playerForm?.goals ?? 0} onChange={(e) => handlePlayerInputChange("goals", e.target.value)} />
                    ) : p.goals}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <input className="admin_input" type="number" value={playerForm?.matchesPlayed ?? 0} onChange={(e) => handlePlayerInputChange("matchesPlayed", e.target.value)} />
                    ) : p.matchesPlayed}
                  </td>
                  <td>
                    {editingPlayerId === p._id ? (
                      <div className="admin_actions">
                        <button className="admin_btn-save" onClick={() => savePlayerEdit(p._id)}>
                          Guardar
                        </button>
                        <button className="admin_btn-cancel" onClick={cancelEditPlayer}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="admin_actions">
                        <button className="admin_btn-edit" onClick={() => startEditPlayer(p)}>
                          Editar
                        </button>
                        <button className="admin_btn-delete" onClick={() => handleDelete(p._id)}>
                          Eliminar
                        </button>
                      </div>
                    )}
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
                    <select
                      className="admin_select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
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

