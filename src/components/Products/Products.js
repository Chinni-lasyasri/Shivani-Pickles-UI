import React, { useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './Products.css';

const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Dill Cucumber Pickle',
    category: 'Cucumber',
    description: 'Crisp garden cucumbers brined low-and-slow with fresh dill, garlic cloves and whole black peppercorns.',
    price: 249,
    oldPrice: 299,
    image: '/product1.png',
    badge: 'bestseller',
    rating: 5,
    reviews: 412,
    tags: ['cucumber', 'mild'],
  },
  {
    id: 2,
    name: 'Spicy Mango Achaar',
    category: 'Mango',
    description: 'Raw Alphonso mangoes slow-cured in mustard oil with fenugreek, turmeric and a fiery red-chili masala.',
    price: 299,
    oldPrice: 349,
    image: '/product2.png',
    badge: 'hot',
    rating: 5,
    reviews: 287,
    tags: ['mango', 'spicy'],
  },
  {
    id: 3,
    name: 'Garlic Chili Fire Pickle',
    category: 'Chili',
    description: 'Whole red Jwala chilies packed with plump garlic in a rich aromatic oil — not for the faint-hearted.',
    price: 279,
    oldPrice: null,
    image: '/product3.png',
    badge: 'new',
    rating: 4,
    reviews: 98,
    tags: ['chili', 'spicy'],
  },
  {
    id: 4,
    name: 'Lemon Ginger Zest Pickle',
    category: 'Lemon',
    description: 'Sun-dried lemon slices mingled with julienned ginger in a tangy brine — brightens any meal.',
    price: 219,
    oldPrice: 259,
    image: '/product1.png',
    badge: null,
    rating: 4,
    reviews: 175,
    tags: ['lemon', 'mild'],
  },
  {
    id: 5,
    name: 'Mixed Vegetable Achaar',
    category: 'Mixed',
    description: 'A medley of carrot, cauliflower, turnip and green chili in a punchy mustard-seed oil masala.',
    price: 259,
    oldPrice: 319,
    image: '/product2.png',
    badge: 'bestseller',
    rating: 5,
    reviews: 321,
    tags: ['mixed', 'mild'],
  },
  {
    id: 6,
    name: 'Raw Amla Gooseberry Pickle',
    category: 'Amla',
    description: 'Indian gooseberries in a vitamin-C rich spiced brine. Tart, tangy and incredibly good for you.',
    price: 239,
    oldPrice: null,
    image: '/product3.png',
    badge: 'new',
    rating: 4,
    reviews: 64,
    tags: ['amla', 'mild'],
  },
  {
    id: 7,
    name: 'Raw ginger Pickle',
    category: 'ginger',
    description: 'Indian ginger in a vitamin-C rich spiced brine. Tart, tangy and incredibly good for you.',
    price: 350,
    oldPrice: 400,
    image: '/product3.png',
    badge: 'new',
    rating: 4.5,
    reviews: 64,
    tags: ['ginger', 'mild'],
  },
];

const FILTERS = ['All', 'Cucumber', 'Mango', 'Chili', 'Lemon', 'Mixed', 'Amla'];

const INITIAL_COUNT = 3;

const Products = ({ onAddToCart, onWishlist, wishlist, user }) => {
  const [active, setActive]   = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = active === 'All'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === active);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  const handleToggle = () => {
    if (showAll) {
      setShowAll(false);
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowAll(true);
    }
  };

  return (
    <section className="products-section" id="products">
      <div className="section-header">
        <span className="section-eyebrow">🥒 Our Collection</span>
        <h2 className="section-title">
          Handcrafted <span>Pickle</span> Perfection
        </h2>
        <p className="section-sub">
          Every batch is small-batch brined, taste-tested and sealed for maximum
          freshness — delivered straight to your door.
        </p>
        {user && user.role === 'admin' && (
          console.log('Admin user detected:', user),
          <button className="btn-add-product" onClick={() => setShowAddForm(true)}>
            Add New Product
          </button>
        )}
      </div>

      <div className="products-filter">
        {FILTERS.map(f => (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            className={`filter-btn ${active === f ? 'active' : ''}`}
            onClick={() => { setActive(f); setShowAll(false); }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="products-grid">

        {visible.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
            isWishlisted={wishlist.some(item => item.id === product.id)} 
          />
        ))}
      </div>

      {showAddForm && user && user.role === 'admin' && (
        <div className="add-product-form">
          <h3>Add New Product</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Product added! (Frontend only)'); setShowAddForm(false); }}>
            <input type="text" placeholder="Product Name" required />
            <input type="text" placeholder="Category" required />
            <textarea placeholder="Description" required></textarea>
            <input type="number" placeholder="Price" required />
            <input type="number" placeholder="Old Price (optional)" />
            <input type="text" placeholder="Image URL" required />
            <select>
              <option value="">Badge (optional)</option>
              <option value="bestseller">Bestseller</option>
              <option value="hot">Hot</option>
              <option value="new">New</option>
            </select>
            <input type="number" placeholder="Rating" min="1" max="5" required />
            <input type="number" placeholder="Reviews"/>
            <input type="text" placeholder="Tags (comma separated)" />
            <button type="submit">Add Product</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <div className="products-footer">
        {filtered.length > INITIAL_COUNT && (
          <button className="btn-load-more" onClick={handleToggle}>
            {showAll ? 'Show Less ↑' : `View Full Catalogue (${filtered.length - INITIAL_COUNT} more)`}
          </button>
        )}
      </div>
    </section>
  );
};

export default Products;
