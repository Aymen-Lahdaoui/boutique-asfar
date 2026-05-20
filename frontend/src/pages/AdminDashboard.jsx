import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart3, Package, Users, ShieldAlert, Plus, Trash2, Edit, Save, ArrowDown, ChevronRight, Check, X, Search, Printer, Tag, Eye, PieChart, Info } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect guard if not a staff member
  useEffect(() => {
    const isStaff = user && ['ADMIN', 'LOGISTICS', 'MARKETING', 'SUPPORT', 'RESPO', 'ADMIN_RESPO'].includes(user.role);
    if (!authLoading && (!user || !isStaff)) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic allowed tabs based on user role
  const allowedTabs = (() => {
    if (!user) return [];
    if (user.role === 'ADMIN' || user.role === 'RESPO' || user.role === 'ADMIN_RESPO') return ['products', 'orders', 'analytics'];
    if (user.role === 'LOGISTICS') return ['analytics'];
    if (user.role === 'MARKETING') return ['products', 'analytics'];
    if (user.role === 'SUPPORT') return ['orders'];
    return [];
  })();

  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    if (user && allowedTabs.length > 0 && !allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [user, allowedTabs, activeTab]);

  // Product Create states (Pre-filled with logical defaults to avoid placeholder confusion)
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('250');
  const [newProductImg, setNewProductImg] = useState('https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500');
  const [newProductCat, setNewProductCat] = useState('MATCHDAY');
  const [newProductStock, setNewProductStock] = useState('10');
  const [newProductSizes, setNewProductSizes] = useState('S,M,L,XL');
  const [newProductPerso, setNewProductPerso] = useState(false);
  const [crudNotice, setCrudNotice] = useState('');

  // Product Edit states
  const [editingProductId, setEditingProductId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSizes, setEditSizes] = useState('');
  const [editPersonalizable, setEditPersonalizable] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState('');

  // Order Details expanded state
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Flocage / Analytics states
  const [flocageSearch, setFlocageSearch] = useState('');
  const [flocageFilter, setFlocageFilter] = useState('all'); // 'all', 'pending', 'ready'
  const [printingFlocage, setPrintingFlocage] = useState(null);
  const [viewingJersey, setViewingJersey] = useState(null);

  // Fallback mocks
  const mockProducts = [
    { id: 1, name: "Maillot Domicile Officiel ASFAR 2025/2026", description: "Le maillot officiel de l'ASFAR pour les matchs à domicile, arborant fièrement les bandes verticales traditionnelles Vert, Noir et Rouge.", price: 600.0, imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500", category: "MATCHDAY", stockQuantity: 50, personalizable: true, sizes: "S,M,L,XL,XXL" },
    { id: 2, name: "Maillot Extérieur Premium Noir & Or", description: "Édition spéciale maillot extérieur. Design noir mat d'une élégance absolue avec des détails et flocages dorés scintillants.", price: 650.0, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", category: "MATCHDAY", stockQuantity: 30, personalizable: true, sizes: "S,M,L,XL" },
    { id: 3, name: "Veste de Survêtement Askary", description: "Veste d'entraînement et de rue officielle ASFAR, confortable et coupe-vent.", price: 450.0, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", category: "STREETWEAR", stockQuantity: 2, personalizable: false, sizes: "M,L,XL" },
    { id: 4, name: "Écharpe Club Askary 1958", description: "Écharpe officielle de supporter avec franges dorées et inscriptions brodées.", price: 120.0, imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500", category: "ACCESSOIRES", stockQuantity: 100, personalizable: false, sizes: "Taille Unique" },
    { id: 6, name: "Maillot Rétro Championnat 1985", description: "Réédition collector authentique du maillot de 1985. L'année historique de la première Ligue des Champions CAF du club.", price: 500.0, imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500", category: "HERITAGE", stockQuantity: 12, personalizable: true, sizes: "M,L,XL" }
  ];

  const mockOrders = [
    {
      id: 101,
      user: { username: "Aymane Askary", email: "client@askary.ma", subscriber: true },
      totalPrice: 1080.0,
      discountAmount: 120.0,
      status: "PAID",
      shippingAddress: "12 Rue de la Botola, Rabat (Tél: 0661234567)",
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 1,
          quantity: 2,
          price: 600.0,
          size: "L",
          customName: "AYMANE",
          customNumber: 12,
          product: { id: 1, name: "Maillot Domicile Officiel ASFAR 2025/2026", category: "MATCHDAY" }
        }
      ]
    },
    {
      id: 102,
      user: { username: "Med Askary 12", email: "abonne@askary.ma", subscriber: false },
      totalPrice: 650.0,
      discountAmount: 0.0,
      status: "SHIPPED",
      shippingAddress: "Complexe Moulay Abdallah, Salé (Tél: 0670001958)",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      items: [
        {
          id: 2,
          quantity: 1,
          price: 650.0,
          size: "XL",
          customName: "EL KHALLIL",
          customNumber: 9,
          product: { id: 2, name: "Maillot Extérieur Premium Noir & Or", category: "MATCHDAY" }
        }
      ]
    },
    {
      id: 103,
      user: { username: "Reda Askary", email: "reda@askary.ma", subscriber: true },
      totalPrice: 513.0,
      discountAmount: 57.0,
      status: "PAID",
      shippingAddress: "Avenue Hassan II, Temara (Tél: 0663456789)",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      items: [
        {
          id: 3,
          quantity: 1,
          price: 450.0,
          size: "M",
          product: { id: 3, name: "Veste de Survêtement Askary", category: "STREETWEAR" }
        },
        {
          id: 4,
          quantity: 1,
          price: 120.0,
          size: "Taille Unique",
          product: { id: 4, name: "Écharpe Club Askary 1958", category: "ACCESSOIRES" }
        }
      ]
    },
    {
      id: 104,
      user: { username: "Youssef Rabat", email: "youssef@gmail.com", subscriber: false },
      totalPrice: 1200.0,
      discountAmount: 0.0,
      status: "PENDING",
      shippingAddress: "Quartier Agdal, Rabat (Tél: 0664567890)",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      items: [
        {
          id: 5,
          quantity: 2,
          price: 600.0,
          size: "S",
          customName: "ASKARY",
          customNumber: 12,
          product: { id: 1, name: "Maillot Domicile Officiel ASFAR 2025/2026", category: "MATCHDAY" }
        }
      ]
    },
    {
      id: 105,
      user: { username: "Hamza Military", email: "hamza@military.ma", subscriber: true },
      totalPrice: 450.0,
      discountAmount: 50.0,
      status: "PAID",
      shippingAddress: "Hay Riad, Rabat (Tél: 0665678901)",
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      items: [
        {
          id: 6,
          quantity: 1,
          price: 500.0,
          size: "L",
          customName: "SOUFIANE",
          customNumber: 7,
          product: { id: 6, name: "Maillot Rétro Championnat 1985", category: "HERITAGE" }
        }
      ]
    }
  ];

  const refreshData = async () => {
    try {
      const prodRes = await axios.get('http://localhost:8082/api/products');
      setProducts(prodRes.data);
      
      const ordRes = await axios.get('http://localhost:8082/api/orders');
      setOrders(ordRes.data);
    } catch (err) {
      console.warn("API indisponible. Chargement des données d'administration locales.");
      setProducts(JSON.parse(localStorage.getItem('askary_products')) || mockProducts);
      setOrders(JSON.parse(localStorage.getItem('askary_orders')) || mockOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Garder le localstorage à jour si on est hors ligne
  const saveLocalState = (prods, ords) => {
    localStorage.setItem('askary_products', JSON.stringify(prods));
    localStorage.setItem('askary_orders', JSON.stringify(ords));
  };

  // 1. Ajouter un produit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setCrudNotice('');

    if (!newProductName || !newProductPrice || !newProductImg) {
      setCrudNotice("❌ Veuillez remplir le nom, prix et image.");
      return;
    }

    const payload = {
      name: newProductName,
      description: newProductDesc,
      price: parseFloat(newProductPrice),
      imageUrl: newProductImg,
      category: newProductCat.toUpperCase(),
      stockQuantity: parseInt(newProductStock),
      sizes: newProductSizes,
      personalizable: newProductPerso
    };

    try {
      await axios.post('http://localhost:8082/api/products', payload);
      setCrudNotice("✅ Produit créé avec succès !");
      refreshData();
    } catch (err) {
      console.warn("API hors ligne, création en local.");
      const newProd = {
        ...payload,
        id: Date.now()
      };
      const updated = [...products, newProd];
      setProducts(updated);
      saveLocalState(updated, orders);
      setCrudNotice("✅ Produit créé en local !");
    }

    // Réinitialiser les champs (avec les valeurs pré-remplies par défaut)
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice('250');
    setNewProductImg('https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500');
    setNewProductStock('10');
    setNewProductPerso(false);
  };

  // 2. Supprimer un produit
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article du catalogue ?")) return;

    try {
      await axios.delete(`http://localhost:8082/api/products/${id}`);
      refreshData();
    } catch (err) {
      console.warn("API hors ligne, suppression en local.");
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveLocalState(updated, orders);
    }
  };

  // 3. Modifier le stock d'un produit (directement)
  const handleStockUpdate = async (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const payload = { ...prod, stockQuantity: newStock };

    try {
      await axios.put(`http://localhost:8082/api/products/${id}`, payload);
      refreshData();
    } catch (err) {
      console.warn("API hors ligne, mise à jour du stock locale.");
      const updated = products.map(p => p.id === id ? { ...p, stockQuantity: newStock } : p);
      setProducts(updated);
      saveLocalState(updated, orders);
    }
  };

  // 3b. Gestion de l'édition directe des produits
  const startEdit = (product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditStock(product.stockQuantity.toString());
    setEditCategory(product.category);
    setEditDescription(product.description || '');
    setEditSizes(product.sizes || '');
    setEditPersonalizable(product.personalizable || false);
    setEditImageUrl(product.imageUrl || '');
  };

  const handleSaveEdit = async (id) => {
    setCrudNotice('');
    if (!editName || !editPrice) {
      setCrudNotice("❌ Veuillez remplir le nom et le prix.");
      return;
    }

    const originalProduct = products.find(p => p.id === id);
    if (!originalProduct) return;

    const payload = {
      ...originalProduct,
      name: editName,
      price: parseFloat(editPrice),
      stockQuantity: parseInt(editStock) || 0,
      category: editCategory.toUpperCase(),
      description: editDescription,
      sizes: editSizes,
      personalizable: editPersonalizable,
      imageUrl: editImageUrl
    };

    try {
      await axios.put(`http://localhost:8082/api/products/${id}`, payload);
      setCrudNotice("✅ Produit mis à jour avec succès !");
      setEditingProductId(null);
      refreshData();
    } catch (err) {
      console.warn("API hors ligne, modification en local.");
      const updated = products.map(p => p.id === id ? { ...payload, id } : p);
      setProducts(updated);
      saveLocalState(updated, orders);
      setCrudNotice("✅ Produit mis à jour en local !");
      setEditingProductId(null);
    }
  };

  // 4. Mettre à jour le statut d'une commande
  const handleOrderStatusUpdate = async (id, nextStatus) => {
    try {
      await axios.put(`http://localhost:8082/api/orders/${id}/status`, { status: nextStatus });
      refreshData();
    } catch (err) {
      console.warn("API hors ligne, mise à jour locale du statut de commande.");
      const updatedOrders = orders.map(o => o.id === id ? { ...o, status: nextStatus } : o);
      setOrders(updatedOrders);
      saveLocalState(products, updatedOrders);
    }
  };

  // Sécurité Guard
  if (authLoading) {
    return <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-muted)' }}>Vérification de l'habilitation Askary...</div>;
  }

  const isStaff = user && ['ADMIN', 'LOGISTICS', 'MARKETING', 'SUPPORT', 'RESPO', 'ADMIN_RESPO'].includes(user.role);

  if (!user || !isStaff) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', padding: '2rem' }} className="glass-panel text-center animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--asfar-red)', margin: '0 auto 1rem auto' }} />
        <h2 style={{ color: 'white', fontWeight: '800' }}>Accès Interdit</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '13px' }}>
          Cette zone d'administration est strictement réservée au personnel habilité de l'ASFAR. Veuillez vous connecter avec un compte autorisé.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>Se connecter</Link>
      </div>
    );
  }

  if (['RESPO', 'ADMIN_RESPO'].includes(user.role)) {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', padding: '3rem 2rem' }} className="glass-panel text-center animate-fade-in">
        <ShieldAlert size={54} style={{ color: 'var(--asfar-gold)', margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ color: 'white', fontWeight: '800', fontSize: '24px' }}>🔒 Accès Restreint</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '14px', lineHeight: '1.6' }}>
          Votre compte <strong style={{ color: 'var(--asfar-gold)' }}>{user.role === 'RESPO' ? 'Responsable (Respo)' : 'Admin des Responsables'}</strong> est connecté avec succès.
        </p>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '13px', lineHeight: '1.6' }}>
          Cependant, vos privilèges actuels ne vous autorisent pas à visualiser le site public (Accueil & Boutique) ni les outils de gestion du Back-Office.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            className="btn btn-secondary" 
            style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  // Calculs statistiques
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= 5).length;

  // Calculs d'analyses avancées
  const computeAnalytics = () => {
    let salesByCategory = { MATCHDAY: 0, STREETWEAR: 0, ACCESSOIRES: 0, HERITAGE: 0 };
    let flocageDemands = [];
    let salesByDay = {};
    let subscriberSalesCount = 0;

    // Initialiser les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateString = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      salesByDay[dateString] = 0;
    }

    orders.forEach(order => {
      const isSub = order.user?.subscriber || (order.discountAmount && order.discountAmount > 0);
      if (isSub) {
        subscriberSalesCount++;
      }

      // Tendance temporelle
      const orderDate = new Date(order.createdAt);
      const dateString = orderDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      if (salesByDay[dateString] !== undefined) {
        salesByDay[dateString] += order.totalPrice;
      }

      // Catégories & Flocages
      const itemsList = order.items || [];
      itemsList.forEach(item => {
        const prod = item.product || {};
        const cat = prod.category || 'STREETWEAR';
        const priceSold = item.price || prod.price || 0;
        const qty = item.quantity || 1;

        if (salesByCategory[cat] !== undefined) {
          salesByCategory[cat] += priceSold * qty;
        } else {
          salesByCategory['STREETWEAR'] += priceSold * qty;
        }

        if (item.customName || item.customNumber !== undefined) {
          flocageDemands.push({
            id: order.id + '-' + item.id + '-' + (item.customName || ''),
            orderId: order.id,
            productName: prod.name || 'Maillot Officiel',
            customName: item.customName || '',
            customNumber: item.customNumber !== undefined ? item.customNumber : '',
            size: item.size || 'L',
            quantity: qty,
            status: order.status,
            customerName: order.user?.username || 'Supporter',
            createdAt: order.createdAt
          });
        }
      });
    });

    // Top Flocages
    let flocageAgg = {};
    flocageDemands.forEach(fd => {
      const key = `${fd.customName.toUpperCase().trim()}-${fd.customNumber}`;
      if (!flocageAgg[key]) {
        flocageAgg[key] = {
          name: fd.customName.toUpperCase().trim(),
          number: fd.customNumber,
          count: 0
        };
      }
      flocageAgg[key].count += fd.quantity;
    });

    const topFlocages = Object.values(flocageAgg)
      .filter(f => f.name !== '' || f.number !== '')
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageOrderValue = orders.length > 0 ? (totalRevenue / orders.length) : 0;
    const subscriberSharePercent = orders.length > 0 ? (subscriberSalesCount / orders.length) * 100 : 0;

    return {
      salesByCategory,
      flocageDemands,
      salesByDay,
      topFlocages,
      averageOrderValue,
      subscriberSharePercent
    };
  };

  const analytics = computeAnalytics();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }} className="animate-fade-in">
      
      {/* Dashboard Title Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
            🛡️ Bureau Major <span className="text-gradient-askary">Back-Office</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Gestion des troupes de stock, pilotage des commandes et rapports de vente ASFAR.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
          {allowedTabs.includes('products') && (
            <button 
              onClick={() => setActiveTab('products')} 
              className="btn" 
              style={{
                padding: '0.4rem 1rem', fontSize: '12px', borderRadius: '8px',
                background: activeTab === 'products' ? 'var(--asfar-green)' : 'none',
                color: 'white', border: 'none'
              }}
            >
              <Package size={14} /> Stocks & CRUD
            </button>
          )}
          {allowedTabs.includes('orders') && (
            <button 
              onClick={() => setActiveTab('orders')} 
              className="btn" 
              style={{
                padding: '0.4rem 1rem', fontSize: '12px', borderRadius: '8px',
                background: activeTab === 'orders' ? 'var(--asfar-green)' : 'none',
                color: 'white', border: 'none'
              }}
            >
              <BarChart3 size={14} /> Ventes & Commandes
            </button>
          )}
          {allowedTabs.includes('analytics') && (
            <button 
              onClick={() => setActiveTab('analytics')} 
              className="btn" 
              style={{
                padding: '0.4rem 1rem', fontSize: '12px', borderRadius: '8px',
                background: activeTab === 'analytics' ? 'var(--asfar-green)' : 'none',
                color: 'white', border: 'none'
              }}
            >
              <PieChart size={14} /> Analyses & Flocages
            </button>
          )}
        </div>
      </div>

      {/* KPI STATISTICS WIDGETS SECTION */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Card 1: Revenu (ADMIN, MARKETING) */}
        {/* Card 1: Revenu (ADMIN, MARKETING, RESPO, ADMIN_RESPO) */}
        {['ADMIN', 'MARKETING', 'RESPO', 'ADMIN_RESPO'].includes(user.role) && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--asfar-gold)', padding: '10px', borderRadius: '12px' }}><BarChart3 size={24} /></div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Revenu Global</span>
              <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{totalRevenue.toFixed(1)} DH</h3>
            </div>
          </div>
        )}

        {/* Card 2: Commandes (ADMIN, MARKETING, SUPPORT, RESPO, ADMIN_RESPO) */}
        {['ADMIN', 'MARKETING', 'SUPPORT', 'RESPO', 'ADMIN_RESPO'].includes(user.role) && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
            <div style={{ background: 'rgba(0, 107, 60, 0.15)', color: 'var(--asfar-green)', padding: '10px', borderRadius: '12px' }}><Users size={24} /></div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Ventes Enregistrées</span>
              <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{orders.length} Commandes</h3>
            </div>
          </div>
        )}

        {/* Card 3: Alertes Stocks (ADMIN, MARKETING, RESPO, ADMIN_RESPO) */}
        {['ADMIN', 'MARKETING', 'RESPO', 'ADMIN_RESPO'].includes(user.role) && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(210, 20, 58, 0.15)', border: lowStockCount > 0 ? '1px solid rgba(210, 20, 58, 0.35)' : '1px solid var(--border-glass)' }}>
            <div style={{ background: 'rgba(210, 20, 58, 0.15)', color: 'var(--asfar-red)', padding: '10px', borderRadius: '12px' }}><Package size={24} /></div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Alertes Stocks Bas</span>
              <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{lowStockCount} Produits</h3>
            </div>
          </div>
        )}

        {/* Card 4: Flocages Totaux (ADMIN, LOGISTICS, RESPO, ADMIN_RESPO) */}
        {['ADMIN', 'LOGISTICS', 'RESPO', 'ADMIN_RESPO'].includes(user.role) && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--asfar-gold)', padding: '10px', borderRadius: '12px' }}><Printer size={24} /></div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Maillots à Floquer</span>
              <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{analytics.flocageDemands.length} Flocages</h3>
            </div>
          </div>
        )}

        {/* Card 5: Flocages En Attente (ADMIN, LOGISTICS, RESPO, ADMIN_RESPO) */}
        {['ADMIN', 'LOGISTICS', 'RESPO', 'ADMIN_RESPO'].includes(user.role) && (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
            <div style={{ background: 'rgba(225, 29, 72, 0.15)', color: 'var(--asfar-red)', padding: '10px', borderRadius: '12px' }}><Tag size={24} /></div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Flocages En Attente</span>
              <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>
                {analytics.flocageDemands.filter(f => f.status === 'PENDING' || f.status === 'pending').length} Pièces
              </h3>
            </div>
          </div>
        )}
      </section>

      {/* CONDITIONAL RENDER BY ACTIVE TAB */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Synchro administrative en cours...</div>
      ) : activeTab === 'products' ? (
        
        /* TAB 1: PRODUCT CATALOG MANAGEMENT */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Products List Grid */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '1.5rem' }}>📦 Gestion du Catalogue ({products.length} articles)</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '8px' }}>PRODUIT</th>
                  <th style={{ padding: '8px' }}>PRIX</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>STOCK</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', height: '56px' }}>
                    {editingProductId === product.id ? (
                      <>
                        {/* EDITING MODE ROW */}
                        <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={editImageUrl} alt="" style={{ width: '36px', height: '42px', objectFit: 'cover', borderRadius: '4px', background: 'black' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
                            <input 
                              type="text" 
                              value={editName} 
                              onChange={e => setEditName(e.target.value)} 
                              className="form-input" 
                              style={{ fontSize: '12px', padding: '4px 8px', width: '100%', background: '#10141d', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px' }} 
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <select 
                                value={editCategory} 
                                onChange={e => setEditCategory(e.target.value)} 
                                className="form-input" 
                                style={{ fontSize: '10px', padding: '2px 6px', background: '#10141d', color: 'var(--asfar-gold)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '4px', width: 'fit-content' }}
                              >
                                {['MATCHDAY', 'STREETWEAR', 'ACCESSOIRES', 'HERITAGE'].map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                              <label style={{ fontSize: '10px', color: 'white', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                <input 
                                  type="checkbox" 
                                  checked={editPersonalizable} 
                                  onChange={e => setEditPersonalizable(e.target.checked)} 
                                  style={{ accentColor: 'var(--asfar-green)', cursor: 'pointer', width: '13px', height: '13px' }}
                                />
                                👕 Flocage
                              </label>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input 
                              type="number" 
                              value={editPrice} 
                              onChange={e => setEditPrice(e.target.value)} 
                              className="form-input" 
                              style={{ fontSize: '12px', padding: '4px 8px', width: '70px', background: '#10141d', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontWeight: 'bold' }} 
                            />
                            <span style={{ color: 'white', fontWeight: 'bold' }}>DH</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <input 
                            type="number" 
                            value={editStock} 
                            onChange={e => setEditStock(e.target.value)} 
                            className="form-input" 
                            style={{ fontSize: '12px', padding: '4px 8px', width: '60px', background: '#10141d', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }} 
                          />
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              onClick={() => handleSaveEdit(product.id)}
                              className="btn"
                              style={{ padding: '4px 8px', background: 'rgba(46, 204, 113, 0.15)', border: '1px solid rgba(46, 204, 113, 0.3)', borderRadius: '6px', color: '#2ecc71', cursor: 'pointer' }}
                              title="Enregistrer"
                            >
                              <Check size={13} />
                            </button>
                            <button 
                              onClick={() => setEditingProductId(null)}
                              className="btn"
                              style={{ padding: '4px 8px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                              title="Annuler"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* NORMAL VIEW ROW */}
                        <td style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={product.imageUrl} alt="" style={{ width: '36px', height: '42px', objectFit: 'cover', borderRadius: '4px', background: 'black' }} />
                          <div>
                            <strong style={{ color: 'white', display: 'block' }}>{product.name}</strong>
                            <span style={{ fontSize: '10px', color: 'var(--asfar-gold)' }}>{product.category}</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px', fontWeight: 'bold', color: 'white' }}>{product.price} DH</td>
                        
                        {/* Inline Stock Increment/Decrement Controls */}
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <button 
                              onClick={() => handleStockUpdate(product.id, product.stockQuantity, -1)}
                              style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{
                              fontWeight: 'bold', width: '28px', display: 'inline-block',
                              color: product.stockQuantity <= 0 ? 'var(--asfar-red)' : product.stockQuantity <= 5 ? 'var(--asfar-gold)' : '#2ecc71'
                            }}>
                              {product.stockQuantity}
                            </span>
                            <button 
                              onClick={() => handleStockUpdate(product.id, product.stockQuantity, 1)}
                              style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Edit and Delete Actions */}
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <button 
                              onClick={() => startEdit(product)}
                              className="btn"
                              style={{ padding: '4px 8px', background: 'rgba(52, 152, 219, 0.1)', border: '1px solid rgba(52, 152, 219, 0.2)', borderRadius: '6px', color: '#3498db', cursor: 'pointer' }}
                              title="Modifier"
                            >
                              <Edit size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="btn"
                              style={{ padding: '4px 8px', background: 'rgba(210, 20, 58, 0.1)', border: '1px solid rgba(210, 20, 58, 0.2)', borderRadius: '6px', color: 'var(--asfar-red)', cursor: 'pointer' }}
                              title="Supprimer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form to Append Product */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
            <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={18} className="text-gradient" /> Ajouter un Équipement
            </h3>
            
            {crudNotice && (
              <div style={{
                fontSize: '12px', padding: '8px 12px', borderRadius: '8px', marginBottom: '1rem',
                background: crudNotice.startsWith('✅') ? 'rgba(46, 204, 113, 0.15)' : 'rgba(210, 20, 58, 0.15)',
                color: crudNotice.startsWith('✅') ? '#2ecc71' : '#f87171',
                border: crudNotice.startsWith('✅') ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(210, 20, 58, 0.3)'
              }}>
                {crudNotice}
              </div>
            )}

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>NOM DE L'ARTICLE</label>
                <input type="text" placeholder="E.g., Sweat Capuche Ultras Askary" value={newProductName} onChange={e=>setNewProductName(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>DESCRIPTION</label>
                <textarea placeholder="Description détaillée..." value={newProductDesc} onChange={e=>setNewProductDesc(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem', height: '60px', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>PRIX (DH)</label>
                  <input type="number" placeholder="250" value={newProductPrice} onChange={e=>setNewProductPrice(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>STOCK INITIAL</label>
                  <input type="number" placeholder="10" value={newProductStock} onChange={e=>setNewProductStock(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>URL DE L'IMAGE</label>
                <input type="text" placeholder="https://images.unsplash.com/..." value={newProductImg} onChange={e=>setNewProductImg(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>CATÉGORIE</label>
                  <select value={newProductCat} onChange={e=>setNewProductCat(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem', background: '#10141d', color: 'white' }}>
                    {['MATCHDAY', 'STREETWEAR', 'ACCESSOIRES', 'HERITAGE'].map(c=>(
                      <option key={c} value={c} style={{ background: '#10141d', color: 'white' }}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>TAILLES DISPONIBLES</label>
                  <input type="text" placeholder="S,M,L,XL" value={newProductSizes} onChange={e=>setNewProductSizes(e.target.value)} className="form-input" style={{ fontSize: '12px', padding: '0.6rem' }} />
                </div>
              </div>

              {/* Flocage toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0' }}>
                <input 
                  type="checkbox" 
                  id="persoCheck"
                  checked={newProductPerso}
                  onChange={e=>setNewProductPerso(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--asfar-green)' }}
                />
                <label htmlFor="persoCheck" style={{ fontSize: '12px', color: 'white', fontWeight: '500', cursor: 'pointer' }}>
                  👕 Activer l'outil de flocage personnalisé
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '13px', marginTop: '4px' }}>
                Créer l'Article
              </button>
            </form>
          </div>

        </div>
      ) : activeTab === 'orders' ? (
        
        /* TAB 2: ORDER TRACKING LOGS */
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '1.5rem' }}>📋 Suivi des Commandes et Logistique</h3>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucune vente enregistrée pour le moment.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px' }}>COMMANDE ID</th>
                  <th style={{ padding: '10px' }}>CLIENT / DESTINATAIRE</th>
                  <th style={{ padding: '10px' }}>DATE</th>
                  <th style={{ padding: '10px' }}>TOTAL A PAYER</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>STATUT</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>LOGISTIQUE ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', height: '60px' }}>
                      <td style={{ padding: '10px', color: 'white', fontWeight: 'bold' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button 
                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                            title="Voir les détails"
                          >
                            <ChevronRight size={16} style={{ transform: expandedOrderId === order.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                          </button>
                          #{order.id}
                        </div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <strong style={{ color: 'white', display: 'block' }}>{order.user?.username || 'Client Askary'}</strong>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>{order.shippingAddress}</span>
                      </td>
                      <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: 'var(--asfar-gold)' }}>{order.totalPrice} DH</td>
                      
                      {/* Status Counter */}
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span className={`badge ${
                          order.status === 'SHIPPED' ? 'badge-green' : order.status === 'PAID' ? 'badge-gold' : 'badge-red'
                        }`} style={{ fontSize: '8px' }}>
                          {order.status === 'SHIPPED' ? 'Expédiée' : order.status === 'PAID' ? 'Payée' : 'En Attente'}
                        </span>
                      </td>

                      {/* Logistics toggle state button */}
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          {order.status === 'PENDING' && (
                            <button 
                              onClick={() => handleOrderStatusUpdate(order.id, 'PAID')}
                              className="btn btn-primary"
                              style={{ padding: '3px 8px', fontSize: '9px', borderRadius: '4px' }}
                            >
                              Valider Paiement
                            </button>
                          )}
                          {order.status === 'PAID' && (
                            <button 
                              onClick={() => handleOrderStatusUpdate(order.id, 'SHIPPED')}
                              className="btn btn-accent"
                              style={{ padding: '3px 8px', fontSize: '9px', borderRadius: '4px' }}
                            >
                              Expédier Colis ➔
                            </button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Check size={12} style={{ color: 'var(--asfar-green)' }} /> Livré
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    {/* EXPANDABLE ORDER DETAILS ROW */}
                    {expandedOrderId === order.id && (
                      <tr style={{ background: 'rgba(0,0,0,0.15)' }}>
                        <td colSpan={6} style={{ padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                            <h4 style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                              Détails des Articles Commandés
                            </h4>
                            {order.items && order.items.length > 0 ? (
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {order.items.map((item, idx) => (
                                  <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'white', paddingBottom: idx < order.items.length - 1 ? '8px' : '0', borderBottom: idx < order.items.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>x{item.quantity}</span>
                                      <strong>{item.product?.name || 'Article'}</strong>
                                      
                                      {item.size && (
                                        <span style={{ color: 'var(--asfar-gold)', fontSize: '11px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '12px' }}>
                                          Taille: <strong>{item.size}</strong>
                                        </span>
                                      )}
                                      
                                      {(item.customName || item.customNumber) && (
                                        <span style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--asfar-gold)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          👕 Flocage: <strong>{item.customName || '-'}</strong> / N°<strong>{item.customNumber || '-'}</strong>
                                        </span>
                                      )}
                                    </div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{(item.price * item.quantity).toFixed(2)} DH</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Aucun détail d'article disponible pour cette commande.</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        
        /* TAB 3: ANALYTICS & FLOCAGES */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Card grid for extra analytics metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
              <div style={{ background: 'rgba(245, 197, 24, 0.15)', color: 'var(--asfar-gold)', padding: '10px', borderRadius: '12px' }}><Tag size={24} /></div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Panier Moyen</span>
                <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{analytics.averageOrderValue.toFixed(1)} DH</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
              <div style={{ background: 'rgba(0, 143, 83, 0.15)', color: 'var(--asfar-green)', padding: '10px', borderRadius: '12px' }}><Users size={24} /></div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Part Membres Askary</span>
                <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{analytics.subscriberSharePercent.toFixed(0)}%</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(225, 29, 72, 0.15)', color: 'var(--asfar-red)' }}>
              <div style={{ background: 'rgba(225, 29, 72, 0.15)', color: 'var(--asfar-red)', padding: '10px', borderRadius: '12px' }}><Package size={24} /></div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Flocages Demandés</span>
                <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{analytics.flocageDemands.length} Maillots</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.05)' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff', padding: '10px', borderRadius: '12px' }}><Info size={24} /></div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Ventes Payées (Total)</span>
                <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{orders.filter(o => o.status === 'PAID' || o.status === 'SHIPPED').length} Commandes</h3>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Sales trend & Category progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              {/* Sales trend (SVG) */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '1.5rem' }}>📈 Tendance des Ventes (7 derniers jours)</h3>
                
                {/* SVG Graph */}
                <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                  <svg viewBox="0 0 480 200" width="100%" height="200" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--asfar-green)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--asfar-green)" stopOpacity="0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="30" y1="40" x2="450" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <line x1="30" y1="100" x2="450" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <line x1="30" y1="160" x2="450" y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

                    {/* Area under the line */}
                    {(() => {
                      const salesDays = Object.entries(analytics.salesByDay);
                      const maxSale = Math.max(...salesDays.map(([_, amt]) => amt), 100);
                      const points = salesDays.map(([_, amt], idx) => {
                        const x = 30 + idx * 68;
                        const y = 160 - (amt / maxSale) * 110;
                        return { x, y };
                      });
                      const pathD = points.reduce((acc, p, idx) => acc + (idx === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), "");
                      const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z` : "";
                      
                      return (
                        <>
                          {points.length > 0 && (
                            <>
                              <path d={areaD} fill="url(#chart-gradient)" />
                              <path d={pathD} fill="none" stroke="var(--asfar-green)" strokeWidth="3" filter="url(#glow)" />
                              {points.map((p, idx) => (
                                <g key={idx}>
                                  <circle cx={p.x} cy={p.y} r="5" fill="var(--asfar-gold)" stroke="var(--bg-dark)" strokeWidth="2" />
                                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                                    {salesDays[idx][1] > 0 ? `${salesDays[idx][1]} DH` : ""}
                                  </text>
                                </g>
                              ))}
                            </>
                          )}
                        </>
                      );
                    })()}

                    {/* X Axis Labels */}
                    {Object.keys(analytics.salesByDay).map((dayStr, idx) => (
                      <text
                        key={idx}
                        x={30 + idx * 68}
                        y={180}
                        textAnchor="middle"
                        fill="var(--text-muted)"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {dayStr}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>

              {/* Sales by category */}
              <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
                <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '1.5rem' }}>📊 Répartition des ventes par Catégorie</h3>
                
                {(() => {
                  const totalCatRevenue = Object.values(analytics.salesByCategory).reduce((a, b) => a + b, 0) || 1;
                  const categoriesList = [
                    { key: 'MATCHDAY', label: 'Équipement Pro (Matchday)', color: 'var(--asfar-green)' },
                    { key: 'STREETWEAR', label: 'Mode / Streetwear', color: 'var(--asfar-red)' },
                    { key: 'HERITAGE', label: 'Rétro / Heritage', color: 'var(--asfar-gold)' },
                    { key: 'ACCESSOIRES', label: 'Accessoires & Goodies', color: 'var(--text-muted)' }
                  ];

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {categoriesList.map(cat => {
                        const amount = analytics.salesByCategory[cat.key] || 0;
                        const pct = (amount / totalCatRevenue) * 100;
                        return (
                          <div key={cat.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{cat.label}</span>
                              <strong style={{ color: 'white' }}>{amount.toFixed(1)} DH ({pct.toFixed(0)}%)</strong>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: cat.color, borderRadius: '4px', transition: 'width 0.8s ease-in-out' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Right Column: Top flocages */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)' }}>
              <h3 style={{ fontSize: '16px', color: 'white', marginBottom: '1.5rem' }}>👕 Flocages Populaires (Top 5)</h3>
              
              {analytics.topFlocages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Aucune demande de flocage personnalisée dans les commandes actuelles.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {analytics.topFlocages.map((f, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px',
                        border: '1px solid var(--border-glass)'
                      }}
                    >
                      {/* Left: rank + jersey representation */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '24px', height: '24px', borderRadius: '50%', background: idx === 0 ? 'var(--asfar-gold)' : 'rgba(255,255,255,0.05)',
                          color: idx === 0 ? '#07080a' : 'white', fontWeight: 'bold', fontSize: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {idx + 1}
                        </span>

                        {/* Visual Jersey Icon */}
                        <div style={{
                          width: '32px', height: '40px', background: 'linear-gradient(135deg, var(--asfar-red) 30%, var(--asfar-green) 70%)',
                          borderRadius: '6px 6px 2px 2px', border: '1px solid rgba(255,255,255,0.2)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'
                        }}>
                          <span style={{ fontSize: '7px', fontWeight: '800', color: 'white', letterSpacing: '0.5px', scale: '0.8' }}>{f.name.slice(0,5)}</span>
                          <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--asfar-gold)', lineHeight: '1' }}>{f.number}</span>
                        </div>
                        
                        <div>
                          <strong style={{ color: 'white', fontSize: '14px', textTransform: 'uppercase' }}>{f.name}</strong>
                          <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>Numéro {f.number}</span>
                        </div>
                      </div>

                      {/* Right: count badge */}
                      <span className="badge badge-gold" style={{ fontSize: '10px', padding: '0.3rem 0.6rem' }}>
                        x{f.count} Flocages
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Full Width Section: Flocage Preparation Log */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(22, 28, 36, 0.45)', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: 'white' }}>📋 Centre de Préparation des Flocages</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Logistique d'impression à chaud pour les maillots personnalisés des supporters.</p>
              </div>

              {/* Filtering Controls */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Rechercher nom, n°, commande..."
                    value={flocageSearch}
                    onChange={e => setFlocageSearch(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '11px', padding: '4px 10px 4px 28px', width: '200px', borderRadius: '6px' }}
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  {[['all', 'Tous'], ['pending', 'À préparer'], ['ready', 'Prêts']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setFlocageFilter(val)}
                      style={{
                        background: flocageFilter === val ? 'var(--asfar-green)' : 'none',
                        border: 'none', color: 'white', padding: '3px 8px', fontSize: '10px',
                        borderRadius: '6px', cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtered list table */}
            {(() => {
              const filteredFlocages = analytics.flocageDemands.filter(fd => {
                const matchesSearch = fd.customName.toLowerCase().includes(flocageSearch.toLowerCase()) || 
                                      fd.customNumber.toString().includes(flocageSearch) ||
                                      fd.productName.toLowerCase().includes(flocageSearch.toLowerCase()) ||
                                      fd.orderId.toString().includes(flocageSearch);
                
                if (flocageFilter === 'pending') {
                  return matchesSearch && (fd.status === 'PENDING' || fd.status === 'PAID');
                }
                if (flocageFilter === 'ready') {
                  return matchesSearch && fd.status === 'SHIPPED';
                }
                return matchesSearch;
              });

              if (filteredFlocages.length === 0) {
                return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '12px' }}>Aucun maillot ne correspond aux critères de recherche.</div>;
              }

              return (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '10px' }}>COMMANDE</th>
                      <th style={{ padding: '10px' }}>CLIENT</th>
                      <th style={{ padding: '10px' }}>MAILLOT CONCERNÉ</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>TAILLE</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>FLOCAGE</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>STATUT</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>ACTIONS DE PRODUCTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlocages.map(fd => (
                      <tr key={fd.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', height: '56px' }}>
                        <td style={{ padding: '10px', color: 'white', fontWeight: 'bold' }}>#{fd.orderId}</td>
                        <td style={{ padding: '10px' }}>{fd.customerName}</td>
                        <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{fd.productName}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: 'var(--asfar-gold)' }}>{fd.size}</td>
                        
                        {/* Custom Name / Number Tag badge */}
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <span style={{
                            background: 'rgba(212, 175, 55, 0.1)', color: 'var(--asfar-gold)',
                            padding: '4px 8px', borderRadius: '6px', fontSize: '11px',
                            border: '1px solid rgba(212, 175, 55, 0.3)', display: 'inline-flex',
                            alignItems: 'center', gap: '6px'
                          }}>
                            <span style={{ color: 'white', fontWeight: '800', textTransform: 'uppercase' }}>{fd.customName}</span>
                            <span style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.2)' }} />
                            <strong style={{ color: 'var(--asfar-gold)', fontSize: '12px' }}>{fd.customNumber}</strong>
                          </span>
                        </td>

                        {/* Order status */}
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <span className={`badge ${
                            fd.status === 'SHIPPED' ? 'badge-green' : fd.status === 'PAID' ? 'badge-gold' : 'badge-red'
                          }`} style={{ fontSize: '8px' }}>
                            {fd.status === 'SHIPPED' ? 'Expédié (Fini)' : fd.status === 'PAID' ? 'Payé (À faire)' : 'Attente (À faire)'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => setViewingJersey(fd)}
                              className="btn"
                              style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                              title="Aperçu visuel"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => setPrintingFlocage(fd)}
                              className="btn btn-accent"
                              style={{ padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
                              title="Imprimer étiquette d'atelier"
                            >
                              <Printer size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>

        </div>
      )}

      {/* Printing Flocage Label Modal Dialog */}
      {printingFlocage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }} className="animate-fade-in">
          <div className="glass-panel" style={{
            width: '90%', maxWidth: '420px', padding: '2rem', borderRadius: '24px',
            background: '#ffffff', color: '#090b11', border: '4px double #D4AF37',
            boxShadow: '0 25px 50px rgba(0,0,0,0.8)', position: 'relative'
          }}>
            {/* Header banner */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #090b11', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', color: '#008f53', margin: 0 }}>
                ASFAR ATHLETIC CLUB
              </h2>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#e11d48', letterSpacing: '1px' }}>
                OFFICIAL EQUIPMENT PRINT LABEL
              </span>
            </div>

            {/* Label Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: "'Courier New', Courier, monospace" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>ORDER ID:</span>
                <span style={{ fontWeight: 'bold' }}>#{printingFlocage.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>DATE:</span>
                <span>{new Date(printingFlocage.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>CLIENT:</span>
                <span style={{ textTransform: 'uppercase' }}>{printingFlocage.customerName}</span>
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px dashed #090b11', margin: '8px 0' }} />

              <div style={{ fontSize: '12px', color: '#64748b' }}>PRODUCT:</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {printingFlocage.productName}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>SIZE:</span>
                  <span style={{ fontSize: '32px', fontWeight: '900', color: '#090b11', fontFamily: "'Outfit', sans-serif" }}>
                    {printingFlocage.size}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>QTY:</span>
                  <span style={{ fontSize: '24px', fontWeight: '900', color: '#090b11' }}>
                    x{printingFlocage.quantity}
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '2px solid #090b11', margin: '8px 0' }} />

              {/* FLOCAGE DETAILS */}
              <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '12px', textAlign: 'center', border: '1px solid #cbd5e1', margin: '5px 0' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                  FLOCAGE TEXTE (DOS)
                </div>
                <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '4px', color: '#090b11', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
                  {printingFlocage.customName || 'SANS NOM'}
                </div>
                
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '10px', marginBottom: '2px' }}>
                  NUMÉRO (DOS)
                </div>
                <div style={{ fontSize: '56px', fontWeight: '900', color: '#D4AF37', textShadow: '2px 2px 0px #000', lineHeight: '1', fontFamily: "'Outfit', sans-serif" }}>
                  {printingFlocage.customNumber !== undefined ? printingFlocage.customNumber : '--'}
                </div>
              </div>

              {/* Barcode mockup */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '2px', height: '30px', background: 'white' }}>
                  {[3,1,4,2,1,3,2,4,1,2,3,1,4,2,3,1,2,1,4,2,3,1].map((w, i) => (
                    <div key={i} style={{ width: `${w}px`, height: '100%', background: '#090b11' }} />
                  ))}
                </div>
                <span style={{ fontSize: '9px', color: '#64748b', marginTop: '4px', letterSpacing: '2px' }}>
                  *ASK-{printingFlocage.orderId}-{printingFlocage.size}*
                </span>
              </div>

              {/* Heatpress directions */}
              <div style={{ fontSize: '9px', color: '#64748b', textAlign: 'center', marginTop: '5px', border: '1px solid #cbd5e1', padding: '6px', borderRadius: '6px' }}>
                💡 <strong>PRESSE À CHAUD</strong> : Température: 150°C | Temps: 15 secondes | Pelage: À Froid (Cold Peel)
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button
                onClick={() => window.print()}
                className="btn"
                style={{ flex: 1, background: '#008f53', color: 'white', border: 'none', padding: '0.6rem', fontSize: '12px' }}
              >
                <Printer size={14} /> Imprimer
              </button>
              <button
                onClick={() => setPrintingFlocage(null)}
                className="btn"
                style={{ flex: 1, background: '#e11d48', color: 'white', border: 'none', padding: '0.6rem', fontSize: '12px' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Jersey Modal */}
      {viewingJersey && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }} className="animate-fade-in">
          <div className="glass-panel" style={{
            width: '90%', maxWidth: '340px', padding: '1.5rem', borderRadius: '24px',
            textAlign: 'center', position: 'relative'
          }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '16px' }}>Aperçu Flocage Maillot</h3>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {/* Render the Jersey Preview inside */}
              <div style={{
                position: 'relative',
                width: '200px',
                height: '260px',
                background: viewingJersey.productName.toLowerCase().includes('extérieur') 
                  ? 'linear-gradient(90deg, #07080a 0%, #07080a 40%, #006B3C 40%, #006B3C 60%, #D2143A 60%, #D2143A 100%)' // AWAY
                  : 'linear-gradient(90deg, #D2143A 0%, #D2143A 40%, #006B3C 40%, #006B3C 60%, #07080a 60%, #07080a 100%)', // HOME
                borderRadius: '24px 24px 10px 10px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.15)',
                border: '3px solid #D4AF37',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '25px'
              }}>
                <div style={{ position: 'absolute', top: '-15px', width: '80px', height: '30px', background: '#07080a', borderRadius: '50%', borderBottom: '2px solid #D4AF37' }} />
                <div style={{ position: 'absolute', top: '10px', color: '#D4AF37', fontSize: '14px', fontWeight: 'bold' }}>★</div>
                
                <div style={{ marginTop: '10px', width: '90%', textAlign: 'center' }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '800',
                    fontSize: '16px',
                    color: 'white',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
                    display: 'inline-block',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                  }}>
                    {viewingJersey.customName.toUpperCase()}
                  </span>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '110px' }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '900',
                    fontSize: '80px',
                    lineHeight: '1',
                    color: '#D4AF37',
                    textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000'
                  }}>
                    {viewingJersey.customNumber}
                  </span>
                </div>
                
                <div style={{ position: 'absolute', bottom: '10px', background: 'rgba(7, 8, 10, 0.8)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: '4px', padding: '1px 6px', fontSize: '8px', fontWeight: 'bold', color: '#D4AF37' }}>
                  ASKARY 12
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingJersey(null)}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '0.6rem' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminDashboard;
