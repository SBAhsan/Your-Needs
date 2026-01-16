import React from "react";
import { useWeb3 } from "../../contexts/Web3Context";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { id, name, category, image, price, review, stock } = useWeb3();
  return (
    <div className="card-container">
      <div>
        <img src={image} alt={name} />
      </div>
      <div className="name-category">
        <p className="name">{name}</p>
        <p className="category">{category}</p>
      </div>
      <div className="price-review">
        <p className="price">{price}</p>
        <p className="review">{review}</p>
      </div>
      <div className="stock-view">
        <p className="stock">{stock > 0 ? `${stock} in stock` : "Out of stock"}</p>
        <Link to={`/product/${id}`} className="btn-view">View Details</Link>
      </div>
    </div>
  );
};

export default ProductCard;
