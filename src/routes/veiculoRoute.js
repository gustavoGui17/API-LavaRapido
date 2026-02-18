import express from 'express';
import { create, findAll, findById, topVeiculo, searchByPlaca, byUser, update, erase } from "../controllers/veiculoController.js";
import { validId, validVeiculo } from '../middlewares/globalMiddlewares.js'
import { authMiddleware } from '../middlewares/authMiddlerware.js'

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, findAll);
router.get("/top", topVeiculo);
router.get("/search", searchByPlaca);
router.get("/:id", validId, validVeiculo, findById);
router.get("/byUser", authMiddleware, byUser);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, erase);

export default router