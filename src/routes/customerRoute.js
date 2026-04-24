import { Router } from "express";
import customerController from "../controllers/customerController.js";
import { validId } from "../middlewares/globalMiddlewares.js";

const router = Router();

router.post("/", customerController.create);
router.get("/", customerController.findAll);
router.get("/:id", validId, customerController.findById);
router.patch("/:id", validId, customerController.update);
router.delete("/:id", validId, customerController.remove);

export default router;