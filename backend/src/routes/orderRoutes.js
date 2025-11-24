import express from "express";
import authRequired from "../middleware/authMiddleware.js";
import { getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/me", authRequired, getMyOrders);

export default router;
