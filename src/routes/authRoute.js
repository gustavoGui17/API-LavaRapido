import { Router } from "express";
const router = Router();
import { login, me, logout } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddlerware.js";

router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);

export default router;