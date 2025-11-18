import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { API_URL } from "../config";


export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!items.length) {
    return (
      <div className="page">
        <h1>No items to checkout</h1>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to place an order.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
          })),
          totalAmount: total,
          shipping: form, 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");

      clearCart();
      setSuccess("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Details</h2>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />
          <input
            name="zip"
            placeholder="ZIP / Postal Code"
            value={form.zip}
            onChange={handleChange}
            required
          />

          <h3>Payment</h3>
          <p>For demo purposes, payment is simulated.</p>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Placing order..." : `Pay ₹${total} & Place Order`}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {items.map((i) => (
            <div key={i.product._id} className="summary-item">
              <span>
                {i.product.name} x {i.quantity}
              </span>
              <span>₹{i.product.price * i.quantity}</span>
            </div>
          ))}
          <hr />
          <div className="summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
