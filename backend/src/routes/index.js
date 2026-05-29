import { Router } from "express";
import userRouter from "./user.routes.js";
import playerRouter from "./player.routes.js";
import matchRouter from "./match.routes.js";
import newsRouter from "./news.routes.js";

const apiRouter = Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/players", playerRouter);
apiRouter.use("/matches", matchRouter);
apiRouter.use("/news", newsRouter);

// Ruta de health check
apiRouter.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "🏟️ CFS Malgrat API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
