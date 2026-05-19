import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importation des Providers de contextes globaux
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Importation des Composants Globaux
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SlidingCart } from './components/SlidingCart';

// Importation des Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';

export const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* Main App Layout */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'var(--bg-dark)'
          }}>
            
            {/* Sticky Translucent Header */}
            <Header onCartToggle={() => setIsCartOpen(!isCartOpen)} />

            {/* Sliding Cart Sidebar Drawer */}
            <SlidingCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            {/* Main scrollable page mount area */}
            <main style={{
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>

            {/* Dark Prestigious Footer */}
            <Footer />

          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
export default App;
