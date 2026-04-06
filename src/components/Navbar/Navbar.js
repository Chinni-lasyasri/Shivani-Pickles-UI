import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartCount = 0, onCartOpen }) => {
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
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar__logo">
        <img src="/shivani_pickles_logo.png" alt="Shivani Pickles Logo" className="navbar__logo-img" />
        <div>
          <span className="navbar__logo-text">Shivani Pickles</span>
          <span className="navbar__logo-sub">Artisan Pickles</span>
        </div>
      </div>

      <ul className="navbar__links">
        <li><a href="#home">Home</a></li>
        <li><a href="#products">Shop</a></li>
        <li><a href="#features">Why Us</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      <div className="navbar__actions">
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
