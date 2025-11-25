import express from "express";
import authRequired from "../middleware/authMiddleware.js";
import { getMyOrders, createOrderOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/me", authRequired, getMyOrders);
router.post("/", authRequired, createOrder); 

export default router;
