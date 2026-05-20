import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importation des Providers de contextes globaux
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { RespoShop } from './pages/RespoShop';

import { CardProdDashboard } from './pages/CardProdDashboard';

export const AppContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Rôles internes isolés
  const isRespoRole = user && ['RESPO', 'ADMIN_RESPO'].includes(user.role);
  const isCardProdRole = user && user.role === 'CARD_PROD';
  const isIsolatedRole = isRespoRole || isCardProdRole;

  return (
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
          <Route path="/" element={isCardProdRole ? <Navigate to="/card-production" replace /> : isRespoRole ? <Navigate to="/respo-shop" replace /> : <Home />} />
          <Route path="/shop" element={isIsolatedRole ? <Navigate to="/" replace /> : <Shop />} />
          <Route path="/product/:id" element={isIsolatedRole ? <Navigate to="/" replace /> : <ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={isIsolatedRole ? <Navigate to="/" replace /> : <Checkout />} />
          <Route path="/admin" element={isIsolatedRole ? <Navigate to="/" replace /> : <AdminDashboard />} />
          <Route path="/profile" element={isIsolatedRole ? <Navigate to="/" replace /> : <Profile />} />
          <Route path="/respo-shop" element={isRespoRole ? <RespoShop /> : <Navigate to="/" replace />} />
          <Route path="/card-production" element={isCardProdRole ? <CardProdDashboard /> : <Navigate to="/" replace />} />
          <Route path="/card-history" element={isCardProdRole ? <CardProdDashboard /> : <Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Dark Prestigious Footer */}
      <Footer />

    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};
export default App;
