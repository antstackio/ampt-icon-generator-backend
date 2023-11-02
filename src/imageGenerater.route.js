import { Router } from "express";
import imageGeneraterController from "./imageGenerater.controller";
import authMiddleware from "./middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware.auth, imageGeneraterController.generateImage);

export default router;
