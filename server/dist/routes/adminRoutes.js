"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Require protection and admin role for all routes in this file
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)("admin"));
// User Management
router.get("/users", adminController_1.getUsers);
router.delete("/users/:id", adminController_1.deleteUser);
router.put("/users/:id/role", adminController_1.updateUserRole);
router.put("/users/:id/ban", adminController_1.banUser);
router.get("/users/:email/messages", adminController_1.getUserMessages);
// Support Messages
router.get("/support", adminController_1.getSupportMessages);
router.put("/support/:id", adminController_1.updateSupportStatus);
router.delete("/support/:id", adminController_1.deleteSupportMessage);
// Home Gradient Management
router.post("/home-gradients", adminController_1.createHomeGradient);
router.put("/home-gradients/:id", adminController_1.updateHomeGradient);
router.delete("/home-gradients/:id", adminController_1.deleteHomeGradient);
exports.default = router;
