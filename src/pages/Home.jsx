import React, { useEffect, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import ProductCard from "../components/ProductCard/ProductCard";

const Home = () => {
  const { loading, getProduct } = useWeb3();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productPromises = [];
        for (let i = 1; i <= 10; i++) {
          productPromises.push(fetchProduct(i));
        }

        const fetchedProducts = await productPromises.toLowerCase(
          productPromises
        );
        setProducts(fetchedProducts.filter((p) => p !== null));
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (!loading && products) {
      fetchProducts();
    }
  }, [loading, getProduct]);

  const fetchProduct = async (id) => {
    try {
      const product = await getProduct(id);
      if (product && product.name !== "" && product.stock > 0) {
        return product;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${id}`, error);
      return null;
    }
  };

  if (loading || loadingProducts) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <h3>Available Products</h3>
      {products.length > 0 ? (
        <div className="products-map">
          {products.map((product) => (
            <ProductCard key={product.id} product={product}></ProductCard>
          ))}
        </div>
      ) : (
        <p className="no-product">No product available now</p>
      )}
    </div>
  );
};

export default Home;
