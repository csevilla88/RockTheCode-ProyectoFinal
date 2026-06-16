import { useState, useCallback, useEffect } from "react";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  getNews as fetchNews,
  createNews,
  updateNews,
  deleteNews,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../api/api";
import Loader from "../../components/Loader/Loader";
import ConfirmDialog from "../../components/Modal/ConfirmDialog";
import PlayerFormModal from "./PlayerFormModal";
import MatchFormModal from "./MatchFormModal";
import NewsFormModal from "./NewsFormModal";
import "./Admin.css";

const TABS = [
  { key: "players", label: "Jugadores" },
  { key: "matches", label: "Partidos" },
  { key: "news", label: "Noticias" },
  { key: "users", label: "Usuarios" },
];

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-ES");
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("players");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { text, type }
  const [submitting, setSubmitting] = useState(false);

  // Modal estado: { type: 'players'|'matches'|'news', entity: obj|null }
  const [formModal, setFormModal] = useState(null);
  // Confirm dialog: { id, type }
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showMessage = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }, []);

  const loadData = useCallback(
    async (tab) => {
      setLoading(true);
      try {
        let res;
        switch (tab) {
          case "players":
            res = await getPlayers({ limit: 500 });
            setData(res.data.players);
            break;
          case "matches":
            res = await getMatches({ limit: 500 });
            setData(res.data.matches);
            break;
          case "news":
            res = await fetchNews({ limit: 500 });
            setData(res.data.news);
            break;
          case "users":
            res = await getAllUsers();
            setData(res.data);
            break;
          default:
            break;
        }
      } catch (err) {
        showMessage(
          "Error cargando datos: " + (err.response?.data?.message || err.message),
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [showMessage]
  );

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, loadData]);

  // ============ CRUD ============
  const performDelete = useCallback(async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    try {
      if (type === "players") await deletePlayer(id);
      else if (type === "matches") await deleteMatch(id);
      else if (type === "news") await deleteNews(id);
      else if (type === "users") await deleteUser(id);

      showMessage("Elemento eliminado correctamente");
      loadData(type);
    } catch (err) {
      showMessage(
        "Error: " + (err.response?.data?.message || err.message),
        "error"
      );
    }
  }, [confirmDelete, loadData, showMessage]);

  const handleSavePlayer = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        if (formModal?.entity?._id) {
          await updatePlayer(formModal.entity._id, payload);
          showMessage("Jugador actualizado correctamente");
        } else {
          await createPlayer(payload);
          showMessage("Jugador creado correctamente");
        }
        setFormModal(null);
        loadData("players");
      } finally {
        setSubmitting(false);
      }
    },
    [formModal, loadData, showMessage]
  );

  const handleSaveMatch = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        if (formModal?.entity?._id) {
          await updateMatch(formModal.entity._id, payload);
          showMessage("Partido actualizado correctamente");
        } else {
          await createMatch(payload);
          showMessage("Partido creado correctamente");
        }
        setFormModal(null);
        loadData("matches");
      } finally {
        setSubmitting(false);
      }
    },
    [formModal, loadData, showMessage]
  );

  const handleSaveNews = useCallback(
    async (payload) => {
      setSubmitting(true);
      try {
        if (formModal?.entity?._id) {
          await updateNews(formModal.entity._id, payload);
          showMessage("Noticia actualizada correctamente");
        } else {
          await createNews(payload);
          showMessage("Noticia creada correctamente");
        }
        setFormModal(null);
        loadData("news");
      } finally {
        setSubmitting(false);
      }
    },
    [formModal, loadData, showMessage]
  );

  const handleRoleChange = useCallback(
    async (userId, role) => {
      try {
        await updateUserRole(userId, role);
        showMessage("Rol actualizado correctamente");
        loadData("users");
      } catch (err) {
        showMessage(
          "Error: " + (err.response?.data?.message || err.message),
          "error"
        );
      }
    },
    [loadData, showMessage]
  );

  // ============ Renderers ============
  const renderActions = (entity, type) => (
    <div className="admin_actions">
      {type !== "users" && (
        <button
          className="admin_btn-edit"
          onClick={() => setFormModal({ type, entity })}
        >
          Editar
        </button>
      )}
      <button
        className="admin_btn-delete"
        onClick={() => setConfirmDelete({ id: entity._id, type })}
      >
        Eliminar
      </button>
    </div>
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
                <th>Edad</th>
                <th>Estado</th>
                <th>G/A</th>
                <th>PJ</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p._id}>
                  <td>{p.number || "—"}</td>
                  <td>
                    <strong>
                      {p.name} {p.lastName}
                    </strong>
                  </td>
                  <td>{p.position}</td>
                  <td>{p.nationality}</td>
                  <td>{p.age ?? "—"}</td>
                  <td>
                    <span className={`admin_badge admin_badge--${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    {p.goals}/{p.assists}
                  </td>
                  <td>{p.matchesPlayed}</td>
                  <td>{renderActions(p, "players")}</td>
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
                  <td>{formatDate(m.date)}</td>
                  <td>
                    <strong>{m.opponent}</strong>
                  </td>
                  <td>{m.competition}</td>
                  <td>
                    <span className={`admin_badge admin_badge--${m.result}`}>
                      {m.result}
                    </span>
                  </td>
                  <td>
                    {m.goalsFor} - {m.goalsAgainst}
                  </td>
                  <td>{renderActions(m, "matches")}</td>
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
                  <td>{formatDate(n.date)}</td>
                  <td>
                    <strong>{n.title}</strong>
                  </td>
                  <td>{n.category}</td>
                  <td>{n.author}</td>
                  <td>{renderActions(n, "news")}</td>
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
                  <td>
                    <strong>{u.username}</strong>
                  </td>
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
                  <td>{formatDate(u.createdAt)}</td>
                  <td>{renderActions(u, "users")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  const canCreate = activeTab !== "users";
  const createLabel = {
    players: "+ Crear jugador",
    matches: "+ Crear partido",
    news: "+ Crear noticia",
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

      {canCreate && (
        <div className="admin_toolbar">
          <button
            className="admin_btn-create"
            onClick={() => setFormModal({ type: activeTab, entity: null })}
          >
            {createLabel[activeTab]}
          </button>
        </div>
      )}

      {message && (
        <div className={`admin_message ${message.type}`}>{message.text}</div>
      )}

      <div className="admin_content">{renderTable()}</div>

      {/* ===== Modales de creación / edición ===== */}
      {formModal?.type === "players" && (
        <PlayerFormModal
          isOpen
          onClose={() => setFormModal(null)}
          onSubmit={handleSavePlayer}
          player={formModal.entity}
          submitting={submitting}
        />
      )}

      {formModal?.type === "matches" && (
        <MatchFormModal
          isOpen
          onClose={() => setFormModal(null)}
          onSubmit={handleSaveMatch}
          match={formModal.entity}
          submitting={submitting}
        />
      )}

      {formModal?.type === "news" && (
        <NewsFormModal
          isOpen
          onClose={() => setFormModal(null)}
          onSubmit={handleSaveNews}
          article={formModal.entity}
          submitting={submitting}
        />
      )}

      {/* ===== Diálogo de confirmación de borrado ===== */}
      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="¿Eliminar elemento?"
        message="Esta acción no se puede deshacer. ¿Quieres continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={performDelete}
      />
    </div>
  );
};

export default Admin;

