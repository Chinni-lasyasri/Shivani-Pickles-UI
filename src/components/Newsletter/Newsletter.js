import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section" id="contact">
      <div className="newsletter-card">
        <span className="newsletter-card__icon">🎁</span>
        <h2 className="newsletter-card__title">Get 20% Off Your First Order</h2>
        <p className="newsletter-card__sub">
          Subscribe to the Shivani Pickles journal for exclusive recipes, new launches,
          and a <strong>20% welcome discount</strong> — straight to your inbox.
        </p>

        {submitted ? (
          <div style={{ color: 'var(--clr-primary-light)', fontWeight: 600, fontSize: '1.1rem' }}>
            🎉 You're in! Check your inbox for your discount code.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              id="newsletter-email"
              type="email"
              className="newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="btn-subscribe" type="submit">
              Subscribe
            </button>
          </form>
        )}

        <p className="newsletter-card__note">
          No spam, ever. Unsubscribe anytime. 🔒 Your privacy is safe with us.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
