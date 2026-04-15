import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartCount = 0, onCartOpen, wishlistCount = 0, onWishlistOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch { }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar__logo" style={{ textDecoration: 'none' }}>
        <img src="/shivani_pickles_logo.png" alt="Shivani Pickles Logo" className="navbar__logo-img" />
        <div>
          <span className="navbar__logo-text">Shivani Pickles</span>
          <span className="navbar__logo-sub">Artisan Pickles</span>
        </div>
      </Link>

      <ul className="navbar__links">
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Shop</a></li>
        <li><a href="#features">Why Us</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="navbar__actions">
        {/* User-specific navigation for bigger screens */}
        {user && (
          <div className="navbar__user-nav">
            <Link to="/orders" className="navbar__user-link" title="My Orders">
              📦 Orders
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="navbar__user-link navbar__user-link--admin" title="Admin Panel">
                ⚙️ Admin
              </Link>
            )}
          </div>
        )}

        <div className="navbar__wishlist" onClick={onWishlistOpen} style={{ cursor: 'pointer', marginRight: '1rem' }}>
          ❤️ {wishlistCount > 0 && <span className="navbar__cart-badge">{wishlistCount}</span>}
        </div>

        <div className="navbar__cart" title="Cart" onClick={onCartOpen} style={{ cursor: 'pointer' }}>
          🛒
          {cartCount > 0 && (
            <span className="navbar__cart-badge">{cartCount}</span>
          )}
        </div>
        {user ? (
          <div className="navbar__user">
            <div className="navbar__avatar" title={`${user.firstName} ${user.lastName}`}>
              {(user.firstName?.[0] || '').toUpperCase()}
            </div>
            <button className="btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar__auth-btns">
            <Link to="/login" className="btn-outline-sm">Sign In</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
