import { Router } from "express";
import veiculoClienteController from "../controllers/veiculoClienteController.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { validId } from "../middlewares/globalMiddlewares.js";

const router = Router();

router.post("/register", authMiddleware, veiculoClienteController.create);
router.get("/", authMiddleware, veiculoClienteController.findAll);
router.get("/:id", authMiddleware, validId, veiculoClienteController.findById);
router.patch("/:id", authMiddleware, validId, veiculoClienteController.update);
router.delete("/:id", authMiddleware, validId, veiculoClienteController.remove);

export default router;