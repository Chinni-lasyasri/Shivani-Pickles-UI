import React from 'react';
import './Hero.css';

const Hero = ({ onShopNow }) => {
  return (
    <section className="hero" id="home">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/hero.png)` }}
      />
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__badge">
          <span>🌿</span> Hand-Crafted
        </div>
        <h1 className="hero__title">
          The Art of <span>Perfectly</span><br />Preserved Flavour
        </h1>
        <p className="hero__desc">
          From tangy dill cucumbers to fiery mango achaar — every jar is
          a labour of love, brined with heirloom recipes and the finest
          hand-picked ingredients.
        </p>
        <div className="hero__cta">
          <button className="btn-hero-primary" onClick={onShopNow}>
            Shop All Pickles →
          </button>
          <button className="btn-hero-secondary">
            Our Story
          </button>
        </div>
      </div>

      <div className="hero__stats">
        <div className="hero__stat-item">
          <span className="hero__stat-number">25+</span>
          <span className="hero__stat-label">Varieties</span>
        </div>
        <div className="hero__stat-item">
          <span className="hero__stat-number">98%</span>
          <span className="hero__stat-label">5-Star Reviews</span>
        </div>
        <div className="hero__stat-item">
          <span className="hero__stat-number">50k+</span>
          <span className="hero__stat-label">Happy Customers</span>
        </div>
        <div className="hero__stat-item">
          <span className="hero__stat-number">Zero</span>
          <span className="hero__stat-label">Preservatives</span>
        </div>
      </div>

      <div className="hero__scroll-indicator">Scroll ↓</div>
    </section>
  );
};

export default Hero;
