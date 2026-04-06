import React from 'react';
import './Features.css';

const FEATURES = [
  {
    icon: '🌿',
    title: 'All-Natural Ingredients',
    desc: 'Zero artificial preservatives, colours, or additives. Just real food, real flavour.',
  },
  {
    icon: '🏺',
    title: 'Authentic Heirloom Recipes',
    desc: 'Recipes passed down three generations — unchanged since our grandmother\'s kitchen.',
  },
  {
    icon: '🚚',
    title: 'Farm-to-Jar Freshness',
    desc: 'We partner with local farmers so produce goes from field to brine within 24 hours.',
  },
  {
    icon: '♻️',
    title: 'Eco-Friendly Packaging',
    desc: 'Glass jars, recycled cardboard, and compostable labels. Good for you & the planet.',
  },
  {
    icon: '🔬',
    title: 'Lab-Tested Quality',
    desc: 'Every batch passes rigorous microbial and quality checks before it ships.',
  },
  {
    icon: '💛',
    title: '30-Day Happiness Guarantee',
    desc: 'Don\'t love it? Full refund, no questions asked. We stand by every jar.',
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: '"The mango achaar is absolutely life-changing. I put it on literally everything. My family has ordered six jars in the past month — send help (but also more pickles)."',
    name: 'Priya S.',
    location: 'Mumbai, India',
    emoji: '👩',
  },
  {
    stars: 5,
    text: '"I\'ve tried dozens of brands but nothing comes close to Shivani Pickles. You can actually taste the quality. The dill cucumber is unreal — crispy, tangy, just perfect."',
    name: 'Rohan M.',
    location: 'Bangalore, India',
    emoji: '👨',
  },
  {
    stars: 5,
    text: '"Gifted a hamper to my parents and they won\'t stop talking about it. The garlic chili is dangerously addictive. Already planning the next order!"',
    name: 'Ananya T.',
    location: 'Delhi, India',
    emoji: '🧑',
  },
];

const Features = () => (
  <section className="features-section" id="features">
    <div className="section-header">
      <span className="section-eyebrow">🏆 Why Shivani Pickles</span>
      <h2 className="section-title">
        Quality You Can <span>Taste</span>
      </h2>
      <p className="section-sub">
        We obsess over every detail — from sourcing to sealing — so you get
        the best pickle experience, every single time.
      </p>
    </div>

    <div className="features-grid">
      {FEATURES.map((f, i) => (
        <div className="feature-card" key={i}>
          <span className="feature-card__icon">{f.icon}</span>
          <div className="feature-card__title">{f.title}</div>
          <p className="feature-card__desc">{f.desc}</p>
        </div>
      ))}
    </div>

    <div className="testimonials">
      <div className="section-header">
        <span className="section-eyebrow">💬 Customer Love</span>
        <h2 className="section-title">What Our <span>Fans</span> Say</h2>
      </div>

      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-card__stars">{'★'.repeat(t.stars)}</div>
            <p className="testimonial-card__text">{t.text}</p>
            <div className="testimonial-card__author">
              <div className="testimonial-card__avatar">{t.emoji}</div>
              <div>
                <div className="testimonial-card__name">{t.name}</div>
                <div className="testimonial-card__location">{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
