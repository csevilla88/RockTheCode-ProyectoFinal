# CFS Malgrat — Frontend

SPA en React del portal **CFS Malgrat**. Consume la API del [backend](../backend/README.md).

---

## 🧱 Stack

- **React 19** + **Vite** (dev server + build)
- **React Router DOM 7**
- **Axios** con interceptores (JWT + manejo de 401)
- **Context + useReducer** para autenticación (`AuthContext`)
- **Custom hooks**: `useFetch`, `useDebounce`, `useLocalStorage`
- **CSS modular** por componente + `styles/variables.css` con tokens de diseño
- **Portales de React** para modales propios (sin librerías externas)

---

## 📁 Estructura

```
frontend/
├── index.html
├── vite.config.js
├── eslint.config.js
├── vercel.json                  # config de despliegue en Vercel
├── package.json
├── .env
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx                  # router + rutas protegidas/públicas
    ├── App.css / index.css
    ├── api/api.js               # cliente axios + endpoints
    ├── assets/img/              # imágenes (logo del club, etc.)
    ├── components/
    │   ├── Header/              # navegación + auth
    │   ├── Footer/
    │   ├── Loader/
    │   ├── SearchBar/           # input con useDebounce
    │   ├── PlayerCard/ MatchCard/ NewsCard/
    │   ├── Modal/               # Modal genérico + ConfirmDialog (reemplaza alert/confirm)
    │   ├── ProtectedRoute/      # rutas para usuarios autenticados / admin
    │   └── PublicOnlyRoute/     # /login y /registro: bloquea si ya hay sesión
    ├── context/
    │   └── AuthContext.jsx      # estado global de auth (useReducer)
    ├── hooks/
    │   ├── useFetch.js
    │   ├── useDebounce.js
    │   └── useLocalStorage.js
    ├── pages/
    │   ├── Home/ Players/ PlayerDetail/
    │   ├── Matches/ MatchDetail/
    │   ├── News/ NewsDetail/
    │   ├── Login/ Register/ Profile/
    │   ├── Admin/               # panel CRUD con modales propios
    │   │   ├── Admin.jsx
    │   │   ├── PlayerFormModal.jsx
    │   │   ├── MatchFormModal.jsx
    │   │   └── NewsFormModal.jsx
    │   └── NotFound/
    └── styles/variables.css     # tokens CSS (colores, espacios, sombras...)
```

---

## ⚙️ Variables de entorno

| Variable        | Descripción                                                          | Ejemplo                       |
| --------------- | -------------------------------------------------------------------- | ----------------------------- |
| `VITE_API_URL`  | URL base de la API del backend (incluyendo `/api`, sin barra final)  | `http://localhost:3000/api`   |

---

## 🚀 Scripts

Desde la carpeta `frontend/`:

```powershell
npm install
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build de producción en dist/
npm run preview  # Servir el build local para probarlo
npm run lint     # ESLint
```

---

## 🧭 Páginas

- **Home**: hero con escudo del club, estadísticas globales y resúmenes (jugadores destacados, partidos recientes y últimas noticias).
- **Plantilla**: listado de jugadores con filtros (posición, estado, orden, búsqueda con debounce) y paginación.
- **Detalle de jugador**: estadísticas, biografía y botón para marcar/quitar favorito.
- **Partidos**: listado con filtros por competición y resultado.
- **Detalle de partido**: marcador, goleadores y datos del encuentro.
- **Noticias**: listado por categorías + búsqueda.
- **Detalle de noticia**: artículo con relaciones a jugadores y partido.
- **Login / Registro**: autenticación con JWT.
  Si ya hay sesión iniciada, ambas rutas redirigen a `/` automáticamente
  (`PublicOnlyRoute`), evitando que un usuario logueado se registre dos veces.
- **Perfil**: datos del usuario y jugadores favoritos. Al montar se refresca
  el perfil para garantizar que los favoritos estén poblados sin necesidad de recargar.
- **Admin** (`/admin`, solo rol `admin`): pestañas para Jugadores, Partidos, Noticias y Usuarios.
- **404**: página personalizada para rutas inexistentes.

---

## 🛠️ Panel de administración

`Admin` ofrece CRUD completo para jugadores, partidos y noticias, gestionado con modales propios:

- **`Modal`** genérico montado en un portal a `document.body`, con cierre por overlay y tecla `ESC`, scroll lock del body y animaciones de entrada.
- **`ConfirmDialog`** (basado en `Modal`) para confirmar acciones destructivas, con variantes `danger`, `warning` e `info`.
- **`PlayerFormModal`**: crear y editar jugadores. Incluye **todos** los campos del modelo:
  nombre, apellido, posición, dorsal, nacionalidad, **fecha de nacimiento** (la edad se autocalcula
  en el backend y el input de edad se deshabilita), altura, peso, estadísticas (goles, asistencias,
  amarillas, rojas, partidos), estado, imagen (subida a Cloudinary) y biografía.
- **`MatchFormModal`**: crear y editar partidos (rival, fecha, competición, estadio,
  local/visitante, marcador, temporada, asistencia, árbitro).
  El resultado se **calcula automáticamente** a partir del marcador.
- **`NewsFormModal`**: crear y editar noticias con título, resumen, contenido, categoría,
  autor, fecha e imagen.

---

## 🔐 Autenticación

- El token JWT se guarda en `localStorage` y se añade automáticamente a cada petición mediante el interceptor de Axios en [src/api/api.js](src/api/api.js).
- Si la API responde `401`, el interceptor borra el token y redirige a `/login`.
- El estado global de auth se gestiona con `Context + useReducer` en [src/context/AuthContext.jsx](src/context/AuthContext.jsx).

---

## 🧪 Pruebas rápidas (manuales)

Con backend y frontend arrancados:

1. Abre <http://localhost:5173>.
2. Inicia sesión con **admin** (`admin@cfsmalgrat.com` / `admin123`).
3. Entra en el panel **Admin** y prueba:
   - Crear un nuevo jugador con fecha de nacimiento (verifica que la edad se calcula sola).
   - Subir una imagen a un jugador o noticia.
   - Eliminar un elemento (aparece un modal de confirmación, no un `confirm` del navegador).
   - Cambiar el rol de un usuario.
4. Cierra sesión, entra como **usuario** (`fan@cfsmalgrat.com` / `user123`) y marca/desmarca jugadores favoritos.
5. Comprueba el listado de favoritos en la página **Perfil** (deben aparecer sin recargar).
6. Estando logueado, intenta acceder a `/registro` o `/login`: debes ser redirigido a la home.

---

## ☁️ Despliegue (Vercel)

1. En Vercel → **Add New → Project** → importa el repo.
2. **Root Directory**: `frontend`.
3. Vercel detecta Vite y usa [vercel.json](./vercel.json) para el fallback SPA.
4. Añade la variable de entorno:
   - `VITE_API_URL` = `https://cfs-malgrat-api.onrender.com/api`
5. Tras añadir/cambiar variables: **Redeploy** (Vite las inyecta en build-time).

---

## 📚 Documentación adicional

- README general del proyecto: [../README.md](../README.md)
- API del backend: [../backend/README.md](../backend/README.md)
