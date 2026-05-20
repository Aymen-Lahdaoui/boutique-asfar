import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Printer, Users, History, Search } from 'lucide-react';

export const CardProdDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isHistoryView = location.pathname === '/card-history';
  const [proOrders, setProOrders] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('asfar_pro_orders');
    if (saved) {
      setProOrders(JSON.parse(saved));
    }
  }, []);

  const saveProOrders = (orders) => {
    setProOrders(orders);
    localStorage.setItem('asfar_pro_orders', JSON.stringify(orders));
  };

  const handleMarkAsPrinted = (orderId) => {
    const updated = proOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'PRINTED' };
      }
      return o;
    });
    saveProOrders(updated);
    setSuccessMsg("Commande de cartes marquée comme imprimée avec succès !");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const readyOrders = proOrders.filter(o => o.isCard && o.status === 'READY_FOR_PRINTING');
  const printedOrders = proOrders.filter(o => o.isCard && o.status === 'PRINTED');

  return (
    <div className="page-container" style={{ padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center', background: 'rgba(22, 28, 36, 0.45)' }}>
        <h1 className="text-gradient-askary" style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 1rem 0', fontFamily: "'Cinzel', serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          {isHistoryView ? <History size={32} color="var(--asfar-gold)" /> : <Printer size={32} color="var(--asfar-gold)" />}
          {isHistoryView ? "Historique des Impressions" : "Centre d'Impression des Cartes"}
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          {isHistoryView 
            ? "Consultez ici l'ensemble des lots de cartes dont la production est terminée." 
            : "Bienvenue dans l'espace de production. Vous trouverez ici les commandes approuvées prêtes à être imprimées."}
        </p>
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(0,107,60,0.15)', color: 'var(--asfar-green)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--asfar-green)' }}>
          <CheckCircle2 size={20} />
          <strong>{successMsg}</strong>
        </div>
      )}

      {/* Orders List (Only shown if NOT in history view) */}
      {!isHistoryView && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)', flexGrow: 1 }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="var(--asfar-gold)" />
            Lots en attente d'impression
          </h3>

          {readyOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <AlertCircle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <p>Aucun lot de cartes en attente d'impression actuellement.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {readyOrders.map(order => (
                <div key={order.id} style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                  {/* Order Header */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ margin: 0, color: 'white', fontSize: '16px', fontWeight: 'bold' }}>Lot Commandé par : {order.orderedBy}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Date : {order.createdAt} • {order.approvedQty} Cartes</span>
                    </div>
                    <button
                      onClick={() => handleMarkAsPrinted(order.id)}
                      className="btn"
                      style={{ background: 'var(--asfar-gold)', color: 'black', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <CheckCircle2 size={16} />
                      Marquer comme Imprimée
                    </button>
                  </div>
                  
                  {/* Members List Grid */}
                  <div style={{ padding: '1.5rem' }}>
                    <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Détails des Bénéficiaires</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                      {order.membersDetails && order.membersDetails.map((member, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px' }}>CARTE #{idx + 1}</div>
                          <div style={{ fontWeight: 'bold', color: 'white', fontSize: '14px', marginBottom: '4px', textTransform: 'uppercase' }}>
                            {member.lastName} {member.firstName}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--asfar-gold)' }}>Âge: {member.age} ans</span>
                            <span style={{ fontSize: '10px', fontFamily: 'monospace', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>{member.serialNumber}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Printed History List (Only shown if IN history view) */}
      {isHistoryView && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={20} color="var(--asfar-gold)" />
              Base de données des cartes
            </h3>
            <div style={{ position: 'relative', width: '300px' }}>
              <input
                type="text"
                placeholder="Rechercher par n° de série (ex: UAR-2026-X)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--border-glass)',
                  padding: '10px 10px 10px 36px',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '13px'
                }}
              />
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {(() => {
            const printedMembers = printedOrders.flatMap(order => 
              (order.membersDetails || []).map(member => ({
                ...member,
                orderDate: order.createdAt
              }))
            );

            const filteredMembers = printedMembers.filter(m => 
              m.serialNumber && m.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (printedMembers.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <History size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                  <p>Aucune carte n'a encore été marquée comme imprimée.</p>
                </div>
              );
            }

            if (filteredMembers.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Search size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                  <p>Aucun numéro de série ne correspond à votre recherche.</p>
                </div>
              );
            }

            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {filteredMembers.map((member, idx) => (
                  <div 
                    key={`sn-${idx}`} 
                    onClick={() => setSelectedMember(member)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.transform = 'none';
                    }}
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '12px', 
                      padding: '1.25rem',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                    <CheckCircle2 size={24} color="var(--asfar-green)" style={{ margin: '0 auto' }} />
                    <span style={{ 
                      fontSize: '14px', 
                      fontFamily: 'monospace', 
                      color: 'white', 
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}>
                      {member.serialNumber}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setSelectedMember(null)}>
          <div 
            className="glass-panel" 
            style={{ 
              padding: '2.5rem', 
              borderRadius: '20px', 
              background: 'var(--bg-dark)', 
              border: '1px solid var(--asfar-gold)', 
              maxWidth: '400px', 
              width: '90%', 
              position: 'relative',
              boxShadow: 'var(--shadow-gold-glow)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMember(null)} 
              style={{ 
                position: 'absolute', 
                top: '15px', 
                right: '15px', 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-muted)', 
                cursor: 'pointer',
                fontSize: '20px',
                padding: '4px'
              }}
            >
              ✕
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <History size={32} color="var(--asfar-gold)" style={{ marginBottom: '10px' }} />
              <h3 style={{ color: 'white', margin: 0, fontSize: '22px' }}>Détails du Bénéficiaire</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>N° de Série</span>
                <strong style={{ color: 'var(--asfar-gold)', fontFamily: 'monospace', fontSize: '15px' }}>{selectedMember.serialNumber}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Nom</span>
                <strong style={{ color: 'white', fontSize: '15px', textTransform: 'uppercase' }}>{selectedMember.lastName}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Prénom</span>
                <strong style={{ color: 'white', fontSize: '15px', textTransform: 'capitalize' }}>{selectedMember.firstName}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Âge</span>
                <strong style={{ color: 'white', fontSize: '15px' }}>{selectedMember.age} ans</strong>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedMember(null)}
              className="btn"
              style={{ width: '100%', padding: '12px', background: 'var(--asfar-gold)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '8px', marginTop: '2rem', cursor: 'pointer' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
