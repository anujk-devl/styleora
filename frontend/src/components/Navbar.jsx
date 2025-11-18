import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx"; 

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Styleora
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/orders" className="nav-link">
          Orders
        </Link>

        <Link to="/cart" className="nav-link">
          Cart ({cartCount})
        </Link>

        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
