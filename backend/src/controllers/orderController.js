import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    if (!items?.length) return res.status(400).json({ error: "Cart is empty" });
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      status: "paid"
    });
    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "items.product",
    "name price images"
  );
  res.json(orders);
};
