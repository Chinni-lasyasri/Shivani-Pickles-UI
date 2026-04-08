import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  // Helper to scroll to top (useful for logo or Home links)
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__top">
        {/* Brand Column */}
        <div className="footer__brand-col">
          <Link to="/" onClick={scrollToTop} className="footer__brand-logo">
            <img src="/shivani_pickles_logo.png" alt="Shivani Pickles" className="footer__brand-img" />
            <div>
              <span className="footer__brand-name">Shivani Pickles</span>
              <span className="footer__brand-sub">Artisan Pickles</span>
            </div>
          </Link>
          <p className="footer__brand-desc">
            Handcrafted with heirloom recipes, the finest farm-fresh produce,
            and a whole lot of love since 1998. Pickling is our passion.
          </p>
          <div className="footer__social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">📸</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">👥</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube">▶️</a>
          </div>
        </div>

        {/* Shop Column */}
        <div>
          <div className="footer__col-title">Shop</div>
          <ul className="footer__col-links">
            <li><a href="#products">All Pickles</a></li>
            <li><a href="#products">Cucumber Range</a></li>
            <li><a href="#products">Mango Achaar</a></li>
            <li><a href="#products">Chili Pickles</a></li>
            <li><Link to="/hampers">Gift Hampers</Link></li>
            <li><Link to="/subscriptions">Subscriptions</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div>
          <div className="footer__col-title">Company</div>
          <ul className="footer__col-links">
            <li><Link to="/our-story">Our Story</Link></li>
            <li><a href="#features">Why Shivani Pickles</a></li>
            <li><Link to="/blog">Blog & Recipes</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/wholesale">Wholesale</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <div className="footer__col-title">Support</div>
          <ul className="footer__col-links">
            <li><Link to="/track-order">Track Order</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><Link to="/grievances">Grievances</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} Shivani Pickles Pvt. Ltd. All rights reserved.
        </p>
        <div className="footer__bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <div className="footer__badge">
          Made with <span>❤️</span> in India
        </div>
      </div>
    </footer>
  );
};

export default Footer;
