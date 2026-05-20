import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, Search, Check, ShoppingCart, Info, CheckCircle2, CheckCircle, XCircle, Trash2, ShieldAlert, FileText, User, Phone, Mail } from 'lucide-react';

const EXCLUSIVE_PRODUCTS = [
  {
    id: 101,
    name: "Gilet Tactique d'Entraînement",
    description: "Gilet lesté officiel noir ASFAR avec compartiments ajustables, conçu pour la préparation physique militaire et athlétique de haut niveau.",
    price: 850,
    image: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=500",
    category: "ÉQUIPEMENT",
    badge: "Exclusif Staff",
    stock: 12
  },
  {
    id: 102,
    name: "Pack de 10 Ballons CAF Pro",
    description: "Lot de 10 ballons officiels de match homologués CAF, livrés avec filet de transport respirant et pompe de gonflage professionnelle.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500",
    category: "MATÉRIEL",
    badge: "Dotation Équipe",
    stock: 8
  },
  {
    id: 103,
    name: "Chronomètre Coach Pro",
    description: "Chronomètre étanche de précision au 1/100e de seconde avec stockage de 100 temps intermédiaires, rétroéclairage et alarme.",
    price: 350,
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=500",
    category: "ÉQUIPEMENT",
    badge: "Coach Spécial",
    stock: 25
  },
  {
    id: 104,
    name: "Sac de Voyage Officiel ASFAR",
    description: "Sac de sport grand format renforcé et imperméable, avec compartiment à chaussures séparé et bandoulière rembourrée.",
    price: 450,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    category: "ACCESSOIRES",
    badge: "Édition Limitée",
    stock: 15
  },
  {
    id: 105,
    name: "Kit Agilité et Vitesse (50 pcs)",
    description: "Ensemble complet comprenant 30 cônes plats souples, 10 haies de saut légères et une échelle de rythme de 6 mètres.",
    price: 200,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
    category: "MATÉRIEL",
    badge: "Entraînement",
    stock: 30
  },
  {
    id: 106,
    name: "Écusson d'Honneur ASFAR Or",
    description: "Insigne officiel en alliage métallique précieux plaqué or, gravé aux emblèmes historiques du club pour les dirigeants.",
    price: 150,
    image: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=500",
    category: "ACCESSOIRES",
    badge: "Prestige",
    stock: 5
  }
];

const CARD_TIERS = [
  {
    type: 'membre',
    name: 'Carte Membre',
    price: 150,
    gradient: 'linear-gradient(135deg, var(--asfar-green) 0%, #004d28 50%, #002210 100%)',
    border: '1.5px solid var(--asfar-gold)',
    textColor: 'white',
    accentColor: 'var(--asfar-gold)',
    benefits: [
      "Priorité de réservation sur la billetterie officielle (24h avant)",
      "10% de réduction permanente sur la Boutique Officielle",
      "Accès aux actualités réservées aux membres",
      "Participation aux votes de décision du club",
      "Invitation aux événements officiels du club"
    ]
  }
];

export const RespoShop = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("TOUT");
  const [orderedItem, setOrderedItem] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [proOrders, setProOrders] = useState([]);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expandedBadgesOrderId, setExpandedBadgesOrderId] = useState(null);
  const [tempBadges, setTempBadges] = useState({});
  const [activeTab, setActiveTab] = useState("EQUIPEMENTS");
  const [adminActiveTab, setAdminActiveTab] = useState("EQUIPEMENTS");
  
  // États pour le formulaire de carte membre
  const [cardQty, setCardQty] = useState("100");
  const [cardSubmitted, setCardSubmitted] = useState(false);
  const [expandedMembersOrderId, setExpandedMembersOrderId] = useState(null);
  const [tempMembers, setTempMembers] = useState({});

  // Charger les commandes pro depuis le localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem('asfar_pro_orders');
    if (saved) {
      setProOrders(JSON.parse(saved));
    } else {
      // Données de test initiales si vide
      const initialOrders = [
        {
          id: 1,
          productName: "Gilet Tactique d'Entraînement",
          productImage: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=500",
          requestedQty: 5,
          approvedQty: 5,
          price: 850,
          orderedBy: "respo@askary.ma",
          status: "APPROVED",
          createdAt: "19 Mai, 18:30"
        },
        {
          id: 2,
          productName: "Pack de 10 Ballons CAF Pro",
          productImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500",
          requestedQty: 3,
          approvedQty: 2, // L'admin a modifié la quantité reçue
          price: 1200,
          orderedBy: "respo@askary.ma",
          status: "APPROVED",
          createdAt: "19 Mai, 19:15"
        },
        {
          id: 3,
          productName: "Chronomètre Coach Pro",
          productImage: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=500",
          requestedQty: 10,
          approvedQty: 10,
          price: 350,
          orderedBy: "respo@askary.ma",
          status: "PENDING",
          createdAt: "20 Mai, 01:45"
        }
      ];
      setProOrders(initialOrders);
      localStorage.setItem('asfar_pro_orders', JSON.stringify(initialOrders));
    }
  }, []);

  const saveProOrders = (updated) => {
    setProOrders(updated);
    localStorage.setItem('asfar_pro_orders', JSON.stringify(updated));
  };

  const handleOrder = (product, qty = 1) => {
    const newOrder = {
      id: Date.now(),
      productName: product.name,
      productImage: product.image,
      requestedQty: qty,
      approvedQty: qty, // L'admin pourra la modifier
      price: product.price,
      orderedBy: user?.email || 'respo@askary.ma',
      status: 'PENDING',
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ", " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newOrder, ...proOrders];
    saveProOrders(updated);

    setOrderedItem({ product, qty });
    setTimeout(() => {
      setOrderedItem(null);
    }, 3500);
  };

  const updateQuantity = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Modifier la quantité approuvée par l'admin
  const handleUpdateApprovedQty = (orderId, delta) => {
    const updated = proOrders.map(o => {
      if (o.id === orderId) {
        const nextQty = Math.max(0, o.approvedQty + delta); // Peut descendre à 0
        return { ...o, approvedQty: nextQty };
      }
      return o;
    });
    saveProOrders(updated);
  };

  // Approuver ou rejeter une commande
  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = proOrders.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: newStatus,
          comment: newStatus === 'APPROVED' ? '' : o.comment // Effacer le commentaire s'il est approuvé
        };
      }
      return o;
    });
    saveProOrders(updated);
  };

  // Confirmer le rejet avec commentaire
  const handleConfirmRejection = (orderId) => {
    if (!rejectionReason.trim()) {
      alert("Veuillez saisir un motif pour le refus.");
      return;
    }
    const updated = proOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'REJECTED', comment: rejectionReason };
      }
      return o;
    });
    saveProOrders(updated);
    setRejectingOrderId(null);
    setRejectionReason("");
  };

  // Supprimer une commande de la liste
  const handleDeleteOrder = (orderId) => {
    const updated = proOrders.filter(o => o.id !== orderId);
    saveProOrders(updated);
  };

  // Enregistrer les badges pour une commande approuvée (obligatoire)
  const handleSaveBadges = (orderId) => {
    const order = proOrders.find(item => item.id === orderId);
    if (!order) return;
    
    const arr = [];
    for (let i = 0; i < order.approvedQty; i++) {
      const val = (tempBadges[i] || "").trim();
      if (!val) {
        alert(`Erreur: Le numéro de badge de l'unité ${i + 1} est obligatoire. Veuillez remplir tous les champs.`);
        return;
      }
      arr.push(val);
    }
    
    const updated = proOrders.map(item => {
      if (item.id === orderId) {
        return { ...item, badgeNumbers: arr };
      }
      return item;
    });
    saveProOrders(updated);
    setExpandedBadgesOrderId(null);
  };

  // Enregistrer les détails des membres pour les cartes approuvées (obligatoire)
  const handleSaveMembers = (orderId) => {
    const order = proOrders.find(item => item.id === orderId);
    if (!order) return;
    
    const arr = [];
    for (let i = 0; i < order.approvedQty; i++) {
      const m = tempMembers[i] || {};
      const lastName = (m.lastName || "").trim();
      const firstName = (m.firstName || "").trim();
      const age = parseInt(m.age, 10);
      
      if (!lastName || !firstName || isNaN(age) || age <= 0) {
        alert(`Erreur: Veuillez remplir correctement les informations (Nom, Prénom, Âge) de la carte membre ${i + 1}.`);
        return;
      }
      
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const numPart = Math.floor(1000 + Math.random() * 9000);
      const serialNumber = `UAR-2026-${randomPart}-${numPart}`;

      arr.push({ lastName, firstName, age, serialNumber });
    }
    
    const updated = proOrders.map(item => {
      if (item.id === orderId) {
        return { ...item, membersDetails: arr, status: 'READY_FOR_PRINTING' };
      }
      return item;
    });
    saveProOrders(updated);
    setExpandedMembersOrderId(null);
  };

  // Commander des cartes de membre en gros (dotation)
  const handleOrderCard = (qty) => {
    const newOrder = {
      id: Date.now(),
      productName: `Carte Membre Officielle`,
      productImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500',
      requestedQty: qty,
      approvedQty: qty,
      price: 150,
      orderedBy: user?.email || 'respo@askary.ma',
      status: 'PENDING',
      isCard: true,
      membersDetails: [],
      createdAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + ", " + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newOrder, ...proOrders];
    saveProOrders(updated);
    
    // Succès
    setOrderedItem({ product: { name: newOrder.productName }, qty });
    setTimeout(() => {
      setOrderedItem(null);
    }, 3500);
  };

  const filteredProducts = EXCLUSIVE_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "TOUT" || p.category === category;
    return matchesSearch && matchesCat;
  });

  const isRespo = user?.role === 'RESPO';
  const isAdminRespo = user?.role === 'ADMIN_RESPO';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }} className="animate-fade-in">
      
      {/* Exclusive Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 107, 60, 0.15) 0%, rgba(212, 175, 55, 0.15) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-gold-glow)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          opacity: 0.05,
          color: 'var(--asfar-gold)',
          transform: 'rotate(15deg)'
        }}>
          <Shield size={250} />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid var(--asfar-gold)',
            color: 'var(--asfar-gold)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            <Sparkles size={12} /> {isAdminRespo ? "Administration de l'Espace Pro" : "Espace Professionnel Réservé"}
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '900', color: 'white', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
            Boutique Pro <span className="text-gradient-askary">Staff ASFAR</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px', maxWidth: '650px', lineHeight: '1.6' }}>
            {isRespo ? (
              <>Bienvenue dans votre catalogue d'approvisionnement. En tant que <strong>Responsable</strong>, commandez le matériel nécessaire pour votre équipe. Vos demandes seront validées et ajustées par l'Administrateur des Responsables.</>
            ) : (
              <>Portail de contrôle des stocks et de validation des dotations. En tant qu'<strong>Admin des Responsables</strong>, supervisez les demandes d'équipements formulées par vos responsables de division et ajustez la quantité finale accordée.</>
            )}
          </p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {orderedItem && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(22, 28, 36, 0.95)',
          border: '1px solid var(--asfar-green)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '400px'
        }} className="animate-fade-in">
          <div style={{ background: 'rgba(0, 107, 60, 0.2)', color: 'var(--asfar-green)', padding: '6px', borderRadius: '50%' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h5 style={{ color: 'white', margin: 0, fontSize: '13px', fontWeight: 'bold' }}>Demande de dotation envoyée !</h5>
            <p style={{ color: 'var(--text-muted)', margin: '2px 0 0 0', fontSize: '11px' }}>
              {orderedItem.qty}x {orderedItem.product.name} (Attente de validation Admin)
            </p>
          </div>
        </div>
      )}

      {/* Tab selection for Shop types */}
      {isRespo && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-glass)',
          paddingBottom: '1.25rem'
        }}>
          <button
            onClick={() => setActiveTab("EQUIPEMENTS")}
            className="btn"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '12px',
              background: activeTab === 'EQUIPEMENTS' ? 'linear-gradient(135deg, var(--asfar-green), #00502c)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              cursor: 'pointer',
              border: activeTab === 'EQUIPEMENTS' ? '1px solid var(--asfar-green)' : '1px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            📦 Équipements de Dotation
          </button>
          <button
            onClick={() => setActiveTab("MEMBER_CARDS")}
            className="btn"
            style={{
              padding: '0.75rem 2rem',
              fontSize: '13px',
              fontWeight: 'bold',
              borderRadius: '12px',
              background: activeTab === 'MEMBER_CARDS' ? 'linear-gradient(135deg, var(--asfar-gold), #8c7323)' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'MEMBER_CARDS' ? 'black' : 'white',
              cursor: 'pointer',
              border: activeTab === 'MEMBER_CARDS' ? '1px solid var(--asfar-gold)' : '1px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            💳 Boutique Cartes Membres
          </button>
        </div>
      )}

      {/* Filters Hub & Equipment Grid container */}
      {(!isRespo || activeTab === 'EQUIPEMENTS') && (
        <>
          {/* Filters Hub */}
          <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.25rem',
        marginBottom: '2.5rem',
        background: 'rgba(17, 22, 34, 0.6)',
        padding: '1rem 1.5rem',
        borderRadius: '16px',
        border: '1px solid var(--border-glass)'
      }}>
        {/* Categories Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {["TOUT", "ÉQUIPEMENT", "MATÉRIEL", "ACCESSOIRES"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="btn"
              style={{
                fontSize: '12px',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                background: category === cat ? 'linear-gradient(135deg, var(--asfar-green), #00502c)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Rechercher un équipement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '0.6rem 1rem 0.6rem 2.5rem',
              color: 'white',
              fontSize: '13px'
            }}
          />
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Grid of Pro Products */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {filteredProducts.map(product => {
          const qty = quantities[product.id] || 1;
          return (
            <div 
              key={product.id}
              className="glass-panel card-product-asfar"
              style={{
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(22, 28, 36, 0.45)',
                border: '1px solid var(--border-glass)'
              }}
            >
              {/* Product Image Panel */}
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Float Badge */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'var(--asfar-gold)',
                  color: 'black',
                  fontSize: '9px',
                  fontWeight: '900',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase'
                }}>
                  {product.badge}
                </span>

                {/* Stock indicator */}
                <span style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'var(--text-secondary)',
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  Statut: Disponible
                </span>
              </div>

              {/* Product Contents */}
              <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '10px', color: 'var(--asfar-gold)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {product.category}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'white', marginTop: '4px' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                    {product.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tarif Dotation Staff:</span>
                    <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--asfar-gold)' }}>
                      {product.price} DH
                    </span>
                  </div>

                  {/* Procurement Control Panel */}
                  {isRespo ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: 'rgba(0, 0, 0, 0.3)', 
                        borderRadius: '8px',
                        border: '1px solid var(--border-glass)',
                        overflow: 'hidden'
                      }}>
                        <button 
                          onClick={() => updateQuantity(product.id, -1)}
                          className="btn" 
                          style={{ padding: '4px 10px', fontSize: '14px', border: 'none', background: 'none', color: 'white' }}
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val >= 1) {
                              setQuantities(prev => ({ ...prev, [product.id]: val }));
                            }
                          }}
                          style={{
                            width: '40px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            outline: 'none',
                            padding: '4px 0'
                          }}
                        />
                        <button 
                          onClick={() => updateQuantity(product.id, 1)}
                          className="btn" 
                          style={{ padding: '4px 10px', fontSize: '14px', border: 'none', background: 'none', color: 'white' }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleOrder(product, qty)}
                        className="btn"
                        style={{
                          flexGrow: 1,
                          background: 'linear-gradient(135deg, var(--asfar-green), #00502c)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(0, 107, 60, 0.25)'
                        }}
                      >
                        <ShoppingCart size={14} /> Commander
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: 'var(--asfar-gold)',
                      fontWeight: 'bold',
                      border: '1px dashed rgba(212,175,55,0.3)'
                    }}>
                      Consultation (Validation ci-dessous)
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* Tab: Cartes Membres */}
      {isRespo && activeTab === 'MEMBER_CARDS' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Card & Order Form Panel */}
          <div 
            className="glass-panel"
            style={{
              background: 'rgba(13, 18, 26, 0.85)',
              border: '1px solid var(--asfar-gold)',
              borderRadius: '24px',
              padding: '2.5rem',
              maxWidth: '850px',
              width: '100%',
              margin: '0 auto 4rem auto',
              boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            {/* Left: Card Artwork & Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--asfar-gold)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Carte Membre Officielle ASFAR
              </h3>
              
              {/* Premium Live Card Artwork Render */}
              <div style={{
                width: '100%',
                maxWidth: '320px',
                height: '190px',
                background: 'linear-gradient(135deg, var(--asfar-green) 0%, #004d28 50%, #002210 100%)',
                border: '1.5px solid var(--asfar-gold)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: 'white',
                position: 'relative',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '9px', letterSpacing: '1.5px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 'bold' }}>
                      STAFF ASFAR
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '900', margin: 0, color: 'var(--asfar-gold)' }}>
                      MEMBRE OFFICIEL
                    </h3>
                  </div>
                  <div style={{
                    width: '32px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #ffe066, #f5b041)',
                    borderRadius: '4px',
                    border: '1.5px solid rgba(255,255,255,0.3)'
                  }} />
                </div>

                <div style={{ fontSize: '12px', fontFamily: 'monospace', letterSpacing: '2.5px', opacity: 0.9 }}>
                  UAR - 2026 - XXXXXX - MB
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                    <div style={{ fontSize: '8px', opacity: 0.6 }}>Statut Bénéficiaire</div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>SUPPORT COOPÉRATIF</div>
                  </div>
                  <img src="/AS_FAR_logo.png" alt="" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                </div>
              </div>
            </div>

            {/* Right: Order Form */}
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '2rem' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '1.5rem' }}>
                Demander des Cartes Membres
              </h4>

              {cardSubmitted ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '150px',
                  color: 'var(--asfar-green)',
                  textAlign: 'center',
                  gap: '12px'
                }}>
                  <CheckCircle2 size={40} />
                  <h4 style={{ color: 'white', fontWeight: 'bold' }}>Demande Envoyée !</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Votre demande de cartes membres est en attente d'approbation par l'Admin des Responsables.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const qty = parseInt(cardQty, 10);
                  if (isNaN(qty) || qty <= 0) {
                    alert("Veuillez saisir une quantité supérieure à 0.");
                    return;
                  }
                  handleOrderCard(qty);
                  setCardSubmitted(true);
                  setTimeout(() => {
                    setCardSubmitted(false);
                    setCardQty("100");
                  }, 2500);
                }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      Nombre de cartes souhaité *
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      required
                      value={cardQty}
                      onChange={(e) => setCardQty(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: 'linear-gradient(135deg, var(--asfar-gold), #8c7323)',
                      color: 'black',
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(212,175,55,0.2)'
                    }}
                  >
                    <ShoppingCart size={14} /> Commander les Cartes Membres
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Rôle 1: RESPO - Mes Commandes de Dotation */}
      {isRespo && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📋 Suivi de mes Commandes {activeTab === 'MEMBER_CARDS' ? 'de Cartes Membres' : 'd\'Équipements'}
          </h3>
          
          {proOrders.filter(o => activeTab === 'MEMBER_CARDS' ? o.isCard : !o.isCard).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Aucune commande {activeTab === 'MEMBER_CARDS' ? 'de carte membre' : 'd\'équipement'} enregistrée pour le moment.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Produit</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Quantité Demandée</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Quantité Approuvée (Admin)</th>
                    <th style={{ padding: '12px' }}>Statut</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {proOrders.filter(o => activeTab === 'MEMBER_CARDS' ? o.isCard : !o.isCard).map(o => (
                    <React.Fragment key={o.id}>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'white' }}>
                        <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{o.createdAt}</td>
                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={o.productImage} alt={o.productName} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{o.productName}</span>
                            {o.isCard && o.membersDetails && o.membersDetails.length > 0 && (
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ color: 'var(--asfar-gold)', fontWeight: '500' }}>👤 Membres Enregistrés ({o.membersDetails.length}) :</span>
                                <div style={{ maxHeight: '60px', overflowY: 'auto', paddingLeft: '6px', borderLeft: '1px solid rgba(212,175,55,0.3)' }}>
                                  {o.membersDetails.map((m, idx) => (
                                    <div key={idx} style={{ fontSize: '10px' }}>- {m.lastName.toUpperCase()} {m.firstName} ({m.age} ans)</div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {o.badgeNumbers && o.badgeNumbers.filter(Boolean).length > 0 && (
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                🏷️ Badges: {o.badgeNumbers.filter(Boolean).join(', ')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                          {o.isCard ? `${o.requestedQty} cartes` : `${o.requestedQty} pièces`}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: o.status === 'APPROVED' ? 'var(--asfar-gold)' : 'var(--text-secondary)' }}>
                          {o.status === 'PENDING' ? '-' : (o.isCard ? `${o.approvedQty} cartes` : `${o.approvedQty} pièces`)}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {o.status === 'PENDING' && <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--asfar-gold)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>En Attente</span>}
                          {o.status === 'APPROVED' && (
                            o.isCard ? (
                              o.membersDetails && o.membersDetails.length === o.approvedQty ? (
                                <span style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Approuvée</span>
                              ) : (
                                <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--asfar-gold)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', border: '1px solid var(--asfar-gold)' }}>Approuvée - Infos Requises</span>
                              )
                            ) : o.badgeNumbers && o.badgeNumbers.filter(Boolean).length === o.approvedQty ? (
                              <span style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Approuvée</span>
                            ) : (
                              <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--asfar-gold)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', border: '1px solid var(--asfar-gold)' }}>Approuvée - Badges Requis</span>
                            )
                          )}
                          {o.status === 'REJECTED' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ background: 'rgba(210,20,58,0.15)', color: 'var(--asfar-red)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', width: 'fit-content' }}>Refusée</span>
                              {o.comment && (
                                <span style={{ fontSize: '10px', color: '#ff6b6b', display: 'block', maxWidth: '180px', wordBreak: 'break-word', fontStyle: 'italic' }}>
                                  Motif: {o.comment}
                                </span>
                              )}
                            </div>
                          )}
                          {o.status === 'READY_FOR_PRINTING' && <span style={{ background: 'rgba(0,123,255,0.15)', color: '#007bff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>En cours d'impression</span>}
                          {o.status === 'PRINTED' && <span style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Imprimée et Prête</span>}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          {o.status === 'PENDING' && (
                            <button 
                              onClick={() => handleDeleteOrder(o.id)}
                              className="btn btn-secondary"
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', color: 'var(--asfar-red)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={12} /> Annuler
                            </button>
                          )}
                          {o.status === 'APPROVED' && !o.isCard && (
                            <button
                              onClick={() => {
                                const initial = {};
                                const existing = o.badgeNumbers || [];
                                for (let i = 0; i < o.approvedQty; i++) {
                                  initial[i] = existing[i] || "";
                                }
                                setTempBadges(initial);
                                setExpandedBadgesOrderId(expandedBadgesOrderId === o.id ? null : o.id);
                              }}
                              className="btn"
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                background: o.badgeNumbers && o.badgeNumbers.filter(Boolean).length === o.approvedQty ? 'rgba(0,107,60,0.15)' : 'rgba(210,20,58,0.15)',
                                border: o.badgeNumbers && o.badgeNumbers.filter(Boolean).length === o.approvedQty ? '1px solid var(--asfar-green)' : '1px solid var(--asfar-red)',
                                color: o.badgeNumbers && o.badgeNumbers.filter(Boolean).length === o.approvedQty ? 'var(--asfar-green)' : '#ff6b6b',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <FileText size={12} />
                              {o.badgeNumbers && o.badgeNumbers.filter(Boolean).length === o.approvedQty ? "Modifier Badges" : "⚠️ Saisir Badges (Obligatoire)"}
                            </button>
                          )}
                          {o.status === 'APPROVED' && o.isCard && (
                            <button
                              onClick={() => {
                                const initial = {};
                                const existing = o.membersDetails || [];
                                for (let i = 0; i < o.approvedQty; i++) {
                                  initial[i] = existing[i] || { lastName: "", firstName: "", age: "" };
                                }
                                setTempMembers(initial);
                                setExpandedMembersOrderId(expandedMembersOrderId === o.id ? null : o.id);
                              }}
                              className="btn"
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                background: o.membersDetails && o.membersDetails.length === o.approvedQty ? 'rgba(0,107,60,0.15)' : 'rgba(210,20,58,0.15)',
                                border: o.membersDetails && o.membersDetails.length === o.approvedQty ? '1px solid var(--asfar-green)' : '1px solid var(--asfar-red)',
                                color: o.membersDetails && o.membersDetails.length === o.approvedQty ? 'var(--asfar-green)' : '#ff6b6b',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <User size={12} />
                              {o.membersDetails && o.membersDetails.length === o.approvedQty ? "Modifier Membres" : "⚠️ Saisir Infos Membres"}
                            </button>
                          )}
                        </td>
                      </tr>
                      {expandedBadgesOrderId === o.id && (
                        <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <td colSpan={6} style={{ padding: '12px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--asfar-gold)', margin: 0 }}>
                                📋 Saisie des Badges Bénéficiaires ({o.approvedQty} requis)
                              </h4>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
                                {Array.from({ length: o.approvedQty }).map((_, idx) => (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unité {idx + 1}:</span>
                                    <input 
                                      type="text"
                                      placeholder="N° Badge"
                                      value={tempBadges[idx] || ""}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setTempBadges(prev => ({ ...prev, [idx]: val }));
                                      }}
                                      style={{
                                        background: 'rgba(22, 28, 36, 0.8)',
                                        border: '1px solid var(--border-glass)',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        color: 'white',
                                        fontSize: '11px',
                                        width: '110px'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button
                                  onClick={() => handleSaveBadges(o.id)}
                                  className="btn"
                                  style={{ background: 'var(--asfar-green)', color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  Enregistrer
                                </button>
                                <button
                                  onClick={() => setExpandedBadgesOrderId(null)}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      {expandedMembersOrderId === o.id && (
                        <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <td colSpan={6} style={{ padding: '12px 24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--asfar-gold)', margin: 0 }}>
                                👥 Informations des Bénéficiaires des Cartes Membres ({o.approvedQty} cartes requises)
                              </h4>
                              
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '1rem',
                                marginTop: '4px'
                              }}>
                                {Array.from({ length: o.approvedQty }).map((_, idx) => (
                                  <div 
                                    key={idx} 
                                    style={{ 
                                      background: 'rgba(0,0,0,0.25)', 
                                      border: '1px solid var(--border-glass)', 
                                      borderRadius: '8px', 
                                      padding: '10px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '8px'
                                    }}
                                  >
                                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--asfar-gold)' }}>
                                      Carte N°{idx + 1}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>Nom</label>
                                        <input 
                                          type="text"
                                          placeholder="Nom"
                                          value={tempMembers[idx]?.lastName || ""}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setTempMembers(prev => ({
                                              ...prev,
                                              [idx]: { ...(prev[idx] || {}), lastName: val }
                                            }));
                                          }}
                                          style={{
                                            background: 'rgba(22, 28, 36, 0.8)',
                                            border: '1px solid var(--border-glass)',
                                            borderRadius: '4px',
                                            padding: '4px 6px',
                                            color: 'white',
                                            fontSize: '11px',
                                            width: '100%',
                                            outline: 'none'
                                          }}
                                        />
                                      </div>
                                      <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>Prénom</label>
                                        <input 
                                          type="text"
                                          placeholder="Prénom"
                                          value={tempMembers[idx]?.firstName || ""}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setTempMembers(prev => ({
                                              ...prev,
                                              [idx]: { ...(prev[idx] || {}), firstName: val }
                                            }));
                                          }}
                                          style={{
                                            background: 'rgba(22, 28, 36, 0.8)',
                                            border: '1px solid var(--border-glass)',
                                            borderRadius: '4px',
                                            padding: '4px 6px',
                                            color: 'white',
                                            fontSize: '11px',
                                            width: '100%',
                                            outline: 'none'
                                          }}
                                        />
                                      </div>
                                      <div style={{ width: '60px' }}>
                                        <label style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginBottom: '3px' }}>Âge</label>
                                        <input 
                                          type="number"
                                          min="1"
                                          placeholder="Âge"
                                          value={tempMembers[idx]?.age || ""}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setTempMembers(prev => ({
                                              ...prev,
                                              [idx]: { ...(prev[idx] || {}), age: val }
                                            }));
                                          }}
                                          style={{
                                            background: 'rgba(22, 28, 36, 0.8)',
                                            border: '1px solid var(--border-glass)',
                                            borderRadius: '4px',
                                            padding: '4px 6px',
                                            color: 'white',
                                            fontSize: '11px',
                                            width: '100%',
                                            outline: 'none'
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                <button
                                  onClick={() => handleSaveMembers(o.id)}
                                  className="btn"
                                  style={{ background: 'var(--asfar-green)', color: 'white', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                  Enregistrer les Membres
                                </button>
                                <button
                                  onClick={() => setExpandedMembersOrderId(null)}
                                  className="btn btn-secondary"
                                  style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Rôle 2: ADMIN_RESPO - Tableau de Validation des Dotations */}
      {isAdminRespo && (
        <div style={{ marginTop: '2rem' }}>
          {/* Admin Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '1.25rem'
          }}>
            <button
              onClick={() => setAdminActiveTab("EQUIPEMENTS")}
              className="btn"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '13px',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: adminActiveTab === 'EQUIPEMENTS' ? 'linear-gradient(135deg, var(--asfar-green), #00502c)' : 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
                border: adminActiveTab === 'EQUIPEMENTS' ? '1px solid var(--asfar-green)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              📦 Équipements de Dotation
            </button>
            <button
              onClick={() => setAdminActiveTab("MEMBER_CARDS")}
              className="btn"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '13px',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: adminActiveTab === 'MEMBER_CARDS' ? 'linear-gradient(135deg, var(--asfar-gold), #8c7323)' : 'rgba(255,255,255,0.05)',
                color: adminActiveTab === 'MEMBER_CARDS' ? 'black' : 'white',
                cursor: 'pointer',
                border: adminActiveTab === 'MEMBER_CARDS' ? '1px solid var(--asfar-gold)' : '1px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              💳 Cartes Membres
            </button>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                📋 Tableau de Validation {adminActiveTab === 'MEMBER_CARDS' ? 'des Cartes Membres' : 'des Équipements'}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                Total Demandes: {proOrders.filter(o => adminActiveTab === 'MEMBER_CARDS' ? o.isCard : !o.isCard).length}
              </span>
            </div>

            {proOrders.filter(o => adminActiveTab === 'MEMBER_CARDS' ? o.isCard : !o.isCard).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Aucune demande {adminActiveTab === 'MEMBER_CARDS' ? 'de carte membre' : 'd\'équipement'} en attente.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)', fontSize: '12px' }}>
                      <th style={{ padding: '12px' }}>Responsable</th>
                      <th style={{ padding: '12px' }}>Produit</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Demandé</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Quantité Approuvée par Admin (Ajustable)</th>
                      <th style={{ padding: '12px' }}>Statut Actuel</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions Décisions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proOrders.filter(o => adminActiveTab === 'MEMBER_CARDS' ? o.isCard : !o.isCard).map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'white' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 'bold' }}>{o.orderedBy}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{o.createdAt}</div>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={o.productImage} alt={o.productName} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{o.productName}</span>
                          {o.isCard && o.membersDetails && o.membersDetails.length > 0 && (
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ color: 'var(--asfar-gold)', fontWeight: '500' }}>👤 Membres Enregistrés ({o.membersDetails.length}) :</span>
                              <div style={{ maxHeight: '60px', overflowY: 'auto', paddingLeft: '6px', borderLeft: '1px solid rgba(212,175,55,0.3)' }}>
                                {o.membersDetails.map((m, idx) => (
                                  <div key={idx} style={{ fontSize: '10px' }}>- {m.lastName.toUpperCase()} {m.firstName} ({m.age} ans)</div>
                                ))}
                              </div>
                            </div>
                          )}
                          {o.badgeNumbers && o.badgeNumbers.filter(Boolean).length > 0 && (
                            <span style={{ fontSize: '10px', color: 'var(--asfar-gold)', marginTop: '2px', fontWeight: 'bold' }}>
                              🏷️ Badges: {o.badgeNumbers.filter(Boolean).join(', ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
                        {o.isCard ? `${o.requestedQty} cartes` : `${o.requestedQty} pièces`}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {/* Contrôle de la quantité approuvée à la discrétion de l'admin des respos */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
                          <button
                            disabled={o.status !== 'PENDING'}
                            onClick={() => handleUpdateApprovedQty(o.id, -1)}
                            className="btn"
                            style={{ padding: '2px 8px', fontSize: '12px', background: 'none', border: 'none', color: o.status === 'PENDING' ? 'white' : 'var(--text-muted)', cursor: o.status === 'PENDING' ? 'pointer' : 'default' }}
                          >
                            -
                          </button>
                          <input 
                            type="number"
                            min="0"
                            disabled={o.status !== 'PENDING'}
                            value={o.approvedQty}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              if (!isNaN(val) && val >= 0) {
                                const updated = proOrders.map(item => {
                                  if (item.id === o.id) {
                                    return { ...item, approvedQty: val };
                                  }
                                  return item;
                                });
                                saveProOrders(updated);
                              }
                            }}
                            style={{
                              width: '40px',
                              background: 'none',
                              border: 'none',
                              color: 'var(--asfar-gold)',
                              textAlign: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              outline: 'none',
                              padding: '2px 0'
                            }}
                          />
                          <button
                            disabled={o.status !== 'PENDING'}
                            onClick={() => handleUpdateApprovedQty(o.id, 1)}
                            className="btn"
                            style={{ padding: '2px 8px', fontSize: '12px', background: 'none', border: 'none', color: o.status === 'PENDING' ? 'white' : 'var(--text-muted)', cursor: o.status === 'PENDING' ? 'pointer' : 'default' }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {o.status === 'PENDING' && <span style={{ background: 'rgba(212,175,55,0.15)', color: 'var(--asfar-gold)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>En Attente de Validation</span>}
                        {o.status === 'APPROVED' && (
                          o.isCard ? (
                            <span style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Approuvé ({o.approvedQty} cartes)</span>
                          ) : (
                            <span style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Approuvé ({o.approvedQty} pcs)</span>
                          )
                        )}
                        {o.status === 'REJECTED' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ background: 'rgba(210,20,58,0.15)', color: 'var(--asfar-red)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', width: 'fit-content' }}>Refusé</span>
                            {o.comment && (
                              <span style={{ fontSize: '10px', color: '#ff6b6b', fontStyle: 'italic', maxWidth: '180px', wordBreak: 'break-word' }}>
                                Motif: {o.comment}
                              </span>
                            )}
                          </div>
                        )}
                        {o.status === 'READY_FOR_PRINTING' && <span style={{ background: 'rgba(0,123,255,0.15)', color: '#007bff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>En cours d'impression</span>}
                        {o.status === 'PRINTED' && <span style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>Imprimée et Prête</span>}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        {rejectingOrderId === o.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                            <input
                              type="text"
                              placeholder="Motif du refus..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              style={{
                                background: 'rgba(0,0,0,0.4)',
                                border: '1px solid var(--asfar-red)',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                color: 'white',
                                fontSize: '11px',
                                width: '180px'
                              }}
                            />
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={() => handleConfirmRejection(o.id)}
                                className="btn"
                                style={{ background: 'var(--asfar-red)', color: 'white', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                              >
                                Confirmer Refus
                              </button>
                              <button
                                onClick={() => {
                                  setRejectingOrderId(null);
                                  setRejectionReason("");
                                }}
                                className="btn btn-secondary"
                                style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer' }}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : o.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'APPROVED')}
                              className="btn"
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', background: 'var(--asfar-green)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => setRejectingOrderId(o.id)}
                              className="btn"
                              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', background: 'var(--asfar-red)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Rejeter
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'PENDING')}
                            className="btn btn-secondary"
                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Réinitialiser la Décision
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      )}

    </div>
  );
};
export default RespoShop;
