import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { listingsRouter } from "./routes/listings.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:5173";
// Vercel gera uma URL única com hash para cada deployment (ex: projeto-x9y8z-time.vercel.app),
// além do domínio de produção fixo — liberamos ambos para o mesmo projeto.
const vercelPreviewPattern = /^https:\/\/marketplace-campus[a-z0-9-]*\.vercel\.app$/;

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === allowedOrigin || vercelPreviewPattern.test(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Não permitido pelo CORS"));
    },
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/stats", statsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
