import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getPlayers, getMatches, getNews, getMatchStats } from "../../api/api";
import clubLogo from "../../assets/img/logoClub.png";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import MatchCard from "../../components/MatchCard/MatchCard";
import NewsCard from "../../components/NewsCard/NewsCard";
import Loader from "../../components/Loader/Loader";
import "./Home.css";

const Home = () => {
  const [featuredPlayers, setFeaturedPlayers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [playersRes, matchesRes, newsRes, statsRes] = await Promise.all([
          getPlayers({ status: "activo", sort: "goals", limit: 4 }),
          getMatches({ limit: 3 }),
          getNews({ limit: 3 }),
          getMatchStats(),
        ]);

        setFeaturedPlayers(playersRes.data.players);
        setRecentMatches(matchesRes.data.matches);
        setLatestNews(newsRes.data.news);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const winRate = useMemo(() => {
    if (!stats || !stats.totalMatches) return 0;
    return Math.round((stats.victories / stats.totalMatches) * 100);
  }, [stats]);

  if (loading) return <Loader text="Cargando CFS Malgrat..." />;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home_hero">
        <div className="home_hero-content">
          <span className="home_hero-badge">Temporada 2025-2026</span>
          <h1 className="home_hero-title">
            CFS <span>Malgrat</span>
          </h1>
          <p className="home_hero-subtitle">
            Más de 35 años de historia, pasión y compromiso con el fútbol. 
              ¡1,2,3 Malgrat!
          </p>
          <div className="home_hero-actions">
            <Link to="/jugadores" className="home_hero-btn home_hero-btn--primary">
              Ver Plantilla
            </Link>
            <Link to="/partidos" className="home_hero-btn home_hero-btn--secondary">
              Resultados
            </Link>
          </div>
        </div>
        <div className="home_hero-decoration">
          <img src={clubLogo} alt="Logo CFS Malgrat" className="home_hero-logo" />
        </div>
      </section>

      {/* Estadísticas */}
      {stats && (
        <section className="home_stats">
          <div className="home_stats-grid">
            <div className="home_stat-card">
              <span className="home_stat-value">{stats.totalMatches}</span>
              <span className="home_stat-label">Partidos</span>
            </div>
            <div className="home_stat-card">
              <span className="home_stat-value">{stats.victories}</span>
              <span className="home_stat-label">Victorias</span>
            </div>
            <div className="home_stat-card">
              <span className="home_stat-value">{stats.totalGoalsFor}</span>
              <span className="home_stat-label">Goles a favor</span>
            </div>
            <div className="home_stat-card">
              <span className="home_stat-value">{winRate}%</span>
              <span className="home_stat-label">% Victoria</span>
            </div>
          </div>
        </section>
      )}

      {/* Jugadores Destacados */}
      <section className="home_section">
        <div className="home_section-header">
          <h2 className="home_section-title">Jugadores Destacados</h2>
          <Link to="/jugadores" className="home_section-link">
            Ver todos →
          </Link>
        </div>
        <div className="home_players-grid">
          {featuredPlayers.map((player) => (
            <PlayerCard key={player._id} player={player} />
          ))}
        </div>
      </section>

      {/* Últimos Resultados */}
      <section className="home_section">
        <div className="home_section-header">
          <h2 className="home_section-title">Últimos Resultados</h2>
          <Link to="/partidos" className="home_section-link">
            Ver todos →
          </Link>
        </div>
        <div className="home_matches-grid">
          {recentMatches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      </section>

      {/* Últimas Noticias */}
      <section className="home_section">
        <div className="home_section-header">
          <h2 className="home_section-title">Últimas Noticias</h2>
          <Link to="/noticias" className="home_section-link">
            Ver todas →
          </Link>
        </div>
        <div className="home_news-grid">
          {latestNews.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="home_cta">
        <h2 className="home_cta-title">¿Eres del CFS Malgrat?</h2>
        <p className="home_cta-text">
          Únete a nuestra comunidad, sigue a tus jugadores favoritos y no te
          pierdas ningún partido.
        </p>
        <Link to="/registro" className="home_cta-btn">
          Hazte Socio
        </Link>
      </section>
    </div>
  );
};

export default Home;

