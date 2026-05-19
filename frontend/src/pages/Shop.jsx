import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, Shirt } from 'lucide-react';

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  const location = useLocation();

  // Liste de secours (mock) de produits si le serveur backend est éteint
  const mockProducts = [
    {
      id: 1,
      name: "Maillot officiel de compétition",
      description: "Le maillot officiel de l'ASFAR pour les matchs à domicile, arborant fièrement les couleurs traditionnelles. Doté de la technologie respirante haute performance.",
      price: 250.0,
      imageUrl: "/image/maillot 3c.jpg",
      category: "MATCHDAY",
      stockQuantity: 50,
      personalizable: true,
      sizes: "S,M,L,XL,XXL"
    },
    {
      id: 2,
      name: "Polo",
      description: "Polo officiel de sortie noir avec détails gris. Logo brodé, idéal pour un look élégant et sportif en dehors des terrains.",
      price: 230.0,
      imageUrl: "/image/maillot noir.jpg",
      category: "STREETWEAR",
      stockQuantity: 30,
      personalizable: false,
      sizes: "S,M,L,XL"
    },
    {
      id: 3,
      name: "Survêtement",
      description: "Veste d'entraînement officielle portée par l'équipe technique et les joueurs. Couleurs emblématiques et logo de l'ASFAR.",
      price: 550.0,
      imageUrl: "/image/veste.jpg",
      category: "STREETWEAR",
      stockQuantity: 20,
      personalizable: false,
      sizes: "M,L,XL"
    },
    {
      id: 4,
      name: "Jogging",
      description: "Veste légère pour l'échauffement d'avant-match. Design moderne et confortable pour les supporters.",
      price: 440.0,
      imageUrl: "/image/veste2.jpg",
      category: "STREETWEAR",
      stockQuantity: 25,
      personalizable: false,
      sizes: "S,M,L,XL"
    },
    {
      id: 5,
      name: "Polo",
      description: "Polo gris chiné officiel de la collection lifestyle. Confortable et élégant avec le blason du club brodé sur le cœur.",
      price: 230.0,
      imageUrl: "/image/maillot gris.jpg",
      category: "STREETWEAR",
      stockQuantity: 40,
      personalizable: false,
      sizes: "S,M,L"
    },
    {
      id: 6,
      name: "Maillot officiel de compétition",
      description: "Troisième maillot de compétition de la saison. Édition spéciale avec des détails de design uniques.",
      price: 250.0,
      imageUrl: "/image/maillot b3c.jpg",
      category: "MATCHDAY",
      stockQuantity: 15,
      personalizable: true,
      sizes: "S,M,L,XL"
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/products');
        setProducts(response.data);
      } catch (err) {
        console.warn("API indisponible. Chargement des produits en local.");
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Gérer le filtrage initial si redirection depuis l'accueil
  useEffect(() => {
    if (location.state && location.state.preFilteredCategory) {
      setSelectedCategory(location.state.preFilteredCategory);
    }
  }, [location]);

  // Filtrer les produits
  useEffect(() => {
    let result = products;

    // Filtre par catégorie
    if (selectedCategory !== 'ALL') {
      result = result.filter(product => product.category.toUpperCase() === selectedCategory.toUpperCase());
    }

    // Filtre par barre de recherche
    if (searchTerm.trim() !== '') {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, searchTerm]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }} className="animate-fade-in">
      
      {/* Page Title Header */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
          Le Catalogue <span className="text-gradient-askary">Askary</span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Explorez et achetez les équipements officiels pour soutenir les Militaires de Rabat.
        </p>
      </div>

      {/* Search & Category Filter Panel */}
      <div className="glass-panel" style={{
        padding: '1.25rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(22, 28, 36, 0.4)'
      }}>
        {/* Category Selection Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {['ALL', 'MATCHDAY', 'STREETWEAR', 'ACCESSOIRES', 'HERITAGE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '12px',
                borderRadius: '8px',
                background: selectedCategory === cat 
                  ? 'linear-gradient(135deg, var(--asfar-green), #00502c)'
                  : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                border: selectedCategory === cat 
                  ? '1px solid var(--asfar-green)'
                  : '1px solid var(--border-glass)',
                boxShadow: selectedCategory === cat ? 'var(--shadow-glow)' : 'none'
              }}
            >
              {cat === 'ALL' ? 'Tous les articles' : cat}
            </button>
          ))}
        </div>

        {/* Text Search Input Area */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '320px'
        }}>
          <input 
            type="text" 
            placeholder="Rechercher un maillot, veste..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              fontSize: '13px'
            }}
          />
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              top: '50%',
              left: '12px',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} 
          />
        </div>
      </div>

      {/* Product Grid Render */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          Chargement de l'armurerie Askary...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-panel animate-fade-in" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: '16px',
          color: 'var(--text-secondary)'
        }}>
          <Shirt size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
          <h3>Aucun équipement trouvé</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Aucun article ne correspond à votre recherche ou catégorie sélectionnée.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
            className="btn btn-primary"
            style={{ marginTop: '1.25rem', fontSize: '12px', padding: '0.5rem 1rem' }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="products-grid animate-fade-in">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
export default Shop;
