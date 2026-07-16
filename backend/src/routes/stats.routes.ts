import { Router } from "express";
import * as statsController from "../controllers/stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/", statsController.overview);
