import React, { useState, useEffect } from 'react';
import './CartDrawer.css';
import CheckoutModal from '../CheckoutModal/CheckoutModal';

const CartDrawer = ({ open, onClose, items, onIncrease, onDecrease, onRemove, onClearCart }) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  /* lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* group items by id and count quantities */
  const grouped = items.reduce((acc, item) => {
    const existing = acc.find(i => i.id === item.id);
    if (existing) { existing.qty += 1; }
    else { acc.push({ ...item, qty: 1 }); }
    return acc;
  }, []);

  const total = grouped.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.length;

  const handleOrderPlaced = () => {
    setCheckoutOpen(false);
    onClose();
    onClearCart?.();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${open ? 'cart-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`} aria-label="Shopping cart">

        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <span className="cart-drawer__icon">🛒</span>
            <h2>Your Cart</h2>
            {count > 0 && <span className="cart-drawer__count">{count}</span>}
          </div>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-drawer__divider" />

        {/* Body */}
        <div className="cart-drawer__body">
          {grouped.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">🫙</div>
              <p className="cart-drawer__empty-text">Your cart is empty</p>
              <p className="cart-drawer__empty-sub">Add some delicious pickles to get started!</p>
              <button className="cart-drawer__shop-btn" onClick={onClose}>Browse Products</button>
            </div>
          ) : (
            <ul className="cart-drawer__list">
              {grouped.map(item => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__img-wrap">
                    <img src={item.image} alt={item.name} className="cart-item__img" />
                  </div>

                  <div className="cart-item__info">
                    <p className="cart-item__category">{item.category}</p>
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">₹{item.price} × {item.qty}</p>
                  </div>

                  <div className="cart-item__controls">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => onDecrease(item.id)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="cart-item__qty-val">{item.qty}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => onIncrease(item.id)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <p className="cart-item__subtotal">₹{item.price * item.qty}</p>
                    <button
                      className="cart-item__remove"
                      onClick={() => onRemove(item.id)}
                      aria-label="Remove item"
                      title="Remove"
                    >🗑</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only when items exist */}
        {grouped.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__divider" />

            <div className="cart-drawer__summary">
              <div className="cart-drawer__row">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="cart-drawer__row cart-drawer__row--shipping">
                <span>Shipping</span>
                <span className="cart-drawer__free">FREE</span>
              </div>
              <div className="cart-drawer__divider" />
              <div className="cart-drawer__row cart-drawer__row--total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              className="cart-drawer__checkout-btn"
              onClick={() => setCheckoutOpen(true)}
            >
              Proceed to Checkout →
            </button>
            <button className="cart-drawer__continue-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={items}
        onOrderPlaced={handleOrderPlaced}
      />
    </>
  );
};

export default CartDrawer;

