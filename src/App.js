import React, { useState, useCallback } from 'react';
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

function HomePage({ onAddToCart, cartItems, toast, onDismissToast, cartOpen, onCartOpen, onCartClose, onIncrease, onDecrease, onRemove }) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="app">
      <Navbar cartCount={cartItems.length} onCartOpen={onCartOpen} />
      <SideNav cartCount={cartItems.length} onCartOpen={onCartOpen} />
      <Hero onShopNow={scrollToProducts} />
      <Products onAddToCart={onAddToCart} />
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
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen]   = useState(false);
  const [toast, setToast]         = useState(null);

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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
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
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
