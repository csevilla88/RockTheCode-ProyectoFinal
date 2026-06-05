import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";
import apiRouter from "./src/routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes("*") || !origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

app.listen(PORT, () => {
  console.log(`🏟️  CFS Malgrat API corriendo en http://localhost:${PORT}`);
});
