import { Router } from "express";

import {
  downloadFile,
  fileInfo,
  showFilePage,
} from "../controllers/view.controller.js";
import { shareRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.get("/meta/:uuid", shareRateLimiter, fileInfo);
router.get("/download/:uuid", shareRateLimiter, downloadFile);
router.get("/:uuid", shareRateLimiter, showFilePage);

export default router;
