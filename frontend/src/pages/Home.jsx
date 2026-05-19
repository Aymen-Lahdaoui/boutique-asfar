import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Award, ShieldAlert, Sparkles, TrendingUp, Star } from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  // Liste de secours (mock) de produits phares si le serveur backend n'est pas encore lancé
  const mockFeatured = [
    {
      id: 1,
      name: "Maillot Domicile Officiel ASFAR 2025/2026",
      description: "Le maillot officiel de l'ASFAR pour les matchs à domicile, arborant fièrement les bandes verticales traditionnelles Vert, Noir et Rouge.",
      price: 600.0,
      imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500",
      category: "MATCHDAY",
      stockQuantity: 50,
      personalizable: true
    },
    {
      id: 2,
      name: "Maillot Extérieur Premium Noir & Or",
      description: "Édition spéciale maillot extérieur. Design noir mat d'une élégance absolue avec des détails et flocages dorés scintillants.",
      price: 650.0,
      imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
      category: "MATCHDAY",
      stockQuantity: 30,
      personalizable: true
    },
    {
      id: 6,
      name: "Maillot Rétro Championnat 1985",
      description: "Réédition collector authentique du maillot de 1985. L'année historique de la première Ligue des Champions CAF du club.",
      price: 500.0,
      imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500",
      category: "HERITAGE",
      stockQuantity: 12,
      personalizable: true
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/products');
        setFeaturedProducts(response.data.slice(0, 3));
      } catch (err) {
        console.warn("API indisponible. Chargement des produits vedettes en local.");
        setFeaturedProducts(mockFeatured);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCollectionClick = (category) => {
    navigate('/shop', { state: { preFilteredCategory: category } });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }} className="animate-fade-in">
      
      {/* 1. Epic Hero Section */}
      <section className="glass-panel" style={{
        padding: '4.5rem 3rem',
        borderRadius: '24px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(7, 8, 10, 0.9) 0%, rgba(0, 107, 60, 0.25) 50%, rgba(210, 20, 58, 0.25) 100%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '4rem'
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-30%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 107, 60, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50%',
          right: '-30%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(210, 20, 58, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '1.25rem', padding: '0.4rem 0.8rem', fontSize: '10px' }}>
            <Sparkles size={12} /> NOUVELLE COLLECTION COMPLÈTE DISPONIBLE
          </span>
          <h1 className="text-gradient" style={{
            fontSize: '48px',
            fontWeight: '900',
            lineHeight: '1.15',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            letterSpacing: '-1px'
          }}>
            REJOIGNEZ LA FORCE <br />
            <span style={{ color: 'white' }}>DE L'ÉQUIPE MILITAIRE</span>
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: '1.7',
            maxWidth: '650px',
            margin: '0 auto 2.5rem auto'
          }}>
            Explorez les nouveaux équipements officiels de l'ASFAR. Personnalisez vos maillots avec notre outil de flocage interactif et profitez de remises exclusives réservées aux membres abonnés de l'esprit Askary.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-accent" style={{ padding: '0.9rem 2.25rem', fontSize: '15px' }}>
              Acheter Maintenant
            </Link>
            <button onClick={() => handleCollectionClick('MATCHDAY')} className="btn btn-secondary" style={{ padding: '0.9rem 2.25rem', fontSize: '15px' }}>
              Équipement Pro
            </button>
          </div>
        </div>
      </section>



      {/* 3. Featured Products Grid */}
      <section style={{ marginBottom: '4.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Star size={22} fill="var(--asfar-gold)" color="var(--asfar-gold)" /> Nouveautés Vedettes
          </h2>
          <Link to="/shop" style={{ color: 'var(--asfar-green)', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }} onMouseOver={(e)=>e.target.style.textDecoration='underline'} onMouseOut={(e)=>e.target.style.textDecoration='none'}>
            Voir tout le catalogue ➔
          </Link>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Chargement des nouveautés...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Trophies & Club History Shelf */}
      <section className="glass-panel" style={{
        padding: '3rem',
        borderRadius: '24px',
        textAlign: 'center',
        background: 'rgba(22, 28, 36, 0.45)',
        border: '1px solid var(--border-glass)'
      }}>
        <Award size={48} className="text-gradient" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{
          fontSize: '28px',
          fontWeight: '850',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          color: 'white'
        }}>
          LE PALMARÈS HISTORIQUE DES MILITAIRES
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '650px',
          margin: '0 auto 2.5rem auto'
        }}>
          L'ASFAR est l'un des clubs les plus titrés de l'histoire du football marocain. Fondé par décret royal en 1958, le club porte haut les valeurs de bravoure, de discipline, et de succès permanent.
        </p>

        {/* Trophies Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { count: '13', title: 'Botola Pro', desc: 'Championnats du Maroc' },
            { count: '12', title: 'Coupes du Trône', desc: 'Coupe Nationale' },
            { count: '1', title: 'Ligue des Champions', desc: 'CAF Champions League (1985)' },
            { count: '1', title: 'Coupe de la CAF', desc: 'Confederation Cup (2005)' }
          ].map((trophy, index) => (
            <div 
              key={index}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{
                fontSize: '36px',
                fontWeight: '900',
                color: 'var(--asfar-gold)',
                fontFamily: "'Outfit', sans-serif",
                textShadow: '0 0 10px rgba(212,175,55,0.25)'
              }}>
                {trophy.count}
              </div>
              <h4 style={{ color: 'white', fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>{trophy.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{trophy.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
export default Home;
