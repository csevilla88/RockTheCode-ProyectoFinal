# CFS Malgrat — Backend

API REST del portal **CFS Malgrat**. Gestiona usuarios, autenticación, jugadores, partidos y noticias, con subida de imágenes a Cloudinary.

---

## 🧱 Stack

- **Node.js 20** + **Express 4**
- **MongoDB** + **Mongoose 8** (MongoDB Atlas recomendado)
- **JWT** (`jsonwebtoken`) + **Bcrypt** para autenticación
- **Cloudinary 1.x** + **Multer** + `multer-storage-cloudinary 4.x` para imágenes
- **Morgan** para logging y **CORS** configurable por entorno
- **Seed** desde CSV con `fs` nativo

---

## 📁 Estructura

```
backend/
├── data/                      # CSVs de semilla (players, matches, news)
├── index.js                   # Entry point + middlewares globales
├── package.json
├── .env
└── src/
    ├── config/
    │   ├── db.js              # Conexión a MongoDB
    │   └── cloudinary.js      # SDK Cloudinary + storage Multer
    ├── controllers/           # user, player, match, news
    ├── middlewares/
    │   └── auth.js            # isAuth, isAdmin
    ├── models/                # User, Player, Match, News
    ├── routes/                # index + rutas por recurso
    ├── seeds/
    │   └── seed.js            # script de poblado desde CSV
    └── utils/
        ├── csvParser.js
        └── jwt.js
```

---

## ⚙️ Variables de entorno

| Variable                  | Descripción                                                                  | Ejemplo                                                       |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `PORT`                    | Puerto del servidor (Render lo sobreescribe en producción)                   | `3000`                                                        |
| `MONGO_URI`               | Cadena de conexión a MongoDB (incluye el **nombre de la BBDD** en la ruta)   | `mongodb+srv://user:pass@cluster.../cfs-malgrat?retryWrites=true&w=majority` |
| `JWT_SECRET`              | Clave secreta para firmar tokens                                             | `cadena-aleatoria-larga`                                      |
| `CLOUDINARY_CLOUD_NAME`   | Nombre de la cuenta de Cloudinary (opcional)                                 | `mi-cuenta`                                                   |
| `CLOUDINARY_API_KEY`      | API Key de Cloudinary (opcional)                                             | `123456789012345`                                             |
| `CLOUDINARY_API_SECRET`   | API Secret de Cloudinary (opcional)                                          | `abcDEF...`                                                   |
| `CORS_ORIGIN`             | Orígenes permitidos separados por coma. `*` permite todos (solo desarrollo). | `http://localhost:5173,https://rock-the-code-proyecto-final.vercel.app` |

---

## 🚀 Scripts

Desde la carpeta `backend/`:

```powershell
npm install
npm run seed   # Pobla la BBDD desde data/*.csv (limpia y rellena las colecciones)
npm run dev    # Modo desarrollo con node --watch (recarga automática)
npm start      # Modo normal (sin watch)
```

> También puedes ejecutar todo desde la **raíz del repo** con `npm run dev`
> (arranca backend y frontend en paralelo).

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

Roles disponibles: `user` (por defecto) y `admin`. Hay endpoints que requieren rol admin.

Reglas de seguridad implementadas:

- En `register` y `login` el password se hashea con **bcrypt**.
- El JWT se firma con `JWT_SECRET` y se devuelve junto con el usuario.
- Un admin **no puede quitarse su propio rol**.
- **No se permite dejar el sistema sin al menos un admin**.

---

## 📡 Endpoints

Base URL local: `http://localhost:3000/api`
Base URL producción: `https://cfs-malgrat-api.onrender.com/api`

### Health

| Método | Ruta      | Auth | Descripción              |
| ------ | --------- | ---- | ------------------------ |
| GET    | `/health` | —    | Comprobación de servicio |

### Usuarios (`/users`)

| Método | Ruta                      | Auth    | Descripción                                  |
| ------ | ------------------------- | ------- | -------------------------------------------- |
| POST   | `/users/register`         | —       | Registro de usuario                          |
| POST   | `/users/login`            | —       | Inicio de sesión, devuelve JWT               |
| GET    | `/users/profile`          | Usuario | Perfil del usuario autenticado (con favoritos poblados) |
| PUT    | `/users/profile`          | Usuario | Actualizar datos del propio perfil           |
| PUT    | `/users/favorites/:id`    | Usuario | Añadir / quitar jugador favorito (toggle)    |
| GET    | `/users`                  | Admin   | Listar todos los usuarios                    |
| PATCH  | `/users/:id/role`         | Admin   | Cambiar rol de un usuario (`user` / `admin`) |
| DELETE | `/users/:id`              | Admin   | Eliminar usuario                             |

### Jugadores (`/players`)

| Método | Ruta                  | Auth   | Descripción                                                                  |
| ------ | --------------------- | ------ | ---------------------------------------------------------------------------- |
| GET    | `/players`            | —      | Listar con filtros: `position`, `status`, `search`, `sort`, `page`, `limit`  |
| GET    | `/players/stats/top`  | —      | Top goleadores, asistentes y más partidos                                    |
| GET    | `/players/:id`        | —      | Detalle de jugador                                                           |
| POST   | `/players`            | Admin  | Crear jugador               |
| PUT    | `/players/:id`        | Admin  | Actualizar jugador. Usa `findById + save()` para disparar hooks.      |
| DELETE | `/players/:id`        | Admin  | Eliminar jugador (también borra su imagen de Cloudinary)                     |

### Partidos (`/matches`)

| Método | Ruta                       | Auth   | Descripción                                                                  |
| ------ | -------------------------- | ------ | ---------------------------------------------------------------------------- |
| GET    | `/matches`                 | —      | Listar con filtros: `competition`, `result`, `season`, `homeAway`, `page`    |
| GET    | `/matches/stats/summary`   | —      | Resumen (victorias, empates, derrotas, goles, asistencia media)     |
| GET    | `/matches/:id`             | —      | Detalle con goleadores populados                                             |
| POST   | `/matches`                 | Admin  | Crear partido                                                                |
| PUT    | `/matches/:id`             | Admin  | Actualizar partido                                                           |
| DELETE | `/matches/:id`             | Admin  | Eliminar partido                                                             |

### Noticias (`/news`)

| Método | Ruta            | Auth   | Descripción                                                       |
| ------ | --------------- | ------ | ----------------------------------------------------------------- |
| GET    | `/news`         | —      | Listar con filtros: `category`, `search`, `page`, `limit`         |
| GET    | `/news/:id`     | —      | Detalle con jugadores / partido relacionados                      |
| POST   | `/news`         | Admin  | Crear noticia (`multipart/form-data` con campo `image`)           |
| PUT    | `/news/:id`     | Admin  | Actualizar noticia                                                |
| DELETE | `/news/:id`     | Admin  | Eliminar noticia                                                  |

---

## 🌱 Datos de seed

Los archivos CSV en [data/](./data/) se utilizan para rellenar la base de datos:

- `players.csv` — jugadores (con bio, posición, estadísticas...)
- `matches.csv` — partidos (con goleadores referenciados por nombre)
- `news.csv`    — noticias (con relaciones a jugadores y partidos)

El comando `npm run seed`:

1. Conecta a MongoDB usando `MONGO_URI`.
2. **Limpia** las colecciones existentes.
3. Inserta jugadores, partidos (resolviendo referencias por nombre) y noticias.
4. Crea los 2 usuarios de prueba (admin y user).

---

## 🧩 Modelos principales

### User
`username`, `email`, `password` (hash bcrypt), `role` (`user` | `admin`), `avatar`,
`favoritePlayers` (refs a `Player`).
- `toJSON` elimina `password` y `__v`.

### Player
`name`, `lastName`, `position` (`Portero` | `Defensa` | `Centrocampista` | `Delantero`),
`number`, `nationality`, **`birthDate`** (opcional), `age`, `height`, `weight`,
`goals`, `assists`, `yellowCards`, `redCards`, `matchesPlayed`,
`status` (`activo` | `retirado` | `cedido`), `image` (Cloudinary URL), `bio`.

> 🪄 **Cálculo automático de edad**: el modelo tiene hooks `pre("save")` y
> `pre("findOneAndUpdate")` que recalculan `age` cuando llega `birthDate`.
> En el `updatePlayer` se usa `findById` + `Object.assign` + `save()` para
> garantizar que el hook siempre se dispara.

### Match
`opponent`, `date`, `competition`, `stadium`, `homeAway` (`local` | `visitante`),
`goalsFor`, `goalsAgainst`, `result` (`victoria` | `empate` | `derrota`),
`scorers` (array de `{ player, minute }`), `attendance`, `referee`, `season`.

### News
`title`, `content`, `summary`, `category` (`fichajes` | `partidos` | `entrenamiento` | `comunidad` | `institucional`),
`date`, `author`, `image`, `relatedPlayers` (refs), `relatedMatch` (ref).




