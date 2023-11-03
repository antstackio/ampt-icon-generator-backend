import { Router } from "express";
import bookmarkImageController from "../controller/bookmarkImage.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware.auth, bookmarkImageController.bookmarkImage);

router.get(
  "/",
  authMiddleware.auth,
  bookmarkImageController.getBookmarkedImageList
);

router.delete(
  "/:imageId",
  authMiddleware.auth,
  bookmarkImageController.deleteBookmarkedImage
);

export default router;
