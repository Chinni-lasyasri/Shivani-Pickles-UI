import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Products from './components/Products/Products';
import Features from './components/Features/Features';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import Toast from './components/Toast/Toast';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function HomePage({ onAddToCart, cartItems, toast, onDismissToast }) {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="app">
      <Navbar cartCount={cartItems.length} />
      <Hero onShopNow={scrollToProducts} />
      <Products onAddToCart={onAddToCart} />
      <Features />
      <Newsletter />
      <Footer />
      {toast && <Toast message={toast} onClose={onDismissToast} />}
    </div>
  );
}

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  const handleAddToCart = useCallback((product) => {
    setCartItems(prev => [...prev, product]);
    setToast(`"${product.name}" added to cart!`);
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
