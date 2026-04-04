import express from "express";
import {
    banUser,
    createHomeGradient,
    deleteHomeGradient,
    deleteSupportMessage,
    deleteUser,
    getSupportMessages,
    getUserMessages,
    getUsers,
    updateHomeGradient,
    updateSupportStatus,
    updateUserRole,
    getPageContentAdmin,
    updatePageContent,
} from "../controllers/adminController";
import { authorize, protect } from "../middleware/authMiddleware";

const router = express.Router();

// Require protection and admin role for all routes in this file
router.use(protect);
router.use(authorize("admin"));

// User Management
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/ban", banUser);
router.get("/users/:email/messages", getUserMessages);

// Support Messages
router.get("/support", getSupportMessages);
router.put("/support/:id", updateSupportStatus);
router.delete("/support/:id", deleteSupportMessage);

// Home Gradient Management
router.post("/home-gradients", createHomeGradient);
router.put("/home-gradients/:id", updateHomeGradient);
router.delete("/home-gradients/:id", deleteHomeGradient);

// Page Content Management
router.get("/page-content/:pageName", getPageContentAdmin);
router.put("/page-content/:pageName", updatePageContent);

export default router;
