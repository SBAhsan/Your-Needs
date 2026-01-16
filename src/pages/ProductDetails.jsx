import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, simpleBuy, account, loading, contract } = useWeb3();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [purchasing, setPurchasing] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (!loading && getProduct) {
      fetchProduct();
    }
  }, [getProduct, id, loading]);

  const handlePurchaseProduct = async () => {
    if (!account) {
      alert("No account found. Please connect your wallet.");
    }

    if (product.stock <= 0) {
      alert("This product is out of stock");
    }

    try {
      setPurchasing(true);
      setSuccess("");
      const result = await simpleBuy(product.id);

      if (result.success) {
        setSuccess("Purchase successful! Check your orders");

        const updatedProduct = await getProduct(id);
        setProduct(updatedProduct);
      } else {
        alert("Purchase failed");
      }
    } catch (error) {
      console.error("Error during purchase", error);
    }
  };

  if (loading || loadingProduct) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <div className="product-details-img">
        <img src={product.image} alt="" />
      </div>
      <div className="product-details-info">
        <h2>{product.name}</h2>
        <p>{product.category}</p>
        <div className="product-ratings">
          <span>⭐{product.review}</span>
        </div>
      </div>
      <button
        className="purchase-btn"
        onClick={handlePurchaseProduct}
        disabled={purchasing || product.stock <= 0}
      >
        {product.stock > 0 ? "Processing..." : "Purchase Now"}
      </button>
      <button className="back-to-home" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default ProductDetails;
