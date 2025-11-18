import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", requireAuth, createOrder);
router.get("/me", requireAuth, getMyOrders);

export default router;
