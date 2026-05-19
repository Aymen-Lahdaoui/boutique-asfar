import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Sparkles } from 'lucide-react';

export const SlidingCart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, subTotal, discountAmount, shippingFee, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      {/* Dark overlay backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'all 0.3s ease'
        }} 
      />

      {/* Sliding Drawer Body */}
      <div className="glass-panel" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        background: 'rgba(13, 17, 23, 0.92)',
        borderLeft: '1px solid var(--border-glass)',
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        borderRadius: '16px 0 0 16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 35px rgba(0,0,0,0.5)',
        animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} className="text-gradient" />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
              Mon Panier Askary
            </h2>
            <span className="badge badge-green" style={{ fontSize: '10px' }}>
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} articles
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Scrollable Item List */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <ShoppingBag size={48} style={{ opacity: 0.3 }} />
              <p style={{ fontSize: '14px' }}>Votre panier est vide pour le moment.</p>
              <button onClick={() => { onClose(); navigate('/shop'); }} className="btn btn-primary" style={{ fontSize: '12px', padding: '0.5rem 1rem' }}>
                Découvrir la Boutique
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.cartItemId} 
                style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-glass)',
                  padding: '10px',
                  borderRadius: '12px',
                  position: 'relative'
                }}
              >
                {/* Item Thumbnail */}
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  style={{
                    width: '70px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: 'black',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                />

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'white',
                      lineHeight: '1.3',
                      paddingRight: '20px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.product.name}
                    </h4>

                    {/* Size & Custom details */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      <span className="badge badge-green" style={{ fontSize: '8px', padding: '1px 4px' }}>
                        Taille : {item.size}
                      </span>
                      {item.customName && (
                        <span className="badge badge-gold" style={{ fontSize: '8px', padding: '1px 4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Sparkles size={8} /> Floqué {item.customName} #{item.customNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '8px'
                  }}>
                    {/* Quantity controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '6px',
                      padding: '2px'
                    }}>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '2px' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', width: '24px', textAlign: 'center', color: 'white' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '2px' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total Price for item */}
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'white' }}>
                      {item.unitPrice * item.quantity} DH
                    </div>
                  </div>
                </div>

                {/* Remove shortcut */}
                <button 
                  onClick={() => removeFromCart(item.cartItemId)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--asfar-red)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom Checkout Calculator */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(7, 8, 10, 0.9)'
          }}>
            {/* Price breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Sous-total</span>
                <span style={{ color: 'white', fontWeight: '500' }}>{subTotal} DH</span>
              </div>

              {/* Discount if Subscriber */}
              {user && user.subscriber && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--asfar-gold)', fontWeight: '500' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    🏆 Réduction Carte Askary (10%)
                  </span>
                  <span>-{discountAmount.toFixed(1)} DH</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>Frais de livraison</span>
                {shippingFee === 0 ? (
                  <span className="badge badge-green" style={{ fontSize: '9px', padding: '2px 6px' }}>Gratuit</span>
                ) : (
                  <span style={{ color: 'white', fontWeight: '500' }}>{shippingFee} DH</span>
                )}
              </div>

              {/* Threshold for free shipping */}
              {shippingFee > 0 && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '-2px' }}>
                  Ajoutez encore <span style={{ color: 'var(--asfar-green)', fontWeight: 'bold' }}>{800 - (subTotal - discountAmount)} DH</span> pour la livraison gratuite !
                </div>
              )}

              <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700' }}>
                <span style={{ color: 'white' }}>Total à payer</span>
                <span className="text-gradient" style={{ fontSize: '20px', fontFamily: "'Outfit', sans-serif" }}>
                  {totalPrice.toFixed(1)} DH
                </span>
              </div>
            </div>

            {/* CTA Checkout button */}
            <button 
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '15px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <CreditCard size={16} /> Procéder au paiement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SlidingCart;
