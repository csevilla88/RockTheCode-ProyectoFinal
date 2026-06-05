# CFS Malgrat — Backend

API REST del portal **CFS Malgrat**. Gestiona usuarios, autenticación, jugadores, partidos y noticias.

---

## 🧱 Stack

- **Node.js** + **Express 4**
- **MongoDB** + **Mongoose 8** (MongoDB Atlas recomendado)
- **JWT** (`jsonwebtoken`) + **Bcrypt** para autenticación
- **Cloudinary** + **Multer** para subida de imágenes
- **Morgan** para logging y **CORS** configurable por entorno
- **Seed** desde CSV con `fs` nativo

---

## 📁 Estructura

```
backend/
├── data/                  # CSVs de semilla (players, matches, news)
├── index.js               # Entry point + middlewares globales
├── package.json
├── .env.example
└── src/
    ├── config/            # db.js, cloudinary.js
    ├── controllers/       # user, player, match, news
    ├── middlewares/       # auth (isAuth, isAdmin)
    ├── models/            # User, Player, Match, News
    ├── routes/            # index + rutas por recurso
    ├── seeds/seed.js      # script de poblado desde CSV
    └── utils/             # csvParser, jwt
```

---

## ⚙️ Variables de entorno

| Variable                  | Descripción                                                                 | Ejemplo                                  |
| ------------------------- | --------------------------------------------------------------------------- | ---------------------------------------- |
| `PORT`                    | Puerto del servidor                                                         | `3000`                                   |
| `MONGO_URI`               | Cadena de conexión a MongoDB                                                | `mongodb+srv://user:pass@cluster.../db`  |
| `JWT_SECRET`              | Clave secreta para firmar tokens                                            | `cadena-secreta-larga`                   |
| `CLOUDINARY_CLOUD_NAME`   | Nombre de la cuenta de Cloudinary (opcional)                                | `mi-cuenta`                              |
| `CLOUDINARY_API_KEY`      | API Key de Cloudinary (opcional)                                            | `123456789012345`                        |
| `CLOUDINARY_API_SECRET`   | API Secret de Cloudinary (opcional)                                         | `abcDEF...`                              |
| `CORS_ORIGIN`             | Orígenes permitidos separados por coma. `*` permite todos (solo desarrollo) | `http://localhost:5173`                  |

---

## 🚀 Scripts

Desde la carpeta `backend/`:

```powershell
npm install
npm run seed   # Pobla la BBDD desde data/*.csv (limpia y rellena las colecciones)
npm run dev    # Modo desarrollo con node --watch (recarga automática)
npm start      # Modo normal (sin watch)
```

> Se puede ejecutar todo desde la **raíz del repo** con `npm run dev` (arranca backend y frontend a la vez).

Tras `npm run seed` se crean 2 usuarios de prueba:

| Rol     | Email                | Contraseña |
| ------- | -------------------- | ---------- |
| admin   | admin@cfsmalgrat.com | admin123   |
| user    | fan@cfsmalgrat.com   | user123    |

---

## 🔐 Autenticación

Todos los endpoints protegidos esperan la cabecera:

```
Authorization: Bearer <token JWT>
```

Roles disponibles: `user` (por defecto) y `admin`. Algunos endpoints requieren rol admin.

Reglas de seguridad implementadas en cambio de rol:

- Un admin no puede quitarse su propio rol.
- No se permite dejar el sistema sin al menos un admin.

---

## 📡 Endpoints

Base URL: `http://localhost:3000/api`

### Health

| Método | Ruta      | Auth | Descripción              |
| ------ | --------- | ---- | ------------------------ |
| GET    | `/health` | —    | Comprobación de servicio |

### Usuarios (`/users`)

| Método | Ruta                    | Auth        | Descripción                                  |
| ------ | ----------------------- | ----------- | -------------------------------------------- |
| POST   | `/users/register`       | —           | Registro de usuario                          |
| POST   | `/users/login`          | —           | Inicio de sesión, devuelve JWT               |
| GET    | `/users/profile`        | Usuario     | Perfil del usuario autenticado               |
| PUT    | `/users/profile`        | Usuario     | Actualizar datos del propio perfil           |
| PUT    | `/users/favorites/:id`  | Usuario     | Añadir / quitar jugador favorito             |
| GET    | `/users`                | Admin       | Listar todos los usuarios                    |
| PATCH  | `/users/:id/role`       | Admin       | Cambiar rol de un usuario (`user` / `admin`) |
| DELETE | `/users/:id`            | Admin       | Eliminar usuario                             |

### Jugadores (`/players`)

| Método | Ruta                       | Auth   | Descripción                                                                  |
| ------ | -------------------------- | ------ | ---------------------------------------------------------------------------- |
| GET    | `/players`                 | —      | Listar con filtros: `position`, `status`, `search`, `sort`, `page`, `limit`  |
| GET    | `/players/stats/top`       | —      | Top goleadores, asistentes y más partidos                                    |
| GET    | `/players/:id`             | —      | Detalle de jugador                                                           |
| POST   | `/players`                 | Admin  | Crear jugador (multipart con campo `image`)                                  |
| PUT    | `/players/:id`             | Admin  | Actualizar jugador                                                           |
| DELETE | `/players/:id`             | Admin  | Eliminar jugador                                                             |

### Partidos (`/matches`)

| Método | Ruta                       | Auth   | Descripción                                                                  |
| ------ | -------------------------- | ------ | ---------------------------------------------------------------------------- |
| GET    | `/matches`                 | —      | Listar con filtros: `competition`, `result`, `season`, `homeAway`, `page`    |
| GET    | `/matches/stats/summary`   | —      | Resumen agregado (victorias, empates, derrotas, goles, asistencia media)     |
| GET    | `/matches/:id`             | —      | Detalle con goleadores populados                                             |
| POST   | `/matches`                 | Admin  | Crear partido                                                                |
| PUT    | `/matches/:id`             | Admin  | Actualizar partido                                                           |
| DELETE | `/matches/:id`             | Admin  | Eliminar partido                                                             |

### Noticias (`/news`)

| Método | Ruta            | Auth   | Descripción                                                       |
| ------ | --------------- | ------ | ----------------------------------------------------------------- |
| GET    | `/news`         | —      | Listar con filtros: `category`, `search`, `page`, `limit`         |
| GET    | `/news/:id`     | —      | Detalle con jugadores / partido relacionados                      |
| POST   | `/news`         | Admin  | Crear noticia (multipart con campo `image`)                       |
| PUT    | `/news/:id`     | Admin  | Actualizar noticia                                                |
| DELETE | `/news/:id`     | Admin  | Eliminar noticia                                                  |

---

## 🌱 Datos de seed

Los archivos CSV en `data/` se utilizan para rellenar la base de datos:

- `players.csv` — 97 jugadores
- `matches.csv` — 56 partidos (con referencia a goleadores por nombre)
- `news.csv`    — 25 noticias (con relaciones a jugadores y partidos)

El comando `npm run seed`:

1. Conecta a MongoDB usando `MONGO_URI`.
2. Limpia las colecciones existentes.
3. Inserta jugadores, partidos (resolviendo referencias por nombre) y noticias.
4. Crea los 2 usuarios de prueba (admin y user).

---

## 🧩 Modelos principales

- **User**: `username`, `email`, `password` (hash bcrypt), `role` (`user` | `admin`), `avatar`, `favoritePlayers` (refs a Player).
- **Player**: `name`, `lastName`, `position`, `number`, `nationality`, `age`, `height`, `weight`, `goals`, `assists`, `yellowCards`, `redCards`, `matchesPlayed`, `status` (`activo` | `retirado` | `cedido`), `image`, `bio`.
- **Match**: rival, fecha, competición, marcador, goleadores (refs a Player con minuto), temporada, asistencia, árbitro, local/visitante, resultado.
- **News**: título, contenido, resumen, autor, fecha, categoría, imagen, jugadores y partido relacionados.
