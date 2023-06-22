import express from "express";
import {
    checkPassword,
    verifyPassword,
    readLink,
    createLink,
    updateLink,
    deleteLink,
} from "../controllers/linksController.js";
import { updloadFiles } from "../controllers/filesController.js";
import checkAuthSoft from "../middleware/checkAuthSoft.js";

const router = express.Router();

router.get("/:url", checkAuthSoft, checkPassword, readLink);
router.post("/", checkAuthSoft, updloadFiles, createLink);
router.post("/:url", checkAuthSoft, verifyPassword, readLink);
router.put("/:id", checkAuthSoft, updateLink);
router.delete("/:id", checkAuthSoft, deleteLink);

export default router;
