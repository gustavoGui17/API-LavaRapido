import { Router } from "express";
import customerController from "../controllers/customerController.js";
import { validId, adminMiddleware } from "../middlewares/globalMiddlewares.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js";

const router = Router();

router.post("/register", authMiddleware, adminMiddleware, customerController.create);
router.get("/", authMiddleware, adminMiddleware, customerController.findAll);
router.get("/:id", authMiddleware, adminMiddleware, validId, customerController.findById);
router.patch("/:id", authMiddleware, adminMiddleware, validId, customerController.update);
router.delete("/:id", authMiddleware, adminMiddleware, validId, customerController.remove);

export default router;
