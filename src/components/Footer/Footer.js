import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__top">
      <div>
        <div className="footer__brand-logo">
          <img src="/shivani_pickles_logo.png" alt="Shivani Pickles Logo" className="footer__brand-img" />
          <div>
            <span className="footer__brand-name">Shivani Pickles</span>
            <span className="footer__brand-sub">Artisan Pickles</span>
          </div>
        </div>
        <p className="footer__brand-desc">
          Handcrafted with heirloom recipes, the finest farm-fresh produce,
          and a whole lot of love since 1998. Pickling is our passion.
        </p>
        <div className="footer__social">
          <a className="footer__social-link" href="/#" title="Instagram" rel="noreferrer">📸</a>
          <a className="footer__social-link" href="/#" title="Facebook" rel="noreferrer">👥</a>
          <a className="footer__social-link" href="/#" title="YouTube" rel="noreferrer">▶️</a>
          <a className="footer__social-link" href="/#" title="Twitter/X" rel="noreferrer">🐦</a>
        </div>
      </div>

      <div>
        <div className="footer__col-title">Shop</div>
        <ul className="footer__col-links">
          <li><a href="#products">All Pickles</a></li>
          <li><a href="#products">Cucumber Range</a></li>
          <li><a href="#products">Mango Achaar</a></li>
          <li><a href="#products">Chili Pickles</a></li>
          <li><a href="/#">Gift Hampers</a></li>
          <li><a href="/#">Subscriptions</a></li>
        </ul>
      </div>

      <div>
        <div className="footer__col-title">Company</div>
        <ul className="footer__col-links">
          <li><a href="#about">Our Story</a></li>
          <li><a href="#features">Why Shivani Pickles</a></li>
          <li><a href="/#">Blog &amp; Recipes</a></li>
          <li><a href="/#">Careers</a></li>
          <li><a href="/#">Press</a></li>
          <li><a href="/#">Wholesale</a></li>
        </ul>
      </div>

      <div>
        <div className="footer__col-title">Support</div>
        <ul className="footer__col-links">
          <li><a href="/#">Track Order</a></li>
          <li><a href="/#">Returns &amp; Refunds</a></li>
          <li><a href="/#">Shipping Info</a></li>
          <li><a href="/#">FAQ</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li><a href="/#">Grievances</a></li>
        </ul>
      </div>
    </div>

    <div className="footer__bottom">
      <p className="footer__copyright">
        © {new Date().getFullYear()} Shivani Pickles Pvt. Ltd. All rights reserved.
      </p>
      <div className="footer__bottom-links">
        <a href="/#">Privacy Policy</a>
        <a href="/#">Terms of Service</a>
        <a href="/#">Cookie Policy</a>
      </div>
      <div className="footer__badge">
        Made with <span>❤️</span> in India
      </div>
    </div>
  </footer>
);

export default Footer;
