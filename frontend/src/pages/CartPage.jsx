import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";


export default function CartPage() {
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="page">
        <h1>Your cart is empty</h1>
        <Link to="/" className="primary-btn">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {items.map((item) => (
          <div key={item.product._id} className="cart-item">
            <img
              src={item.product.images?.[0] || "https://via.placeholder.com/80"}
              alt={item.product.name}
              className="cart-image"
            />
            <div className="cart-info">
              <h3>{item.product.name}</h3>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.product.price}</p>
              <p>Subtotal: ₹{item.product.price * item.quantity}</p>
            </div>
            <button
              className="secondary-btn"
              onClick={() => removeFromCart(item.product._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Total: ₹{total}</h2>
        <button
          className="primary-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
