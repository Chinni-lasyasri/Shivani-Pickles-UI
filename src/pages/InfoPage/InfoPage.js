import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InfoPage.css';

const PAGE_CONTENT = {
  'shipping': {
    title: 'Shipping Information',
    content: 'We ship across India. Standard delivery takes 3-5 business days. We use glass-safe eco-friendly packaging to ensure your jars arrive perfectly.',
    icon: '🚚'
  },
  'returns': {
    title: 'Returns & Refunds',
    content: 'Not happy with your pickle? We offer a 30-day happiness guarantee. If the seal is broken or the taste isn’t right, we will issue a full refund.',
    icon: '🔄'
  },
  'our-story': {
    title: 'Our Story',
    content: 'Started in Shivani’s kitchen in 1998, we have stayed true to grandmother’s recipes while sourcing fresh produce from local farmers.',
    icon: '🏺'
  },
  'faq': {
    title: 'Frequently Asked Questions',
    content: 'Q: Are your pickles preservative free? A: Yes, we use traditional oil and salt preservation methods. Q: Do you ship internationally? A: Currently, we only ship within India.',
    icon: '❓'
  }
};

const InfoPage = () => {
  const { slug } = useParams();
  const page = PAGE_CONTENT[slug] || { title: 'Page Not Found', content: 'Sorry, this page does not exist.' };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="info-page">
      <div className="info-page__header">
        <span className="info-page__icon">{page.icon}</span>
        <h1>{page.title}</h1>
      </div>
      <div className="info-page__content">
        <p>{page.content}</p>
      </div>
    </div>
  );
};

export default InfoPage;