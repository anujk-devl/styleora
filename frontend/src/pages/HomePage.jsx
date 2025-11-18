import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";


export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load products");
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="page">Loading products...</div>;
  if (error) return <div className="page error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Luxury Wearables by Styleora</h1>
      <div className="product-grid">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="product-card"
          >
            <div className="product-image-wrapper">
              <img
                src={p.images?.[0] || "https://via.placeholder.com/300x300"}
                alt={p.name}
                className="product-image"
              />
            </div>
            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="product-brand">{p.brand}</p>
              <p className="product-price">₹{p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
