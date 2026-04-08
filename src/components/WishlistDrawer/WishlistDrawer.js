import React from 'react';
import './WishlistDrawer.css';

const WishlistDrawer = ({ open, onClose, items, onMoveToCart, onRemove }) => {
  return (
    <>
      <div className={`cart-overlay ${open ? 'cart-overlay--visible' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <span className="cart-drawer__icon">❤️</span>
            <h2>Your Wishlist</h2>
          </div>
          <button className="cart-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <p>Your wishlist is empty.</p>
              <button className="cart-drawer__shop-btn" onClick={onClose}>Explore Pickles</button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              
              {items.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item__img-wrap">
                      <img src={item.image} alt={item.name} className="cart-item__img" />
                    </div>
                            
                    <div className="cart-item__info">
                      <p className="cart-item__name">{item.name}</p>
                      <p className="cart-item__price">₹{item.price}</p>
                    </div>
                    
                    <div className="cart-item__controls">
                      <button 
                        className="wishlist-add-to-cart"
                        onClick={() => { onMoveToCart(item); onRemove(item.id); }}
                      >
                        + Cart
                      </button>
                      <button className="cart-item__remove" onClick={() => onRemove (item.id)}>🗑</button>
                    </div>
                  </li>
            ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default WishlistDrawer;