import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Award, AlertCircle, ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      position: 'relative',
      borderRadius: '16px'
    }}>
      {/* Visual Badges overlay on image */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {/* Personalizable (Flocage) tag */}
        {product.personalizable && (
          <span className="badge badge-gold" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
          }}>
            <Shirt size={10} /> Flocage Dispo
          </span>
        )}

        {/* Stock status tag */}
        {isOutOfStock ? (
          <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <AlertCircle size={10} /> Rupture
          </span>
        ) : isLowStock ? (
          <span className="badge badge-gold" style={{
            background: 'rgba(212, 175, 55, 0.2)',
            color: '#f39c12',
            border: '1px solid #f39c12',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            Plus que {product.stockQuantity} !
          </span>
        ) : (
          <span className="badge badge-green" style={{
            background: 'rgba(0, 107, 60, 0.15)',
            color: '#2ecc71',
            border: '1px solid #2ecc71'
          }}>
            En Stock
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '240px',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          style={{
            width: '90%',
            height: '90%',
            objectFit: 'contain',
            transition: 'transform 0.5s ease'
          }}
          className="product-img"
          // Smooth zoom effect on hover
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
        />
      </div>

      {/* Product Info Description */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        <span style={{
          fontSize: '11px',
          color: 'var(--asfar-gold)',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '4px',
          display: 'block'
        }}>
          {product.category}
        </span>
        
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'white',
          lineHeight: '1.4',
          marginBottom: '8px',
          height: '44px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.name}
        </h3>

        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: '1.5',
          marginBottom: '1rem',
          height: '36px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.description}
        </p>

        {/* Pricing & CTA Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div>
            <span style={{
              fontSize: '20px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '800',
              color: 'white'
            }}>
              {product.price}
            </span>
            <span style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginLeft: '2px',
              fontWeight: '600'
            }}>
              DH
            </span>
          </div>

          <Link 
            to={`/product/${product.id}`}
            className={`btn ${isOutOfStock ? 'btn-secondary' : product.personalizable ? 'btn-accent' : 'btn-primary'}`}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '13px',
              textDecoration: 'none',
              pointerEvents: isOutOfStock ? 'none' : 'auto',
              opacity: isOutOfStock ? 0.4 : 1
            }}
          >
            {isOutOfStock ? 'Indisponible' : product.personalizable ? 'Personnaliser' : 'Voir'}
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
