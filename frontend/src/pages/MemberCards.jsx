import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Check, CreditCard, User, Phone, Mail, ShieldAlert, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

const CARD_TIERS = [
  {
    type: 'bronze',
    name: 'Askary Bronze',
    price: 150,
    gradient: 'linear-gradient(135deg, #a87c53 0%, #6e4726 50%, #43250e 100%)',
    textColor: '#f5d6c6',
    accentColor: '#a87c53',
    benefits: [
      "Priorité de réservation sur la billetterie officielle (24h avant)",
      "5% de réduction permanente sur la Boutique Officielle",
      "Accès aux actualités réservées aux membres",
      "Participation aux votes mineurs du club"
    ],
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500' // Placeholder/Avatar
  },
  {
    type: 'silver',
    name: 'Askary Silver',
    price: 350,
    gradient: 'linear-gradient(135deg, #e0e0e0 0%, #9a9a9a 50%, #5c5c5c 100%)',
    textColor: '#ffffff',
    accentColor: '#9a9a9a',
    benefits: [
      "Priorité de réservation billetterie (48h avant) + 5% de réduction billetterie",
      "10% de réduction permanente sur la Boutique Officielle",
      "1 invitation gratuite pour un match à domicile de votre choix",
      "Accès au forum officiel d'échanges des fans",
      "Participation aux votes officiels du club"
    ],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
  },
  {
    type: 'gold',
    name: 'Askary Gold',
    price: 600,
    gradient: 'linear-gradient(135deg, #ffeaa7 0%, #d4af37 50%, #8c7323 100%)',
    textColor: '#fff3cd',
    accentColor: '#d4af37',
    benefits: [
      "Accès prioritaire billetterie VIP (72h avant) + 10% réduction billets",
      "15% de réduction permanente sur la Boutique Officielle",
      "2 invitations gratuites en tribune d'honneur par saison",
      "Écharpe officielle Askary Gold offerte lors de la souscription",
      "Accès privilégié aux séances d'entraînement ouvertes du club",
      "Invitation aux assemblées annuelles des supporters"
    ],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500'
  },
  {
    type: 'vip',
    name: 'Askary VIP Platinum',
    price: 1500,
    gradient: 'linear-gradient(135deg, #2d3436 0%, #1e272e 50%, #050505 100%)',
    textColor: '#ffd700',
    accentColor: '#ffd700',
    border: '2px solid rgba(212,175,55,0.4)',
    benefits: [
      "Accès coupe-file VIP aux matchs à domicile",
      "20% de réduction permanente sur la Boutique Officielle",
      "Maillot officiel de la saison floqué et écharpe Premium offerts",
      "Rencontre exclusive avec les joueurs (Meet & Greet) 1 fois par an",
      "Accès VIP Lounge lors des grands matchs",
      "Canal de communication direct avec la direction des relations publiques"
    ],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500'
  }
];

export const MemberCards = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [selectedTier, setSelectedTier] = useState(null);
  const [fullName, setFullName] = useState(user ? user.username : '');
  const [cin, setCin] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user && user.email ? user.email : '');
  const [submitted, setSubmitted] = useState(false);

  const handleOpenForm = (tier) => {
    setSelectedTier(tier);
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !cin.trim() || !phone.trim() || !email.trim()) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Créer le produit virtuel correspondant à la carte membre
    const virtualProduct = {
      id: `card-${selectedTier.type}`,
      name: `Carte Membre ${selectedTier.name}`,
      price: selectedTier.price,
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500', // Image de carte générique premium
      isCard: true,
      description: `Carte d'abonnement annuelle officielle ${selectedTier.name}`
    };

    // Ajouter au panier global avec le nom de l'abonné dans le champ customName
    addToCart(virtualProduct, 1, 'Unique', `${fullName.toUpperCase()} (CIN: ${cin.toUpperCase()})`);
    
    setSubmitted(true);
    // Reset du formulaire
    setTimeout(() => {
      setSelectedTier(null);
      setSubmitted(false);
      setCin('');
      setPhone('');
    }, 2500);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '3rem 2rem',
      color: 'white',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Header Info */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span className="badge badge-gold" style={{ letterSpacing: '2px', fontSize: '10px', padding: '4px 12px', textTransform: 'uppercase' }}>
          Campagne d'Abonnement Officielle 2026
        </span>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '900',
          marginTop: '1rem',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, white, var(--asfar-gold))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          DEVENIR MEMBRE ASKARY
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '15px', lineHeight: '1.6' }}>
          Choisissez votre niveau d'engagement, commandez votre carte nominative officielle et bénéficiez d'avantages uniques au stade et sur la boutique en ligne.
        </p>
      </div>

      {/* Grid of Tiers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {CARD_TIERS.map(tier => (
          <div 
            key={tier.type}
            className="glass-panel"
            style={{
              background: 'rgba(17, 22, 31, 0.6)',
              border: tier.type === 'vip' ? '2px solid var(--asfar-gold)' : '1px solid var(--border-glass)',
              borderRadius: '24px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: tier.type === 'vip' ? '0 10px 30px rgba(212,175,55,0.15)' : 'none',
              transition: 'transform 0.3s ease, border-color 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.borderColor = 'var(--asfar-gold)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = tier.type === 'vip' ? 'var(--asfar-gold)' : 'var(--border-glass)';
            }}
          >
            {tier.type === 'vip' && (
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--asfar-gold)',
                color: 'black',
                fontSize: '9px',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '8px',
                textTransform: 'uppercase'
              }}>
                PREMIUM VIP
              </span>
            )}

            <div>
              {/* Premium Live Card Artwork Render */}
              <div style={{
                height: '160px',
                background: tier.gradient,
                border: tier.border || 'none',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: tier.textColor,
                position: 'relative',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '10px', letterSpacing: '1px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 'bold' }}>
                      ASFAR CLUB
                    </span>
                    <h3 style={{ fontSize: '14px', fontWeight: '900', margin: 0, letterSpacing: '0.5px' }}>
                      {tier.name.toUpperCase()}
                    </h3>
                  </div>
                  {/* Smart chip vector */}
                  <div style={{
                    width: '32px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #f1c40f, #f39c12)',
                    borderRadius: '4px',
                    position: 'relative',
                    border: '1.5px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.15)' }} />
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.15)' }} />
                  </div>
                </div>

                {/* Card Code Overlay */}
                <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.8 }}>
                  FAR - 2026 - {tier.type === 'vip' ? '8888' : tier.type === 'gold' ? '7777' : tier.type === 'silver' ? '5555' : '3333'} - {user ? user.username.slice(0, 3).toUpperCase() : 'GST'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                    <div style={{ fontSize: '8px', opacity: 0.6 }}>Titulaire</div>
                    <div style={{ fontWeight: 'bold' }}>{user ? user.username : 'Membres Officiel'}</div>
                  </div>
                  {/* Glowing ASFAR Logo Mark */}
                  <img src="/AS_FAR_logo.png" alt="" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                </div>
              </div>

              {/* Price Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', color: 'white' }}>{tier.price} DH</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}> / an</span>
              </div>

              {/* Benefits list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                {tier.benefits.map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '12px', lineHeight: '1.4' }}>
                    <Check size={14} style={{ color: 'var(--asfar-green)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe button */}
            <button
              onClick={() => handleOpenForm(tier)}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '13px',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: selectedTier?.type === tier.type ? 'var(--asfar-green)' : 'rgba(255,255,255,0.05)',
                border: selectedTier?.type === tier.type ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: selectedTier?.type === tier.type ? 'white' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              Choisir cette carte
            </button>
          </div>
        ))}
      </div>

      {/* Subscription Form Glass Panel */}
      {selectedTier && (
        <div 
          className="glass-panel"
          style={{
            background: 'rgba(13, 18, 26, 0.85)',
            border: '1px solid var(--asfar-gold)',
            borderRadius: '24px',
            padding: '2.5rem',
            maxWidth: '850px',
            margin: '0 auto',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2.5rem',
            animation: 'fadeIn 0.3s ease forwards'
          }}
        >
          {/* Card Customization Preview Column */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.08)', paddingRight: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--asfar-gold)', marginBottom: '1.5rem', textAlign: 'center' }}>
              Aperçu en Temps Réel de votre Carte
            </h3>
            
            {/* Live Card Preview rendering */}
            <div style={{
              width: '100%',
              maxWidth: '320px',
              height: '190px',
              background: selectedTier.gradient,
              border: selectedTier.border || 'none',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: selectedTier.textColor,
              position: 'relative',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
              transform: 'perspective(800px) rotateY(-5deg)',
              transition: 'transform 0.5s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '10px', letterSpacing: '1.5px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 'bold' }}>
                    MEMBRE OFFICIEL
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0 }}>
                    {selectedTier.name.toUpperCase()}
                  </h3>
                </div>
                <div style={{
                  width: '36px',
                  height: '27px',
                  background: 'linear-gradient(135deg, #ffe066, #f5b041)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.3)'
                }} />
              </div>

              {/* Dynamic live values */}
              <div style={{ fontSize: '12px', fontFamily: 'monospace', letterSpacing: '2.5px', opacity: 0.9 }}>
                FAR - 2026 - {cin ? cin.toUpperCase().padEnd(6, 'X').slice(0, 6) : 'XXXXXX'} - {selectedTier.type.slice(0, 2).toUpperCase()}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase' }}>
                  <div style={{ fontSize: '8px', opacity: 0.6 }}>Titulaire de la Carte</div>
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{fullName ? fullName.toUpperCase() : 'VOTRE NOM ICI'}</div>
                </div>
                <img src="/AS_FAR_logo.png" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              </div>
            </div>
            
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2rem', textAlign: 'center', fontStyle: 'italic' }}>
              Cette carte sera générée sous format numérique instantané et sous format physique expédiée à votre adresse.
            </p>
          </div>

          {/* Form Personal Information Column */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '1.5rem' }}>
              Informations Obligatoires d'Abonnement
            </h3>

            {submitted ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80%',
                color: 'var(--asfar-green)',
                textAlign: 'center',
                gap: '12px'
              }}>
                <CheckCircle2 size={48} />
                <h4 style={{ color: 'white', fontWeight: 'bold' }}>Abonnement Ajouté au Panier !</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Finalisez votre commande en accédant au panier pour activer votre carte officielle.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Nom Complet du Titulaire *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Aymen Lahdaoui"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 10px 10px 36px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Numéro de CIN *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: AB123456"
                        value={cin}
                        onChange={(e) => setCin(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 10px 10px 36px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                      Téléphone *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="tel" 
                        required
                        placeholder="Ex: 0612345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 10px 10px 36px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Adresse Email de Notification *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      required
                      placeholder="Ex: aymen@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 10px 10px 36px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </div>

                {/* File input (mock) */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Photo d'identité (Recommandée pour impression)
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      padding: '8px',
                      background: 'rgba(0,0,0,0.1)',
                      border: '1px dashed var(--border-glass)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '1rem',
                    boxShadow: 'var(--shadow-glow)',
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={16} /> Ajouter l'Abonnement au Panier
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
