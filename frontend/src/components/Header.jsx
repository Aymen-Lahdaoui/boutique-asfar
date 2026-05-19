import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogOut, ShieldAlert, Award, Star, User as UserIcon } from 'lucide-react';

export const Header = ({ onCartToggle }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      width: '100%',
      zIndex: 100,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      background: 'rgba(7, 8, 10, 0.75)',
      padding: '1rem 2rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Branding Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {/* ASFAR Logo */}
          <div style={{
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '3px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: 'var(--shadow-gold-glow)'
          }}>
            <img 
              src="/AS_FAR_logo.png" 
              alt="ASFAR Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                // If logo.png fails, show a text fallback
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span style={{
              display: 'none',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '900',
              color: 'white',
              fontSize: '15px'
            }}>FAR</span>
          </div>
          <div>
            <h1 className="text-gradient-askary" style={{
              fontSize: '22px',
              fontWeight: '800',
              letterSpacing: '1px',
              fontFamily: "'Outfit', sans-serif",
              margin: 0
            }}>
              ASFAR BOUTIQUE
            </h1>
            <span style={{
              fontSize: '9px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 'bold',
              display: 'block',
              marginTop: '-3px'
            }}>
              Boutique Militaire Officielle
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link to="/" className="nav-link" style={navLinkStyle}>Accueil</Link>
          <Link to="/shop" className="nav-link" style={navLinkStyle}>Boutique</Link>
          {user && user.role === 'ADMIN' && (
            <Link to="/admin" className="nav-link" style={{
              ...navLinkStyle,
              color: 'var(--asfar-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldAlert size={14} /> Back-Office
            </Link>
          )}
        </nav>

        {/* User Session Hub & Shopping Cart Trigger */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          {/* User Session State */}
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              {/* Profile Brief Info */}
              <div style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  justifyContent: 'flex-end'
                }}>
                  <UserIcon size={12} className="text-muted" />
                  {user.username}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '2px',
                  justifyContent: 'flex-end'
                }}>
                  {/* Subscriber Badge */}
                  {user.subscriber ? (
                    <span className="badge badge-gold" style={{ fontSize: '8px', padding: '1px 5px' }}>
                      Abonné Askary
                    </span>
                  ) : (
                    <span className="badge badge-green" style={{ fontSize: '8px', padding: '1px 5px', opacity: 0.7 }}>
                      Fan
                    </span>
                  )}
                  {/* Fidelity Points Badge */}
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--asfar-gold)',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <Star size={10} fill="currentColor" /> {user.fidelityPoints} pts
                  </span>
                </div>
              </div>

              {/* Log out Button */}
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary" 
                title="Se déconnecter"
                style={{ padding: '0.5rem', borderRadius: '8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '13px' }}>
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '13px' }}>
                S'inscrire
              </Link>
            </div>
          )}

          {/* Floating Cart Button - Only visible if logged in */}
          {user && (
            <button 
              onClick={onCartToggle}
              className="btn btn-primary"
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, var(--asfar-green), #00502c)',
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--asfar-red)',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '800',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-dark)',
                  boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                }}>
                  {totalCartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const navLinkStyle = {
  textDecoration: 'none',
  color: 'var(--text-secondary)',
  fontFamily: "'Outfit', sans-serif",
  fontWeight: '500',
  fontSize: '15px',
  transition: 'var(--transition-smooth)',
  cursor: 'pointer'
};

// Styling hover on nav-links
const activeNavLinkStyle = {
  color: 'var(--text-primary)',
};
