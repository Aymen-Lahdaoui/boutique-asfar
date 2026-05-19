import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { JerseyPreview } from '../components/JerseyPreview';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Sparkles, Check, LogIn } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Flocage states
  const [customName, setCustomName] = useState('');
  const [customNumber, setCustomNumber] = useState('');
  
  // Selection states
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Liste de secours en local (mock) pour tester immédiatement sans base active
  const mockProducts = [
    { id: 1, name: "Maillot Domicile Officiel ASFAR 2025/2026", description: "Le maillot officiel de l'ASFAR pour les matchs à domicile, arborant fièrement les bandes verticales traditionnelles Vert, Noir et Rouge. Doté de la technologie respirante haute performance AeroReady. Parfait pour les supporters.", price: 600.0, imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500", category: "MATCHDAY", stockQuantity: 50, personalizable: true, sizes: "S,M,L,XL,XXL" },
    { id: 2, name: "Maillot Extérieur Premium Noir & Or", description: "Édition spéciale maillot extérieur. Design noir mat d'une élégance absolue avec des détails et flocages dorés scintillants en hommage à l'histoire glorieuse du club militaire.", price: 650.0, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", category: "MATCHDAY", stockQuantity: 30, personalizable: true, sizes: "S,M,L,XL" },
    { id: 3, name: "Veste de Survêtement Askary", description: "Veste d'entraînement officielle portée par l'équipe technique et les joueurs. Col montant rétro, fermeture éclair intégrale, couleurs emblématiques et logo de l'ASFAR brodé sur le cœur.", price: 450.0, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", category: "STREETWEAR", stockQuantity: 20, personalizable: false, sizes: "M,L,XL" },
    { id: 4, name: "Écharpe Supporters \"ALWAYS ASFAR\"", description: "Écharpe officielle de haute qualité pour les matchs au stade. En maille double épaisseur avec franges rouges, noires et vertes et inscription tissée.", price: 100.0, imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500", category: "ACCESSOIRES", stockQuantity: 100, personalizable: false, sizes: "Taille Unique" },
    { id: 5, name: "Casquette Noire Askary Officielle", description: "Casquette de baseball en coton brossé noir, ornée du blason du club brodé en 3D à l'avant et dotée d'une boucle de serrage métallique.", price: 150.0, imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500", category: "ACCESSOIRES", stockQuantity: 40, personalizable: false, sizes: "Taille Unique" },
    { id: 6, name: "Maillot Rétro Championnat 1985", description: "Réédition collector authentique du maillot de 1985. L'année historique où l'ASFAR est devenu le tout premier club marocain à remporter la Coupe des Clubs Champions Africains (CAF).", price: 500.0, imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500", category: "HERITAGE", stockQuantity: 12, personalizable: true, sizes: "S,M,L,XL" }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.warn("API indisponible, chargement du produit local.");
        const found = mockProducts.find(p => p.id.toString() === id.toString());
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Définir la taille par défaut dès le chargement du produit
  useEffect(() => {
    if (product && product.sizes) {
      const sizeList = product.sizes.split(',');
      setSelectedSize(sizeList[0]);
    }
  }, [product]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-muted)' }}>Chargement du vestiaire Askary...</div>;
  }

  if (!product) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }} className="glass-panel">
        <h2>Équipement introuvable</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>Cet article a peut-être été retiré ou n'existe plus.</p>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>Retour au catalogue</Link>
      </div>
    );
  }

  const sizesArray = product.sizes ? product.sizes.split(',') : ['Taille Unique'];
  const isOutOfStock = product.stockQuantity <= 0;

  // Calcul du prix en direct (+50 DH si flocage personnalisé actif)
  const isFlocked = product.personalizable && customName.trim() !== '';
  const finalPrice = isFlocked ? product.price + 50.0 : product.price;

  const handleNameChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, '');
    if (value.length <= 12) setCustomName(value);
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
      setCustomNumber(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedSize, customName, customNumber);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000); // Cacher la notification au bout de 3 secondes
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }} className="animate-fade-in">
      
      {/* Back button */}
      <Link to="/shop" style={{
        textDecoration: 'none',
        color: 'var(--text-secondary)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '2rem'
      }} onMouseOver={(e)=>e.target.style.color='white'} onMouseOut={(e)=>e.target.style.color='var(--text-secondary)'}>
        <ArrowLeft size={16} /> Retour à la Boutique
      </Link>

      {/* Two Column Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '3rem',
        alignItems: 'start'
      }}>
        
        {/* COLUMN 1: Live Interactive Jersey Flocage or Standard Product Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {product.personalizable ? (
            <div style={{ position: 'relative' }}>
              <JerseyPreview 
                name={customName} 
                number={customNumber} 
                type={
                  product.name.toLowerCase().includes('third') ? 'THIRD' :
                  product.name.toLowerCase().includes('extérieur') ? 'AWAY' : 'HOME'
                } 
              />
            </div>
          ) : (
            <div className="glass-panel" style={{
              borderRadius: '24px',
              overflow: 'hidden',
              height: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'black',
              border: '1px solid var(--border-glass)'
            }}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          )}
        </div>

        {/* COLUMN 2: Checkout Info Form panel */}
        <div className="glass-panel animate-fade-in" style={{
          padding: '2.5rem',
          borderRadius: '24px',
          background: 'rgba(22, 28, 36, 0.45)'
        }}>
          {/* Header Description */}
          <span className="badge badge-gold" style={{ fontSize: '9px', marginBottom: '8px' }}>
            {product.category}
          </span>
          <h2 style={{ fontSize: '28px', color: 'white', fontWeight: '800', lineHeight: '1.25', marginBottom: '10px' }}>
            {product.name}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <span style={{
              fontSize: '28px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '800',
              color: 'white'
            }}>
              {finalPrice}
            </span>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>DH</span>
            {isFlocked && (
              <span className="badge badge-gold" style={{ fontSize: '8px', padding: '2px 6px', marginLeft: '6px' }}>
                +50 DH Flocage Inclus
              </span>
            )}
          </div>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }} />

          {/* Size Pills Selectors */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '13px', color: 'white', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
              Choisir une taille :
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sizesArray.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className="btn"
                  style={{
                    minWidth: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    padding: 0,
                    fontSize: '13px',
                    fontWeight: '700',
                    background: selectedSize === size 
                      ? 'linear-gradient(135deg, var(--asfar-green), #00502c)'
                      : 'rgba(255,255,255,0.03)',
                    color: selectedSize === size ? 'white' : 'var(--text-secondary)',
                    border: selectedSize === size 
                      ? '1px solid var(--asfar-green)'
                      : '1px solid var(--border-glass)',
                    boxShadow: selectedSize === size ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Flocage customizer form - Rendered only if personalizable */}
          {product.personalizable && (
            <div style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '1.25rem',
              borderRadius: '16px',
              marginBottom: '1.75rem'
            }}>
              <h4 style={{ fontSize: '13px', color: 'var(--asfar-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> Flocage Personnalisé
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                Saisissez votre nom et numéro ci-dessous pour voir l'aperçu en direct de votre maillot de l'ASFAR.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '11px' }}>NOM DE JOUEUR (A-Z)</label>
                  <input 
                    type="text" 
                    placeholder="E.g., AYMANE" 
                    value={customName}
                    onChange={handleNameChange}
                    className="form-input"
                    style={{ fontSize: '12px', padding: '0.65rem' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '11px' }}>NUMÉRO (0-99)</label>
                  <input 
                    type="text" 
                    placeholder="12" 
                    value={customNumber}
                    onChange={handleNumberChange}
                    className="form-input"
                    style={{ fontSize: '12px', padding: '0.65rem', textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Order Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Quantity select */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Qte</label>
                <select 
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="form-input"
                  style={{
                    width: '64px',
                    padding: '0.65rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px'
                  }}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n} style={{ background: '#1a202c', color: 'white' }}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to basket CTA button */}
            <button 
              onClick={handleAddToCart}
              className={`btn ${!user ? 'btn-secondary' : 'btn-primary'}`}
              disabled={isOutOfStock && user}
              style={{
                flexGrow: 1,
                padding: '0.85rem',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: (isOutOfStock && user) ? 'none' : 'var(--shadow-glow)',
                alignSelf: 'flex-end'
              }}
            >
              {!user ? (
                <>
                  <LogIn size={16} /> Connectez-vous pour acheter
                </>
              ) : isOutOfStock ? (
                <>
                  <ShoppingCart size={16} /> Rupture de Stock
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Ajouter au Panier
                </>
              )}
            </button>
          </div>

          {/* Alert checkmark Success notice popup */}
          {addedNotice && (
            <div className="glass-panel animate-fade-in" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0, 107, 60, 0.9)',
              border: '1px solid rgba(0, 107, 60, 0.4)',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              marginTop: '1.5rem',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Check size={16} style={{ color: 'white' }} />
              <div style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>
                L'article a été ajouté avec succès à votre panier Askary !
              </div>
            </div>
          )}

          {/* Secure Trust details */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: '11px',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={14} className="text-gradient" />
            <span>Paiement sécurisé Askary • Livraison express • Produit officiel ASFAR</span>
          </div>

        </div>

      </div>

    </div>
  );
};
export default ProductDetail;
