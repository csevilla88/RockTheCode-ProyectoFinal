# CFS Malgrat — Frontend

React del portal **CFS Malgrat**. Consume la API del [backend](../backend/README.md).

---

## 🧱 Stack

- **React 19**
- **React Router DOM 7**
- **Vite** (dev server + build)
- **Axios** con interceptores (JWT + manejo de 401)
- **CSS modular** por componente y `styles/variables.css` con tokens de diseño
- **Custom hooks**: `useFetch`, `useDebounce`, `useLocalStorage`
- **Context + useReducer** para autenticación (`AuthContext`)

---

## 📁 Estructura

```
frontend/
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── .env.example
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css / index.css
    ├── api/api.js               # axios + endpoints
    ├── assets/img/              # imágenes (logo del club, etc.)
    ├── components/              # Header, Footer, Cards, SearchBar, Loader, ProtectedRoute
    ├── context/AuthContext.jsx  # estado global de auth
    ├── hooks/                   # useFetch, useDebounce, useLocalStorage
    ├── pages/                   # Home, Players, Matches, News, Login, Register, Admin...
    └── styles/variables.css     # tokens CSS
```

---

## ⚙️ Variables de entorno

| Variable        | Descripción                                                          | Ejemplo                       |
| --------------- | -------------------------------------------------------------------- | ----------------------------- |
| `VITE_API_URL`  | URL base de la API del backend (sin barra final, incluyendo `/api`)  | `http://localhost:3000/api`   |

---

## 🚀 Scripts

Desde la carpeta `frontend/`:

```powershell
npm install
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build de producción en dist/
npm run preview  # Servir el build local
npm run lint     # Lint
```

---

## 🧭 Páginas

- **Home**: hero con escudo del club, estadísticas globales y resúmenes (jugadores destacados, partidos recientes y últimas noticias).
- **Plantilla**: listado de jugadores con filtros (posición, estado, ordenación, búsqueda con debounce) y paginación.
- **Detalle jugador**: estadísticas, biografía, marcar/quitar favorito.
- **Partidos**: listado con filtros por competición y resultado.
- **Detalle partido**: marcador, goleadores y datos del encuentro.
- **Noticias**: listado por categorías + búsqueda.
- **Detalle noticia**: artículo con relaciones a jugadores y partido.
- **Login / Registro**: autenticación con JWT.
- **Perfil**: datos del usuario y jugadores favoritos.
- **Admin** (rol `admin`): pestañas por recurso (Jugadores, Partidos, Noticias, Usuarios) con acciones:
  - Edición inline de jugadores
  - Cambio de rol de usuarios
  - Eliminación de cualquier recurso
- **404**: página personalizada para rutas inexistentes.

---

## 🧩 Componentes destacados

- `Header` / `Footer` con el escudo del club.
- `PlayerCard`, `MatchCard`, `NewsCard` reutilizables.
- `SearchBar` con debounce (custom hook `useDebounce`).
- `Loader` para estados de carga.
- `ProtectedRoute` para rutas privadas y de admin.

---

## 🔐 Autenticación

- El token JWT se guarda en `localStorage` y se añade automáticamente a cada petición mediante el interceptor de Axios (`src/api/api.js`).
- Si la API responde `401`, el usuario se desloguea y se redirige al login.
- El estado global de autenticación se gestiona con `Context + useReducer` en [src/context/AuthContext.jsx](src/context/AuthContext.jsx).

---

## 🧪 Pruebas rápidas (manuales)

Con backend y frontend arrancados:

1. Abre `http://localhost:5173`.
2. Inicia sesión con **admin** (`admin@cfsmalgrat.com` / `admin123`).
3. Entra en el panel **Admin** y prueba:
   - Editar un jugador en línea.
   - Cambiar el rol de un usuario.
4. Cierra sesión, entra como **usuario** (`fan@cfsmalgrat.com` / `user123`) y marca/desmarca jugadores favoritos.
5. Comprueba el listado de favoritos en la página **Perfil**.

---

## 📚 Documentación adicional

- README general del proyecto: [../README.md](../README.md)
- API del backend: [../backend/README.md](../backend/README.md)
