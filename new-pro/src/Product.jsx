import React, { useState, useEffect } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");   

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/product");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    try {
      const response = await axios.post("http://localhost:5000/product", formData);
      setProducts([...products, response.data]);
      setFormData({ name: "", price: "" });
    } catch (err) {
      setError("Error adding product.");
    }
  };

  const updateProduct = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/product/${editingId}`, formData);
      setProducts(
        products.map((product) => (product._id === editingId ? response.data : product))
      );
      setFormData({ name: "", price: "" });
      setEditingId(null);
    } catch (err) {
      setError("Error updating product.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/product/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      setError("Error deleting product.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingId ? updateProduct() : addProduct();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Product Manager</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Product Price"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value >= 0) {
                  setFormData({ ...formData, price: value });
                }
              }}
              required
            />
            <button type="submit">{editingId ? "Update Product" : "Add Product"}</button>
          </form>

          {products.length === 0 ? (
            <p>No products available. Add a new product!</p>
          ) : (
            <ul>
              {products.map((product) => (
                <li key={product._id}>
                  <strong>{product.name}</strong> - ${product.price}
                  <button
                    onClick={() => {
                      setFormData({ name: product.name, price: product.price });
                      setEditingId(product._id);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(product._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Product;
