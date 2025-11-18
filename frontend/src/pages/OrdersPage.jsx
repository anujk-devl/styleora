import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_URL } from "../config";


export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load orders");
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="page">
        <h1>Please login to view your orders.</h1>
      </div>
    );
  }

  if (loading) return <div className="page">Loading orders...</div>;
  if (error) return <div className="page error">{error}</div>;

  if (!orders.length) {
    return (
      <div className="page">
        <h1>No orders yet</h1>
      </div>
    );
  }

  return (
    <div className="page orders-page">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span>Order #{order._id.slice(-6)}</span>
              <span>Status: {order.status}</span>
              <span>
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <span>
                    {item.product?.name || "Product"} x {item.quantity}
                  </span>
                  <span>₹{(item.product?.price || 0) * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              Total: ₹{order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
