import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from "./pages/Home/Home";
import Players from "./pages/Players/Players";
import PlayerDetail from "./pages/PlayerDetail/PlayerDetail";
import Matches from "./pages/Matches/Matches";
import MatchDetail from "./pages/MatchDetail/MatchDetail";
import News from "./pages/News/News";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";
import NotFound from "./pages/NotFound/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="app_main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jugadores" element={<Players />} />
              <Route path="/jugadores/:id" element={<PlayerDetail />} />
              <Route path="/partidos" element={<Matches />} />
              <Route path="/partidos/:id" element={<MatchDetail />} />
              <Route path="/noticias" element={<News />} />
              <Route path="/noticias/:id" element={<NewsDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

