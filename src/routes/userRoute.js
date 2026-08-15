import  {Router}  from 'express';
import userController from "../controllers/userController.js"
import { validId, validUser, adminMiddleware, ownershipMiddleware } from '../middlewares/globalMiddlewares.js'
import { authMiddleware } from '../middlewares/authMiddlerware.js'
const router = Router();

router.post("/register", userController.create)
router.get("/", authMiddleware, adminMiddleware, userController.findAll);
router.get("/:id", authMiddleware, adminMiddleware, validId, validUser, userController.findById)
router.delete("/:id", authMiddleware, adminMiddleware, validId, validUser, userController.remove);
router.patch("/:id", authMiddleware, ownershipMiddleware, validId, validUser, userController.update)

export default router;