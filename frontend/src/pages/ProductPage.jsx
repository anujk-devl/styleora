import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config";
import { useCart } from "../context/CartContext.jsx";


export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load product");
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="page">Loading product...</div>;
  if (error || !product) return <div className="page error">{error || "Not found"}</div>;

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="page product-page">
      <div className="product-page-image">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x400"}
          alt={product.name}
        />
      </div>
      <div className="product-page-info">
        <h1>{product.name}</h1>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">₹{product.price}</p>
        <p className="product-desc">{product.description}</p>

        <div className="product-actions">
          <label>
            Qty:
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
          </label>
          <button onClick={handleAdd} className="primary-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
