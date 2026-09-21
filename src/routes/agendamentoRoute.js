import { Router } from "express";
import agendamentoController from "../controllers/agendamentoController.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js";
import { validId } from "../middlewares/globalMiddlewares.js";

const router = Router();

router.post("/register", authMiddleware, agendamentoController.create);
router.get("/dashboard", authMiddleware, agendamentoController.dashboard);
router.get("/meus", authMiddleware, agendamentoController.meusAgendamentos);
router.get("/:id", authMiddleware, validId, agendamentoController.findById);
router.patch("/:id", authMiddleware, validId, agendamentoController.updateStatus);
router.patch("/:id/cancelar", authMiddleware, validId, agendamentoController.cancelar);

export default router;