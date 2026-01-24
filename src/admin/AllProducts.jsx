import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../api/admin.api";
import EditProductForm from "./EditProductForm";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track product being edited

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      if (!res.status && !res.success) throw new Error(res.message || "Failed to fetch products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productSlug, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await deleteProduct(productSlug);
      if (response.status || response.success) {
        // Refresh the products list
        await fetchProducts();
        alert("Product deleted successfully!");
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (err) {
      alert(err.message || "Error deleting product");
      console.error("Error deleting product:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-medium mt-10">
        ⚠️ {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No products found 😕
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
        <button
          onClick={() => setSelectedProduct(null)}
          className="mb-4 inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition"
        >
          ⬅ Back to All Products
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <EditProductForm
          productId={selectedProduct._id} // pass product ID
          onUpdate={fetchProducts} // refresh list after update
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
        <button
          onClick={fetchProducts}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.productType}</p>

              <div className="flex items-center justify-between mb-3">
                <p className="text-green-600 font-bold">₹{product.offerPrice}</p>
                <p className="text-gray-400 line-through text-sm">₹{product.actualPrice}</p>
              </div>

              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="text-sm text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.slug, product.name)}
                    className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
                <a
                  href={`/tours/${product.slug}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;
