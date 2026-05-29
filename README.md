# ⚽ CFS Malgrat — Portal del Club de Fútbol

> **Fuerza y Gloria** · Proyecto FullStack — RockTheCode Proyecto Final

## 📋 Descripción

**CFS Malgrat** es un portal web FullStack para un club de fútbol ficticio, el **Club de Fútbol Sala Malgrat**, fundado en 1923. La aplicación permite a los aficionados explorar la plantilla, consultar resultados de partidos, leer noticias del club y gestionar su perfil como socios.

El proyecto está pensado para un **público aficionado al fútbol** que busca un punto central de información sobre su club: jugadores, resultados, estadísticas y noticias. Los administradores disponen de un panel para gestionar todo el contenido.

## 🎯 Público Objetivo

- **Aficionados del CFS Malgrat** que quieren seguir la actualidad del club
- **Socios registrados** que desean personalizar su experiencia (jugadores favoritos)
- **Administradores del club** que necesitan gestionar contenido (jugadores, partidos, noticias)

## 🏗️ Arquitectura del Proyecto

```
RockTheCode-ProyectoFinal/
├── backend/                          # API REST con Node.js
│   ├── package.json
│   ├── index.js                      # Entry point del servidor
│   ├── .env.example                  # Variables de entorno de ejemplo
│   ├── data/                         # CSVs con datos iniciales
│   │   ├── players.csv               # 105 jugadores
│   │   ├── matches.csv               # 55 partidos
│   │   └── news.csv                  # 25 noticias
│   └── src/
│       ├── config/
│       │   ├── db.js                 # Conexión a MongoDB
│       │   └── cloudinary.js         # Configuración de Cloudinary
│       ├── models/
│       │   ├── User.js               # Modelo de usuarios
│       │   ├── Player.js             # Modelo de jugadores
│       │   ├── Match.js              # Modelo de partidos
│       │   └── News.js               # Modelo de noticias
│       ├── controllers/
│       │   ├── user.controller.js
│       │   ├── player.controller.js
│       │   ├── match.controller.js
│       │   └── news.controller.js
│       ├── routes/
│       │   ├── index.js              # Router principal
│       │   ├── user.routes.js
│       │   ├── player.routes.js
│       │   ├── match.routes.js
│       │   └── news.routes.js
│       ├── middlewares/
│       │   └── auth.js               # JWT auth + roles
│       ├── seeds/
│       │   └── seed.js               # Script de seeding desde CSV
│       └── utils/
│           ├── csvParser.js          # Parser CSV con fs de Node.js
│           └── jwt.js                # Generación/verificación JWT
├── src/                              # Frontend React
│   ├── main.jsx
│   ├── App.jsx                       # Router principal
│   ├── index.css                     # Estilos globales
│   ├── App.css
│   ├── styles/
│   │   └── variables.css             # Variables CSS (colores, spacing, etc.)
│   ├── api/
│   │   └── api.js                    # Axios instance + endpoints
│   ├── context/
│   │   └── AuthContext.jsx           # Context + useReducer para auth
│   ├── hooks/
│   │   ├── useFetch.js               # Hook de fetch con cache y abort
│   │   ├── useDebounce.js            # Hook de debounce para búsquedas
│   │   └── useLocalStorage.js        # Hook de persistencia local
│   ├── components/
│   │   ├── Header/                   # Navegación responsive
│   │   ├── Footer/                   # Pie de página
│   │   ├── PlayerCard/               # Tarjeta de jugador reutilizable
│   │   ├── MatchCard/                # Tarjeta de partido reutilizable
│   │   ├── NewsCard/                 # Tarjeta de noticia reutilizable
│   │   ├── ProtectedRoute/           # HOC de rutas protegidas
│   │   ├── SearchBar/                # Barra de búsqueda con debounce
│   │   └── Loader/                   # Componente de carga
│   └── pages/
│       ├── Home/                     # Landing con resumen del club
│       ├── Players/                  # Listado con filtros y búsqueda
│       ├── PlayerDetail/             # Detalle de jugador
│       ├── Matches/                  # Listado de partidos
│       ├── MatchDetail/              # Detalle de partido con goleadores
│       ├── News/                     # Noticias con categorías
│       ├── NewsDetail/               # Detalle de noticia
│       ├── Login/                    # Inicio de sesión
│       ├── Register/                 # Registro de usuario
│       ├── Profile/                  # Perfil con favoritos
│       ├── Admin/                    # Panel de administración
│       └── NotFound/                 # Página 404
├── index.html
├── vite.config.js
└── package.json
```

## 🗃️ Colecciones de la Base de Datos

### 1. Users (Usuarios)
- Registro/login con JWT y bcrypt
- Roles: `admin` y `user`
- Jugadores favoritos (relación con Players)
- Avatar opcional con Cloudinary

### 2. Players (Jugadores) — 105 registros
- Datos completos: nombre, posición, dorsal, nacionalidad, estadísticas
- Estados: `activo`, `retirado`, `cedido`
- Imagen opcional con Cloudinary
- **Referenciado por**: Matches (goleadores), Users (favoritos), News (relacionados)

### 3. Matches (Partidos) — 55 registros
- Liga, Copa del Rey, Champions League, Amistosos
- Goleadores con referencia a Players (ObjectId + minuto)
- Estadísticas: asistencia, árbitro, temporada
- **Relacionado con**: Players (scorers), News (relatedMatch)

### 4. News (Noticias) — 25 registros
- Categorías: fichajes, partidos, entrenamiento, comunidad, institucional
- **Relacionado con**: Players (relatedPlayers), Matches (relatedMatch)

## 🔒 Autenticación y Roles

| Función | Público | Usuario | Admin |
|---------|---------|---------|-------|
| Ver jugadores/partidos/noticias | ✅ | ✅ | ✅ |
| Registrarse/Login | ✅ | — | — |
| Añadir jugadores favoritos | ❌ | ✅ | ✅ |
| Ver perfil propio | ❌ | ✅ | ✅ |
| Panel de administración | ❌ | ❌ | ✅ |
| CRUD de contenido | ❌ | ❌ | ✅ |

## ⚛️ Hooks Avanzados Utilizados

- **useReducer**: Gestión del estado de autenticación complejo en `AuthContext`
- **useContext**: Compartir estado de auth entre componentes
- **useCallback**: Memoización de funciones en componentes de filtrado y búsqueda
- **useMemo**: Cálculos derivados (tasas de victoria, configuraciones de colores, formateo de fechas)
- **useRef**: Control de abort controllers y timers en `useFetch` y `useDebounce`
- **useEffect**: Efectos secundarios para fetch de datos, verificación de auth
- **Custom Hooks**: `useFetch`, `useDebounce`, `useLocalStorage`

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express** — Servidor API REST
- **MongoDB** + **Mongoose** — Base de datos y ODM
- **JWT** (jsonwebtoken) — Autenticación stateless
- **bcrypt** — Hash de contraseñas
- **Cloudinary** + **Multer** — Subida de imágenes
- **Morgan** — Logging de peticiones
- **CORS** — Cross-Origin Resource Sharing
- **dotenv** — Variables de entorno
- **fs** (Node.js nativo) — Lectura de CSVs para seeds

### Frontend
- **React 19** — UI Library
- **React Router DOM 7** — Routing SPA
- **Axios** — Cliente HTTP con interceptores
- **Vite** — Build tool y dev server
- **CSS puro** con variables CSS — Sin librería de estilos externa

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js v18+
- MongoDB Atlas o local
- (Opcional) Cuenta de Cloudinary

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/RockTheCode-ProyectoFinal.git
cd RockTheCode-ProyectoFinal
```

### 2. Configurar el Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de MongoDB y Cloudinary
```

### 3. Ejecutar el Seed (poblar la BBDD desde CSV)
```bash
npm run seed
```
Esto leerá los archivos CSV de `data/` y creará:
- 105 jugadores
- 55 partidos (con goleadores vinculados a jugadores)
- 25 noticias (con relaciones a jugadores y partidos)
- 2 usuarios de prueba (admin + user)

### 4. Arrancar el Backend
```bash
npm run dev
# El servidor arranca en http://localhost:3000
```

### 5. Configurar y arrancar el Frontend
```bash
cd ..  # Volver a la raíz
npm install
npm run dev
# El frontend arranca en http://localhost:5173
```

### Cuentas de prueba
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@cfsmalgrat.com | admin123 |
| Usuario | fan@cfsmalgrat.com | user123 |

## 📊 Datos Generados (CSV)

Los datos se generan a partir de archivos CSV ubicados en `backend/data/`:

- **players.csv**: 105 jugadores con nombre, apellido, posición, dorsal, nacionalidad, edad, altura, peso, goles, asistencias, tarjetas, partidos jugados, estado y biografía
- **matches.csv**: 55 partidos de Liga, Copa del Rey, Champions League y Amistosos con goleadores referenciados por nombre
- **news.csv**: 25 noticias categorizadas con referencias a jugadores y partidos

El script `seed.js` utiliza el módulo `fs` de Node.js para leer los CSV, parsearlos y crear las relaciones entre colecciones (ObjectId references) automáticamente.

## 🎨 Diseño UX/UI

- **Colores del club**: Azul (#1a3a6b) y Dorado (#d4af37)
- **Tipografía**: Inter (texto) + Montserrat (títulos)
- **Responsive**: Mobile-first con breakpoints en 480px, 768px y 1024px
- **Variables CSS**: Todas las propiedades de diseño centralizadas en `variables.css`
- **Componentes reutilizables**: Cards, SearchBar, Loader, Header, Footer
- **Animaciones**: Transiciones suaves, hover effects, loading spinner

## 📡 API Endpoints

### Users
- `POST /api/users/register` — Registro
- `POST /api/users/login` — Login
- `GET /api/users/profile` — Perfil (auth)
- `PUT /api/users/profile` — Actualizar perfil (auth)
- `PUT /api/users/favorites/:playerId` — Toggle favorito (auth)
- `GET /api/users` — Listar usuarios (admin)
- `DELETE /api/users/:id` — Eliminar usuario (admin)

### Players
- `GET /api/players` — Listar (filtros: position, status, search, sort, page)
- `GET /api/players/stats/top` — Top goleadores/asistentes
- `GET /api/players/:id` — Detalle
- `POST /api/players` — Crear (admin, multipart/form-data)
- `PUT /api/players/:id` — Actualizar (admin)
- `DELETE /api/players/:id` — Eliminar (admin)

### Matches
- `GET /api/matches` — Listar (filtros: competition, result, season, page)
- `GET /api/matches/stats/summary` — Resumen estadístico
- `GET /api/matches/:id` — Detalle con goleadores populados
- `POST /api/matches` — Crear (admin)
- `PUT /api/matches/:id` — Actualizar (admin)
- `DELETE /api/matches/:id` — Eliminar (admin)

### News
- `GET /api/news` — Listar (filtros: category, search, page)
- `GET /api/news/:id` — Detalle con jugadores y partido populados
- `POST /api/news` — Crear (admin, multipart/form-data)
- `PUT /api/news/:id` — Actualizar (admin)
- `DELETE /api/news/:id` — Eliminar (admin)

## 👤 Autor

Proyecto final del bootcamp **RockTheCode** — Desarrollo FullStack con Node.js y React.

---

*CFS Malgrat es un club ficticio creado con fines educativos. Todos los datos son inventados.*
