import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './SideNav.css';

const NAV_ITEMS = [
  { label: 'Home',    href: '#home',     icon: '🏠' },
  { label: 'Shop',    href: '#products', icon: '🛒' },
  { label: 'Why Us',  href: '#features', icon: '✨' },
  { label: 'About',   href: '#about',    icon: 'ℹ️' },
  { label: 'Contact', href: '#contact',  icon: '📞' },
];

const SideNav = ({ cartCount = 0, onCartOpen, wishlistCount = 0, onWishlistOpen }) => {
  const [open, setOpen]   = useState(false);
  const [user, setUser]   = useState(null);
  const [active, setActive] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  /* ── load user ── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  /* ── close on route change ── */
  useEffect(() => { setOpen(false); }, [location]);

  /* ── lock body scroll when drawer open ── */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* ── highlight active section on scroll ── */
  useEffect(() => {
    const sections = ['home', 'products', 'features', 'about', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOpen(false);
    navigate('/login');
  };

  const handleNavClick = (href) => {
    setOpen(false);
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ── Hamburger / Top-bar (mobile) ── */}
      <header className="sidenav-topbar">
        <button
          className={`sidenav-hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

        <div className="sidenav-topbar__brand">
          <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" className="sidenav-topbar__logo" />
          <span className="sidenav-topbar__name">Shivani Pickles</span>
        </div>

        <div className="sidenav-topbar__actions">

          <div className="sidenav-cart" onClick={onWishlistOpen} style={{marginRight: '12px'}}>
            ❤️ {wishlistCount > 0 && <span className="sidenav-cart__badge">{wishlistCount}</span>}
          </div>

          <div className="sidenav-cart" title="Cart" onClick={onCartOpen}>
            🛒
            {cartCount > 0 && <span className="sidenav-cart__badge">{cartCount}</span>}
          </div>
          {user && (
            <div className="sidenav-avatar" title={`${user.firstName} ${user.lastName}`}>
              {(user.firstName?.[0] || '').toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* ── Overlay ── */}
      <div
        className={`sidenav-overlay ${open ? 'visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* ── Side Drawer ── */}
      <aside className={`sidenav ${open ? 'sidenav--open' : ''}`} aria-label="Side navigation">

        {/* Brand */}
        <div className="sidenav__brand">
          <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" className="sidenav__logo" />
          <div>
            <span className="sidenav__brand-name">Shivani Pickles</span>
            <span className="sidenav__brand-sub">Artisan Pickles</span>
          </div>
        </div>

        <div className="sidenav__divider" />

        {/* Nav links */}
        <nav className="sidenav__nav">
          {NAV_ITEMS.map(item => {
            const sectionId = item.href.slice(1);
            const isActive  = active === sectionId;
            return (
              <button
                key={item.label}
                className={`sidenav__item ${isActive ? 'sidenav__item--active' : ''}`}
                onClick={() => handleNavClick(item.href)}
              >
                <span className="sidenav__icon">{item.icon}</span>
                <span className="sidenav__label">{item.label}</span>
                {isActive && <span className="sidenav__active-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidenav__spacer" />
        <div className="sidenav__divider" />

        {/* ── Bottom: Cart + Auth ── */}
        <div className="sidenav__bottom">
          <button className="sidenav__item" onClick={onCartOpen}>
            <span className="sidenav__icon">
              🛒
              {cartCount > 0 && <span className="sidenav-cart__badge">{cartCount}</span>}
            </span>
            <span className="sidenav__label">Cart {cartCount > 0 && `(${cartCount})`}</span>
          </button>

          {user ? (
            <div className="sidenav__user-section">
              <div className="sidenav__user-info">
                <div className="sidenav__avatar">
                  {(user.firstName?.[0] || '').toUpperCase()}
                </div>
                <div>
                  <p className="sidenav__user-name">{user.firstName} {user.lastName}</p>
                  <p className="sidenav__user-role">Member</p>
                </div>
              </div>
              <button className="sidenav__logout-btn" onClick={handleLogout}>
                <span>🚪</span> Logout
              </button>
            </div>
          ) : (
            <div className="sidenav__auth">
              <Link to="/login"    className="sidenav__auth-link sidenav__auth-link--outline" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/register" className="sidenav__auth-link sidenav__auth-link--primary"  onClick={() => setOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideNav;
