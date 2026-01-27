import  {Router}  from 'express';
import userController from "../controllers/userController.js"
import { validId, validUser } from '../middlewares/globalMiddlewares.js'
const router = Router();

router.post("/register", userController.create)
router.get("/", userController.findAll);
router.get("/:id", validId, validUser, userController.findById)
router.patch("/:id", validId, validUser, userController.update)

export default router;