import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Award, 
  Star, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Check, 
  AlertTriangle,
  Calendar,
  Lock,
  Loader,
  ArrowLeft
} from 'lucide-react';

export const Profile = () => {
  const { user, validateAskaryCard, cancelAskarySubscription, sendVerificationCode, verifyCode, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // State elements
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Subscription sub-modes: 'link' (link existing card) or 'subscribe' (pay 50 DH/month)
  const [subMode, setSubMode] = useState('subscribe');
  
  // Link existing card fields
  const [cardNumber, setCardNumber] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');
  const [linking, setLinking] = useState(false);

  // Pay online fields (Step 1)
  const [paymentName, setPaymentName] = useState('');
  const [paymentCard, setPaymentCard] = useState('');
  const [paymentExpiry, setPaymentExpiry] = useState('');
  const [paymentCvv, setPaymentCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paying, setPaying] = useState(false);

  // Email validation step (Step 2)
  const [activationStep, setActivationStep] = useState(1); // 1 = Payment Info, 2 = Email Code Verification
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sentCode, setSentCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Cancellation states
  const [canceling, setCanceling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch orders from API
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/orders/user/${user.id}`);
        setOrders(response.data);
      } catch (err) {
        console.warn("API des commandes indisponible. Chargement d'un historique simulé.");
        
        // Mock fallback database for seamless offline capabilities
        const mockUserOrders = [
          {
            id: 65,
            createdAt: new Date().toISOString(),
            status: "EXPÉDIÉ",
            totalPrice: 1250.0,
            items: [
              {
                id: 101,
                productName: "Maillot officiel de competition - PRO",
                quantity: 2,
                price: 625.0,
                size: "L",
                customName: "AYMANE",
                customNumber: "10"
              }
            ]
          },
          {
            id: 61,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            status: "LIVRÉ",
            totalPrice: 230.0,
            items: [
              {
                id: 102,
                productName: "Polo officiel de sortie noir",
                quantity: 1,
                price: 230.0,
                size: "M",
                customName: "",
                customNumber: ""
              }
            ]
          }
        ];
        setOrders(mockUserOrders);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: 'white' }}>
        <div className="spinner">Chargement du profil...</div>
      </div>
    );
  }

  // Handle Askary Card Link
  const handleValidateCard = async (e) => {
    e.preventDefault();
    setLinkError('');
    setLinkSuccess('');

    if (!cardNumber.trim()) {
      setLinkError('Veuillez saisir votre numéro de carte.');
      return;
    }

    setLinking(true);
    try {
      await validateAskaryCard(cardNumber.trim());
      setLinkSuccess('Votre carte Askary a été associée avec succès ! Vous bénéficiez maintenant de 10% de réduction permanente.');
      setCardNumber('');
    } catch (err) {
      setLinkError(err.message || 'Numéro de carte invalide.');
    } finally {
      setLinking(false);
    }
  };

  // Step 1: Submit Online Subscription Payment (simulates transaction & generates code)
  const handleOnlineSubscribePayment = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!paymentName.trim() || !paymentCard.trim() || !paymentExpiry.trim() || !paymentCvv.trim()) {
      setPaymentError('Veuillez remplir toutes les informations bancaires.');
      return;
    }

    if (paymentCard.replace(/\s/g, '').length < 16) {
      setPaymentError('Numéro de carte bancaire invalide (doit contenir 16 chiffres).');
      return;
    }

    setPaying(true);
    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Auto-send the email verification code
      try {
        const data = await sendVerificationCode();
        if (data.sent) {
          setSentCode(null); // Real email sent
        } else {
          setSentCode(data.fallbackCode); // Simulation
        }
        setIsEmailCodeSent(true);
      } catch (err) {
        setVerificationError(err.message || "Échec de l'envoi du code. Vous pouvez réessayer.");
        setIsEmailCodeSent(false);
      }

      // Move to Step 2 (Verification code input)
      setActivationStep(2);
      setPaymentError('');
    } catch (err) {
      setPaymentError('Le paiement a échoué. Veuillez réessayer.');
    } finally {
      setPaying(false);
    }
  };

  // Step 2a: Send verification code to email (via backend API)
  const handleSendEmailVerificationCode = async () => {
    setSendingCode(true);
    setVerificationError('');
    try {
      const data = await sendVerificationCode();
      if (data.sent) {
        setSentCode(null); // Real email sent
      } else {
        setSentCode(data.fallbackCode); // Simulation
      }
      setIsEmailCodeSent(true);
    } catch (err) {
      setVerificationError(err.message || "Échec de l'envoi du code. Veuillez réessayer.");
    } finally {
      setSendingCode(false);
    }
  };

  // Step 2: Verify Activation Code Entered from Email
  const handleVerifyEmailCode = async (e) => {
    e.preventDefault();
    setVerificationError('');
    setVerificationSuccess('');

    if (!inputCode.trim()) {
      setVerificationError('Veuillez saisir le code d\'activation reçu par email.');
      return;
    }

    setVerifying(true);
    try {
      // Call backend API to verify the code and generate the final card
      const updatedUser = await verifyCode(inputCode.trim());

      setVerificationSuccess(`Abonnement activé ! Carte générée : ${updatedUser.askaryCardNumber}. Bienvenue chez les abonnés Askary !`);
      setPaymentName('');
      setPaymentCard('');
      setPaymentExpiry('');
      setPaymentCvv('');
      setSentCode('');
      setInputCode('');
      
      // Navigate back to normal view with card active (subscriber === true)
      setTimeout(() => {
        setActivationStep(1);
        setVerificationSuccess('');
      }, 4000);

    } catch (err) {
      setVerificationError(err.message || 'La validation du code a échoué. Veuillez réessayer.');
    } finally {
      setVerifying(false);
    }
  };

  // Handle Subscription Cancellation (Résilier)
  const handleCancelSubscription = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir résilier votre abonnement Askary ? Vous perdrez vos avantages (10% de réduction).")) {
      return;
    }

    setCanceling(true);
    setCancelMessage('');
    try {
      await cancelAskarySubscription();
      setCancelMessage('Abonnement résilié avec succès.');
    } catch (err) {
      setCancelMessage("Erreur lors de la résiliation. Veuillez réessayer.");
    } finally {
      setCanceling(false);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '-';
    const date = new Date(isoStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate next billing date (30 days from now)
  const getNextBillingDate = () => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    return nextMonth.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 1.5rem' }} className="animate-fade-in">
      
      {/* Page Title */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src="/AS_FAR_logo.png" 
          alt="ASFAR" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
        <h1 className="text-gradient-askary" style={{ fontSize: '32px', fontWeight: '900', fontFamily: "'Outfit', sans-serif", margin: 0 }}>
          MON ESPACE SUPPORTER
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
        alignItems: 'start'
      }} className="profile-grid">
        
        {/* Row 1: Profile Info Card + Askary Card activation side by side */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          
          {/* Card A: Account Detail */}
          <div className="glass-panel" style={{
            padding: '2rem',
            background: 'rgba(22, 28, 36, 0.55)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '0.75rem'
            }}>
              <UserIcon size={18} className="text-gradient" /> Vos Informations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
                  Nom complet
                </span>
                <span style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                  {user.username}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
                  Adresse Email
                </span>
                <span style={{ fontSize: '16px', fontWeight: '500', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} className="text-muted" /> {user.email}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
                    Type de Compte
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: user.role === 'ADMIN' ? 'var(--asfar-gold)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Shield size={13} /> {user.role === 'ADMIN' ? 'Administrateur' : 'Client Askary'}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '2px' }}>
                    Points Fidélité
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: 'var(--asfar-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={14} fill="currentColor" /> {user.fidelityPoints} points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Askary Subscription Status */}
          <div className="glass-panel" style={{
            padding: '2rem',
            background: 'rgba(22, 28, 36, 0.55)',
            border: '1px solid var(--border-glass)',
            borderRadius: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '0.75rem'
            }}>
              <CreditCard size={18} className="text-gradient" /> Carte d'Abonnement Askary
            </h3>

            {user.subscriber ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 107, 60, 0.15) 100%)',
                border: '1px solid var(--asfar-gold)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-gold-glow)'
              }}>
                <Award size={36} color="var(--asfar-gold)" style={{ marginBottom: '8px' }} />
                <h4 style={{ color: 'var(--asfar-gold)', fontWeight: '800', fontSize: '16px', margin: '0 0 4px 0' }}>
                  ABONNÉ ASKARY ACTIF
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
                  Remise de 10% active sur la boutique officielle.
                </p>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: '1px',
                  marginBottom: '1rem'
                }}>
                  N° {user.askaryCardNumber}
                </div>
                
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  Prochain prélèvement (50 DH/mois) : <strong style={{ color: 'white' }}>{getNextBillingDate()}</strong>
                </div>

                <button
                  onClick={handleCancelSubscription}
                  disabled={canceling}
                  className="btn btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    background: 'rgba(210, 20, 58, 0.15)',
                    border: '1px solid rgba(210, 20, 58, 0.3)',
                    color: '#f87171'
                  }}
                >
                  {canceling ? 'Résiliation...' : 'Résilier l\'abonnement'}
                </button>
                {cancelMessage && <div style={{ fontSize: '11px', color: '#f87171', marginTop: '6px' }}>{cancelMessage}</div>}
              </div>
            ) : (
              <div>
                
                {/* Subscription Sub-mode Toggle Header */}
                {activationStep === 1 && (
                  <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: '10px',
                    padding: '4px',
                    marginBottom: '1.25rem'
                  }}>
                    <button 
                      onClick={() => { setSubMode('subscribe'); setLinkError(''); setLinkSuccess(''); }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 0,
                        background: subMode === 'subscribe' ? 'var(--asfar-gold)' : 'transparent',
                        color: subMode === 'subscribe' ? 'black' : 'white',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      S'abonner (50 DH)
                    </button>
                    <button 
                      onClick={() => { setSubMode('link'); setPaymentError(''); setActivationStep(1); }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 0,
                        background: subMode === 'link' ? 'var(--asfar-gold)' : 'transparent',
                        color: subMode === 'link' ? 'black' : 'white',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Lier une carte
                    </button>
                  </div>
                )}

                {/* Sub Mode A: Subscribe and Pay 50 DH/month */}
                {subMode === 'subscribe' && (
                  <div>
                    
                    {/* STEP 1: Enter payment details */}
                    {activationStep === 1 && (
                      <div>
                        <div style={{
                          background: 'rgba(212, 175, 55, 0.04)',
                          border: '1px dashed rgba(212, 175, 55, 0.25)',
                          borderRadius: '10px',
                          padding: '0.75rem 1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>Abonnement Mensuel</span>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--asfar-gold)' }}>50 DH / mois</span>
                          </div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                            Inclus : 10% de réduction immédiate + 50 points fidélité bonus.
                          </span>
                        </div>

                        {paymentError && (
                          <div className="glass-panel" style={{
                            background: 'rgba(210, 20, 58, 0.12)',
                            border: '1px solid rgba(210, 20, 58, 0.25)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: '#f87171',
                            fontSize: '11px',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <AlertTriangle size={14} /> {paymentError}
                          </div>
                        )}

                        <form onSubmit={handleOnlineSubscribePayment} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <input
                            type="text"
                            placeholder="Nom du titulaire de la carte"
                            value={paymentName}
                            onChange={(e) => setPaymentName(e.target.value)}
                            className="form-input"
                            style={{ fontSize: '12px' }}
                            required
                          />

                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              placeholder="Numéro de carte bancaire (16 chiffres)"
                              value={paymentCard}
                              onChange={(e) => setPaymentCard(e.target.value.replace(/\D/g, '').slice(0, 16))}
                              className="form-input"
                              style={{ fontSize: '12px', paddingRight: '2.5rem' }}
                              required
                            />
                            <Lock size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)' }} />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="MM/AA"
                              value={paymentExpiry}
                              onChange={(e) => setPaymentExpiry(e.target.value.slice(0, 5))}
                              className="form-input"
                              style={{ fontSize: '12px', textAlign: 'center' }}
                              required
                            />
                            <input
                              type="password"
                              placeholder="CVV"
                              value={paymentCvv}
                              onChange={(e) => setPaymentCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                              className="form-input"
                              style={{ fontSize: '12px', textAlign: 'center' }}
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={paying}
                            style={{
                              width: '100%',
                              marginTop: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            {paying ? (
                              <>
                                <Loader className="spinner" size={14} /> Traitement sécurisé...
                              </>
                            ) : (
                              "S'abonner pour 50 DH / mois"
                            )}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* STEP 2: Email code verification */}
                    {activationStep === 2 && (
                      <div className="animate-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                          <button 
                            onClick={() => { setActivationStep(1); setVerificationError(''); }} 
                            style={{ background: 'none', border: 0, padding: 0, color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>Vérification de votre Email</span>
                        </div>

                        {verificationError && (
                          <div className="glass-panel" style={{
                            background: 'rgba(210, 20, 58, 0.12)',
                            border: '1px solid rgba(210, 20, 58, 0.25)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: '#f87171',
                            fontSize: '11px',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <AlertTriangle size={14} /> {verificationError}
                          </div>
                        )}

                        {verificationSuccess && (
                          <div className="glass-panel" style={{
                            background: 'rgba(0, 107, 60, 0.15)',
                            border: '1px solid rgba(0, 107, 60, 0.3)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            color: '#2ecc71',
                            fontSize: '11px',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Check size={14} /> {verificationSuccess}
                          </div>
                        )}

                        {!isEmailCodeSent ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                              Pour valider votre abonnement, veuillez d'abord vérifier votre adresse email enregistrée : <br />
                              <strong style={{ color: 'white' }}>{user.email}</strong>.
                            </p>
                            <button
                              type="button"
                              onClick={handleSendEmailVerificationCode}
                              disabled={sendingCode}
                              className="btn btn-primary"
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              {sendingCode ? (
                                <>
                                  <Loader className="spinner" size={14} /> Envoi du code...
                                </>
                              ) : (
                                "Recevoir le code de vérification par email"
                              )}
                            </button>
                          </div>
                        ) : (
                          <div className="animate-fade-in">
                            {/* Email notification panel */}
                            {isEmailCodeSent ? (
                              <div style={{
                                background: 'rgba(0, 107, 60, 0.06)',
                                border: '1px solid rgba(0, 107, 60, 0.3)',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                marginBottom: '1.25rem',
                                fontSize: '11px',
                                lineHeight: '1.4',
                                color: '#2ecc71'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '4px' }}>
                                  <Mail size={14} /> 📧 Code envoyé !
                                </div>
                                Veuillez consulter votre boîte de réception (et vos spams) à l'adresse <strong style={{ color: 'white' }}>{user.email}</strong>.
                              </div>
                            ) : (
                              <div style={{
                                background: 'rgba(212, 175, 55, 0.06)',
                                border: '1px solid rgba(212, 175, 55, 0.3)',
                                borderRadius: '10px',
                                padding: '0.75rem 1rem',
                                marginBottom: '1.25rem',
                                fontSize: '11px',
                                lineHeight: '1.4',
                                color: '#f39c12'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '4px' }}>
                                  <Mail size={14} /> 📧 [Simulation Email] Code d'abonnement
                                </div>
                                Un message contenant votre code a été "envoyé" à l'adresse <strong style={{ color: 'white' }}>{user.email}</strong>. Saisissez ce code pour valider votre statut :
                                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                                  Code de simulation : <strong style={{ fontSize: '13px', color: 'white', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{sentCode}</strong>
                                </div>
                              </div>
                            )}


                            <form onSubmit={handleVerifyEmailCode} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <input
                                type="text"
                                placeholder="E.g., ASK-SUB-12345"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                className="form-input"
                                style={{ fontSize: '13px', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '1px' }}
                                required
                              />
                              <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={verifying}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px'
                                }}
                              >
                                {verifying ? (
                                  <>
                                    <Loader className="spinner" size={14} /> Validation du code...
                                  </>
                                ) : (
                                  "Confirmer & Activer mon Abonnement"
                                )}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* Sub Mode B: Link existing Supporter Card */}
                {subMode === 'link' && (
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem' }}>
                      Vous disposez déjà d'une carte d'abonnement physique ? Saisissez son numéro de carte ci-dessous pour l'associer à votre compte boutique.
                    </p>

                    {linkError && (
                      <div className="glass-panel" style={{
                        background: 'rgba(210, 20, 58, 0.12)',
                        border: '1px solid rgba(210, 20, 58, 0.25)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: '#f87171',
                        fontSize: '11px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <AlertTriangle size={14} /> {linkError}
                      </div>
                    )}

                    {linkSuccess && (
                      <div className="glass-panel" style={{
                        background: 'rgba(0, 107, 60, 0.15)',
                        border: '1px solid rgba(0, 107, 60, 0.3)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        color: '#2ecc71',
                        fontSize: '11px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Check size={14} /> {linkSuccess}
                      </div>
                    )}

                    <form onSubmit={handleValidateCard} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="E.g., ASK-19580"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '13px', textTransform: 'uppercase' }}
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={linking}
                        style={{ padding: '0 1.25rem', fontSize: '13px', whiteSpace: 'nowrap' }}
                      >
                        {linking ? 'Liaison...' : 'Valider'}
                      </button>
                    </form>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                      Format attendu : ASK-XXXXX (ex. ASK-19580)
                    </span>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Row 2: Order History Panel */}
        <div className="glass-panel" style={{
          padding: '2rem',
          background: 'rgba(22, 28, 36, 0.55)',
          border: '1px solid var(--border-glass)',
          borderRadius: '20px',
          width: '100%'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '0.75rem'
          }}>
            <ShoppingBag size={18} className="text-gradient" /> Historique de vos Commandes
          </h3>

          {ordersLoading ? (
            <div style={{ color: 'var(--text-muted)', padding: '2rem 0', textAlign: 'center', fontSize: '13px' }}>
              Chargement de votre historique...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1.5rem', 
              background: 'rgba(0,0,0,0.15)', 
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.08)'
            }}>
              <ShoppingBag size={32} className="text-muted" style={{ marginBottom: '10px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '0 0 1rem 0' }}>
                Vous n'avez pas encore passé de commande sur notre boutique.
              </p>
              <Link to="/shop" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.5rem 1.25rem', fontSize: '13px', textDecoration: 'none' }}>
                Parcourir les Maillots
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 8px', width: '30px' }}></th>
                    <th style={{ padding: '12px 8px' }}>N° Commande</th>
                    <th style={{ padding: '12px 8px' }}>Date</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <React.Fragment key={order.id}>
                        <tr 
                          onClick={() => toggleOrder(order.id)}
                          style={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.05)', 
                            cursor: 'pointer',
                            background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                            transition: 'background 0.2s ease'
                          }}
                          className="table-row-hover"
                        >
                          <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </td>
                          <td style={{ padding: '16px 8px', fontWeight: 'bold', color: 'white' }}>
                            #{order.id}
                          </td>
                          <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Calendar size={13} className="text-muted" /> {formatDate(order.createdAt)}
                            </span>
                          </td>
                          <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: '800', color: 'white' }}>
                            {order.totalPrice.toFixed(2)} DH
                          </td>
                          <td style={{ padding: '16px 8px', textAlign: 'center' }}>
                            <span className={`badge ${
                              order.status === 'LIVRÉ' ? 'badge-green' : 
                              order.status === 'ANNULÉ' ? 'badge-red' : 'badge-gold'
                            }`} style={{ fontSize: '9px', padding: '2px 8px' }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>

                        {/* Collapsible Order Items Details Sub-Row */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="5" style={{ padding: '1rem', background: 'rgba(9, 11, 17, 0.45)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ paddingLeft: '1.5rem' }}>
                                <h4 style={{ color: 'var(--asfar-gold)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', marginTop: 0 }}>
                                  Articles de cette commande :
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                  {order.items && order.items.map((item, idx) => (
                                    <div 
                                      key={item.id || idx} 
                                      style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px'
                                      }}
                                    >
                                      <div>
                                        <div style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>
                                          {item.productName || (item.product ? item.product.name : 'Maillot ASFAR')}
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                                          <span>Taille : <strong style={{ color: 'white' }}>{item.size || 'Unique'}</strong></span>
                                          <span>Quantité : <strong style={{ color: 'white' }}>{item.quantity}</strong></span>
                                          {item.customName && (
                                            <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                                              👕 Flocage : {item.customName} / N° {item.customNumber}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div style={{ fontWeight: 'bold', color: 'white', fontSize: '13px' }}>
                                        {(item.price * item.quantity).toFixed(2)} DH
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
export default Profile;
