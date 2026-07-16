import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.routes.js";
import { listingsRouter } from "./routes/listings.routes.js";
import { statsRouter } from "./routes/stats.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const app = express();

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/stats", statsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
