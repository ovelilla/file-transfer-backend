import express from "express";
import { downloadFiles, deleteFiles } from "../controllers/filesController.js";
import checkAuthSoft from "../middleware/checkAuthSoft.js";

const router = express.Router();

router.get("/:url", checkAuthSoft, downloadFiles, deleteFiles);

export default router;
