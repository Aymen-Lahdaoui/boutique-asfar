import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ShieldCheck, Award, CreditCard, Sparkles, CheckCircle2, Ticket, AlertTriangle } from 'lucide-react';

export const Checkout = () => {
  const { cartItems, subTotal, discountAmount, shippingFee, totalPrice, clearCart } = useCart();
  const { user, validateAskaryCard, addLocalFidelityPoints } = useAuth();
  const navigate = useNavigate();

  // Forms states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Rabat');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Carte Askary validation state
  const [askaryInput, setAskaryInput] = useState('');
  const [askaryError, setAskaryError] = useState('');
  const [askarySuccess, setAskarySuccess] = useState('');

  // Status states
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);

  if (cartItems.length === 0 && !completed) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '3rem' }} className="glass-panel">
        <h2>Votre panier est vide</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Ajoutez des maillots ou accessoires avant de procéder au paiement.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>Découvrir la Boutique</Link>
      </div>
    );
  }

  // 1. Gérer la liaison de la Carte Askary depuis le Checkout
  const handleLinkAskary = async (e) => {
    e.preventDefault();
    setAskaryError('');
    setAskarySuccess('');

    if (!askaryInput.trim()) {
      setAskaryError("Veuillez saisir votre numéro d'abonné.");
      return;
    }

    try {
      await validateAskaryCard(askaryInput.trim());
      setAskarySuccess("🏆 Carte Askary liée avec succès ! Réduction de 10% appliquée.");
      setAskaryInput('');
    } catch (err) {
      setAskaryError(err.message || "Numéro de carte invalide.");
    }
  };

  // 2. Gérer la soumission de la commande
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg("Vous devez être connecté pour passer une commande.");
      return;
    }

    if (!address || !phone || !cardNumber || !cardExpiry || !cardCvc) {
      setErrorMsg("Veuillez remplir toutes les informations de livraison et de paiement.");
      return;
    }

    setProcessing(true);

    // Préparer l'objet d'entrée pour l'API Spring Boot
    const orderInput = {
      userId: user.id,
      shippingAddress: `${address}, ${city} (Tél: ${phone})`,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size,
        customName: item.customName || null,
        customNumber: item.customNumber || null
      }))
    };

    try {
      // Appeler le backend Spring Boot
      const response = await axios.post('http://localhost:8082/api/orders', orderInput);
      const savedOrder = response.data;
      
      // Stocker les points gagnés calculés par l'API (avec bonus x2 pour les VIP !)
      const isVip = user && user.role === 'SUBSCRIBER_VIP';
      const earned = Math.floor(savedOrder.totalPrice / 10) * (isVip ? 2 : 1);
      setPointsEarned(earned);
      
      // Vider le panier local et valider le succès
      clearCart();
      setCompleted(true);
    } catch (err) {
      console.warn("API de commande échouée ou serveur arrêté, tentative en mode autonome local...");

      // Validation stricte des stocks en local (simulation de l'API)
      const stockErrors = [];
      cartItems.forEach(item => {
        if (item.product.stockQuantity < item.quantity) {
          stockErrors.push(`Rupture de stock pour '${item.product.name}'. (Dispo : ${item.product.stockQuantity})`);
        }
      });

      if (stockErrors.length > 0) {
        setErrorMsg(stockErrors.join(' | '));
        setProcessing(false);
        return;
      }

      // Si le stock est suffisant en local, simuler l'achat (avec bonus x2 pour les VIP !)
      const isVip = user && user.role === 'SUBSCRIBER_VIP';
      const earned = Math.floor(totalPrice / 10) * (isVip ? 2 : 1);
      setPointsEarned(earned);
      addLocalFidelityPoints(earned); // Créditer les points fidélité sur le profil local

      clearCart();
      setCompleted(true);
    } finally {
      setProcessing(false);
    }
  };

  // Si la transaction est finalisée, afficher un écran de succès somptueux
  if (completed) {
    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '1rem' }} className="animate-fade-in">
        <div className="glass-panel" style={{
          padding: '3.5rem 2.5rem',
          borderRadius: '24px',
          textAlign: 'center',
          background: 'rgba(22, 28, 36, 0.6)',
          border: '2px solid rgba(0, 107, 60, 0.45)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <CheckCircle2 size={64} className="text-gradient" style={{ margin: '0 auto 1.5rem auto' }} />
          
          <h2 style={{ fontSize: '30px', fontWeight: '850', color: 'white', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
            Commande Validée !
          </h2>
          <p style={{ color: 'var(--asfar-gold)', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', marginTop: '4px', textTransform: 'uppercase' }}>
            Merci pour votre confiance, soldat Askary !
          </p>

          <div className="glass-panel" style={{
            margin: '2rem 0',
            padding: '1.25rem',
            background: 'rgba(0, 107, 60, 0.12)',
            border: '1px solid rgba(0, 107, 60, 0.25)',
            borderRadius: '16px',
            textAlign: 'left'
          }}>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🎖️ Récompense Fidélité
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
              Votre commande vous a permis de cumuler <strong style={{ color: 'var(--asfar-gold)' }}>+{pointsEarned} points de fidélité</strong> ! Ces points ont été ajoutés à votre compte et seront échangeables contre des remises exclusives ou des cadeaux collector de l'ASFAR.
            </p>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Un email de confirmation vous a été envoyé avec les détails de votre facture et les informations de suivi. Votre colis sera préparé par notre équipe logistique sous 24h.
          </p>

          <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '14px' }}>
            Retourner à la Boutique
          </button>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas encore connecté, le forcer à le faire
  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '3rem' }} className="glass-panel animate-fade-in">
        <AlertTriangle size={48} style={{ color: 'var(--asfar-gold)', margin: '0 auto 1rem auto' }} />
        <h2>Connexion requise pour le paiement</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 24px auto', fontSize: '13px', lineHeight: '1.5' }}>
          Afin de pouvoir finaliser votre commande, lier vos points de fidélité ou appliquer vos remises abonnés, veuillez vous connecter ou créer un compte.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Se connecter</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Créer un compte</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }} className="animate-fade-in">
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
          Finaliser ma <span className="text-gradient-askary">Commande</span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Veuillez remplir vos informations de livraison et simuler votre paiement pour valider l'achat.
        </p>
      </div>

      {/* Main Grid Checkout Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* LEFT COLUMN: Checkout Delivery Form & Payment Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Error Alert Box */}
          {errorMsg && (
            <div className="glass-panel" style={{
              background: 'rgba(210, 20, 58, 0.15)',
              border: '1px solid rgba(210, 20, 58, 0.35)',
              padding: '1rem',
              borderRadius: '12px',
              color: '#f87171',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form delivery details */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📍 1. Adresse de Livraison
            </h3>
            
            <div className="form-group">
              <label>ADRESSE DE LIVRAISON COMPLÈTE</label>
              <input 
                type="text" 
                placeholder="E.g., 12 Rue des Almohades, Secteur 4" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>VILLE</label>
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                  style={{ background: '#10141d', color: 'white' }}
                >
                  {['Rabat', 'Casablanca', 'Salé', 'Kénitra', 'Marrakech', 'Fès', 'Tanger', 'Agadir'].map(c => (
                    <option key={c} value={c} style={{ background: '#10141d', color: 'white' }}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>TÉLÉPHONE DU DESTINATAIRE</label>
                <input 
                  type="tel" 
                  placeholder="E.g., 0661234567" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form credit card payment details */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💳 2. Simulation de Paiement Sécurisé
            </h3>

            <div className="form-group">
              <label>NUMÉRO DE CARTE BANCAIRE</label>
              <input 
                type="text" 
                placeholder="4000 1234 5678 9010" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19))}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>DATE D'EXPIRATION</label>
                <input 
                  type="text" 
                  placeholder="MM/AA" 
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>CODE DE SÉCURITÉ (CVC)</label>
                <input 
                  type="password" 
                  placeholder="123" 
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.slice(0, 3))}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '11px', marginTop: '1rem' }}>
              <ShieldCheck size={14} className="text-gradient" />
              <span>Simulateur de passerelle bancaire chiffrée SSL • Aucun débit réel</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Receipt Cost Summary & Carte Askary Loyalty Linker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* LOYALTY CARD LINKER: If user has a Carte Askary, show it, otherwise give form */}
          <div className="glass-panel" style={{
            padding: '1.75rem',
            borderRadius: '20px',
            background: 'rgba(22, 28, 36, 0.45)',
            border: '1px solid rgba(212, 175, 55, 0.3)'
          }}>
            <h3 style={{ fontSize: '16px', color: 'var(--asfar-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🏆 Programme Carte Askary
            </h3>
            
            {user.subscriber ? (
              <div className="glass-panel" style={{
                background: 'rgba(0, 107, 60, 0.12)',
                border: '1px solid rgba(0, 107, 60, 0.25)',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles size={16} style={{ color: 'var(--asfar-gold)' }} />
                <div>
                  <strong>Abonné Validé !</strong> Votre carte <span style={{ color: 'var(--asfar-gold)', fontWeight: 'bold' }}>{user.askaryCardNumber}</span> vous fait bénéficier d'une réduction de <strong>10% sur tout le panier</strong>.
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
                  Vous avez une carte d'abonné de l'ASFAR ? Saisissez-la pour obtenir une réduction instantanée de 10% sur votre panier.
                </p>
                <form onSubmit={handleLinkAskary} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="E.g., ASK-19580" 
                    value={askaryInput}
                    onChange={(e) => setAskaryInput(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '12px', padding: '0.5rem 0.75rem' }}
                  />
                  <button type="submit" className="btn btn-accent" style={{ fontSize: '11px', padding: '0.5rem 1rem' }}>
                    Valider
                  </button>
                </form>

                {/* Sub-Card feedback */}
                {askaryError && (
                  <div style={{ color: '#f87171', fontSize: '10px', marginTop: '6px', fontWeight: '500' }}>
                    ⚠️ {askaryError}
                  </div>
                )}
                {askarySuccess && (
                  <div style={{ color: '#2ecc71', fontSize: '10px', marginTop: '6px', fontWeight: '600' }}>
                    🏆 {askarySuccess}
                  </div>
                )}

                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  💡 *Rappel : Vous pouvez utiliser la carte de test <span style={{ color: 'var(--asfar-gold)', fontWeight: 'bold' }}>ASK-19580</span> !
                </div>
              </div>
            )}
          </div>

          {/* RECEIPT SUMMARY CARD */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(13, 17, 23, 0.75)' }}>
            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '1.25rem' }}>
              Résumé du Panier
            </h3>

            {/* Scrolling list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '4px' }}>
              {cartItems.map((item) => (
                <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>{item.quantity}x</span>
                    <span style={{ color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {item.product.name}
                    </span>
                    <span className="badge badge-green" style={{ fontSize: '8px', padding: '1px 4px' }}>{item.size}</span>
                  </div>
                  <span style={{ color: 'white', fontWeight: '600' }}>{item.unitPrice * item.quantity} DH</span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1rem' }} />

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sous-total articles</span>
                <span style={{ color: 'white' }}>{subTotal} DH</span>
              </div>

              {user.subscriber && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--asfar-gold)', fontWeight: '500' }}>
                  <span>🏆 Réduction Carte Askary (10%)</span>
                  <span>-{discountAmount.toFixed(1)} DH</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Livraison</span>
                {shippingFee === 0 ? (
                  <span className="badge badge-green" style={{ fontSize: '9px', padding: '2px 6px' }}>Gratuit</span>
                ) : (
                  <span style={{ color: 'white' }}>{shippingFee} DH</span>
                )}
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700' }}>
                <span style={{ color: 'white' }}>Total Général</span>
                <span className="text-gradient" style={{ fontSize: '22px', fontFamily: "'Outfit', sans-serif" }}>
                  {totalPrice.toFixed(1)} DH
                </span>
              </div>
            </div>

            {/* Proceed order submission */}
            <form onSubmit={handleOrderSubmit}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '15px',
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <CreditCard size={16} /> 
                {processing ? 'Transaction en cours...' : `Payer ${totalPrice.toFixed(1)} DH`}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Checkout;
