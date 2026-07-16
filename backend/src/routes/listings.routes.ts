import { Router } from "express";
import * as listingsController from "../controllers/listings.controller.js";
import { optionalAuth, requireAuth } from "../middleware/auth.middleware.js";

export const listingsRouter = Router();

listingsRouter.get("/categories", listingsController.categories);
listingsRouter.get("/", optionalAuth, listingsController.list);
listingsRouter.get("/:id", listingsController.getById);
listingsRouter.post("/", requireAuth, listingsController.create);
listingsRouter.delete("/:id", requireAuth, listingsController.remove);
