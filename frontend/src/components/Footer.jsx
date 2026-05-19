import React from 'react';
import { Award, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass-panel" style={{
      marginTop: '4rem',
      borderRadius: '16px 16px 0 0',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      background: 'rgba(7, 8, 10, 0.95)',
      padding: '3rem 2rem 1.5rem 2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        paddingBottom: '2.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* About Club */}
        <div>
          <h3 className="text-gradient-askary" style={{ fontSize: '18px', marginBottom: '1rem' }}>ASFAR BOUTIQUE</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            La boutique officielle en ligne de l'Association Sportive des Forces Armées Royales. Portez les couleurs légendaires Vert, Noir et Rouge et affichez l'esprit Askary où que vous soyez.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginTop: '1.25rem' }}>
            <span className="badge badge-gold" style={{ fontSize: '9px' }}>Fondé en 1958</span>
            <span className="badge badge-green" style={{ fontSize: '9px' }}>Esprit Militaire</span>
          </div>
        </div>

        {/* Collections links */}
        <div>
          <h3 style={{ fontSize: '14px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Collections</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <li><a href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>👕 Matchday (Gamme Pro)</a></li>
            <li><a href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>👟 Streetwear & Lifestyle</a></li>
            <li><a href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🎗️ Accessoires Askary</a></li>
            <li><a href="/shop" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>🏆 Collection Héritage Rétro</a></li>
          </ul>
        </div>

        {/* Support Client */}
        <div>
          <h3 style={{ fontSize: '14px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Aide & Support</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <li><span style={{ color: 'var(--text-secondary)' }}>🚚 Livraison Rapide 48H</span></li>
            <li><span style={{ color: 'var(--text-secondary)' }}>🔄 Retours & Échanges sous 14j</span></li>
            <li><span style={{ color: 'var(--text-secondary)' }}>💳 Paiement 100% Sécurisé</span></li>
            <li><span style={{ color: 'var(--text-secondary)' }}>🎖️ Avantages Carte Askary</span></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 style={{ fontSize: '14px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Contact & Club</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={14} className="text-gradient" /> Complexe Sportif Moulay Abdallah, Rabat
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} className="text-gradient" /> contact@asfar.ma
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} className="text-gradient" /> +212 537 00 12 12
            </li>
          </ul>
        </div>
      </div>

      {/* Trademark rights copyright footer */}
      <div style={{
        maxWidth: '1200px',
        margin: '1.5rem auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        fontSize: '11px',
        color: 'var(--text-muted)'
      }}>
        <span>© {new Date().getFullYear()} ASFAR Boutique. Tous droits réservés.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Développé avec <Heart size={10} fill="var(--asfar-red)" color="var(--asfar-red)" /> pour le club de l'ASFAR
        </span>
      </div>
    </footer>
  );
};
export default Footer;
