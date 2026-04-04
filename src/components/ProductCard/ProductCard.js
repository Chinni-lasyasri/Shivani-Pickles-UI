import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  const badgeClass = {
    hot: 'product-card__badge--hot',
    new: 'product-card__badge--new',
    bestseller: 'product-card__badge--bestseller',
  };

  return (
    <div className="product-card">
      <div className="product-card__img-wrap">
        <img
          className="product-card__img"
          src={product.image}
          alt={product.name}
        />

        {product.badge && (
          <span className={`product-card__badge ${badgeClass[product.badge]}`}>
            {product.badge === 'hot' && '🌶 '}
            {product.badge === 'new' && '✨ '}
            {product.badge === 'bestseller' && '⭐ '}
            {product.badge}
          </span>
        )}

        <button
          className={`product-card__wishlist ${wishlisted ? 'active' : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
          title="Wishlist"
        >
          {wishlisted ? '❤️' : '🤍'}
        </button>

        <div className="product-card__quick-add">
          <button className="btn-quick-add" onClick={handleAdd}>
            {adding ? '✓ Added!' : '+ Quick Add'}
          </button>
        </div>
      </div>

      <div className="product-card__body">
        <div className="product-card__category">{product.category}</div>
        <div className="product-card__name">{product.name}</div>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__footer">
          <div>
            <div className="product-card__price">
              <span className="product-card__price-current">₹{product.price}</span>
              {product.oldPrice && (
                <span className="product-card__price-old">₹{product.oldPrice}</span>
              )}
            </div>
            <div className="product-card__stars">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
              <span>({product.reviews})</span>
            </div>
          </div>

          <button className="btn-add-cart" onClick={handleAdd} title="Add to cart">
            🛒
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
