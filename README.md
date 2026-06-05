# CFS Malgrat — Portal del Club de Fútbol Sala

> Proyecto Final FullStack del bootcamp **RockTheCode** (Node.js + React + MongoDB).

Portal web para un club ficticio de fútbol sala. Permite consultar la plantilla, partidos y noticias, gestionar el perfil de usuario y administrar el contenido desde un panel de administración.

---

## 📁 Estructura del repositorio

```
RockTheCode-ProyectoFinal/
├── backend/            # API REST (Node.js + Express + MongoDB)
│   ├── README.md       # Documentación específica del backend
│   ├── .env.example
│   └── package.json
├── frontend/           # SPA (React 19 + Vite + React Router)
│   ├── README.md       # Documentación específica del frontend
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json        # Scripts raíz para arrancar todo a la vez
└── README.md           # (este archivo)
```

> Cada subproyecto tiene su propio `package.json`, su `.env` y su `README.md`.

---

## 🚀 Puesta en marcha (desarrollo local)

Requisitos:

- **Node.js 18+**
- **MongoDB Atlas** (recomendado) o MongoDB local
- (Opcional) cuenta de **Cloudinary** para subida de imágenes desde el panel admin

### 1. Clonar el repositorio

```powershell
git clone <url-del-repo>
cd RockTheCode-ProyectoFinal
```

### 2. Crear los archivos `.env`

`backend/.env`
```env
PORT=3000
MONGO_URI=<tu_cadena_mongodb_atlas>
JWT_SECRET=<clave-secreta-larga>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=http://localhost:5173
```

`frontend/.env`
```env
VITE_API_URL=http://localhost:3000/api
```

> Las variables de Cloudinary son opcionales: solo afectan a la subida de imágenes desde el panel admin.

### 3. Instalar dependencias

Desde la **raíz** del proyecto:

```powershell
npm run install:all
```

Esto instala dependencias en `backend/`, `frontend/` y el `concurrently` de la raíz.

### 4. Poblar la base de datos (solo la primera vez)

```powershell
npm run seed
```

Esto lee los CSV de `backend/data/` e inserta 97 jugadores, 56 partidos, 25 noticias y los 2 usuarios de prueba.

### 5. Arrancar la aplicación

```powershell
npm run dev
```

- Backend → http://localhost:3000
- Frontend → http://localhost:5173

> El comando ejecuta backend y frontend en paralelo usando `concurrently`. Pulsa `Ctrl+C` una vez para detener ambos.

---

## 📜 Scripts disponibles (raíz)

| Script                  | Descripción                                            |
| ----------------------- | ------------------------------------------------------ |
| `npm run install:all`   | Instala dependencias de backend y frontend             |
| `npm run seed`          | Pobla la base de datos desde los CSV (`backend/data/`) |
| `npm run dev`           | Arranca backend + frontend en paralelo                 |
| `npm run dev:backend`   | Solo backend (http://localhost:3000)                   |
| `npm run dev:frontend`  | Solo frontend (http://localhost:5173)                  |
| `npm run build`         | Build de producción del frontend (`frontend/dist`)     |

---

## 👥 Cuentas de prueba (tras `npm run seed`)

| Rol     | Email                  | Contraseña |
| ------- | ---------------------- | ---------- |
| Admin   | admin@cfsmalgrat.com   | admin123   |
| Usuario | fan@cfsmalgrat.com     | user123    |

---

## 🛠️ Stack tecnológico

- **Frontend**: React 19, React Router 7, Axios, Vite, CSS modular.
- **Backend**: Node.js, Express, MongoDB + Mongoose, JWT, Bcrypt, Cloudinary, Multer, Morgan, CORS.
- **Datos**: seeds desde CSV con `fs` nativo (`backend/data/`).
- **Autenticación**: JWT (`Authorization: Bearer <token>`) con roles `admin` / `user`.

---

## 🔒 Permisos por rol

| Acción                                  | Público | Usuario | Admin |
| --------------------------------------- | :-----: | :-----: | :---: |
| Ver jugadores / partidos / noticias     |   ✅    |   ✅    |  ✅   |
| Registro / Login                        |   ✅    |   —     |  —    |
| Marcar jugadores favoritos              |   ❌    |   ✅    |  ✅   |
| Ver / editar perfil propio              |   ❌    |   ✅    |  ✅   |
| Panel de administración                 |   ❌    |   ❌    |  ✅   |
| Cambiar rol de usuarios                 |   ❌    |   ❌    |  ✅   |
| Editar jugadores desde el panel admin   |   ❌    |   ❌    |  ✅   |
| CRUD de jugadores / partidos / noticias |   ❌    |   ❌    |  ✅   |

---

## 📚 Documentación específica

- Frontend: [frontend/README.md](./frontend/README.md)
- Backend: [backend/README.md](./backend/README.md)

---

## 👤 Autor

Cristian Sevilla — Proyecto final RockTheCode.


