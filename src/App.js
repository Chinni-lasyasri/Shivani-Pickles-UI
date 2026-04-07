import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import SideNav from './components/SideNav/SideNav';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import Features from './components/Features/Features';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import Toast from './components/Toast/Toast';
import CartDrawer from './components/CartDrawer/CartDrawer';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import WishlistDrawer from './components/WishlistDrawer/WishlistDrawer';
import InfoPage from './pages/InfoPage/InfoPage';

function HomePage({ onAddToCart, cartItems, wishlist = [], onToggleWishlist, onWishlistOpen, wishlistOpen, onWishlistClose, toast, onDismissToast, cartOpen, onCartOpen, onCartClose, onIncrease, onDecrease, onRemove }) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="app">
      <Navbar 
        cartCount={cartItems.length} 
        wishlistCount={wishlist.length}
        onCartOpen={onCartOpen} 
        onWishlistOpen={onWishlistOpen}
      />
      <SideNav 
        cartCount={cartItems.length} 
        onCartOpen={onCartOpen}
        wishlistCount={wishlist.length} 
        onWishlistOpen={onWishlistOpen} 
      />
      <Hero onShopNow={scrollToProducts} />
      <Products 
        onAddToCart={onAddToCart} 
        onWishlist={onToggleWishlist}
        wishlist={wishlist}  
      />
      <Features />
      <Newsletter />
      <Footer />
      {toast && <Toast message={toast} onClose={onDismissToast} />}
      <CartDrawer
        open={cartOpen}
        onClose={onCartClose}
        items={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />
      <WishlistDrawer 
        open={wishlistOpen}
        onClose={onWishlistClose}
        items={wishlist}
        onRemove={(id) => onToggleWishlist({id})} // Simple way to reuse toggle for removal
        onMoveToCart={(item) => onAddToCart(item)}
      />
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => [...prev, product]);
    setToast(`"${product.name}" added to cart!`);
  }, []);

  const handleIncrease = useCallback((id) => {
    setCartItems(prev => {
      const idx = prev.findLastIndex(i => i.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 0, prev[idx]); // duplicate one entry
      return copy;
    });
  }, []);

  const handleDecrease = useCallback((id) => {
    setCartItems(prev => {
      const idx = prev.findLastIndex(i => i.id === id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  }, []);

  const handleRemove = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const handleDismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Toggle logic: If it's in the wishlist, remove it. If not, add it.
  const handleToggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.filter(item => item.id !== product.id);
      return [...prev, product];
    });
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shivani_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load wishlist on initial start
  useEffect(() => {
    const saved = localStorage.getItem('shivani_wishlist');
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartItems={cartItems}
              wishlist={wishlist}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistOpen={wishlistOpen}
              onWishlistOpen={() => setWishlistOpen(true)}
              onWishlistClose={() => setWishlistOpen(false)}
              toast={toast}
              onDismissToast={handleDismissToast}
              cartOpen={cartOpen}
              onCartOpen={() => setCartOpen(true)}
              onCartClose={() => setCartOpen(false)}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/:slug" element={<InfoPage />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
