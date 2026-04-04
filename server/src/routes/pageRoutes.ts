import express from "express";
import { getPageContent } from "../controllers/pageController";

const router = express.Router();

router.get("/:pageName", getPageContent);

export default router;
