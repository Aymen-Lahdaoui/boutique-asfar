import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart3, Package, Users, ShieldAlert, Plus, Trash2, Edit, Save, ArrowDown, ChevronRight, Check, X } from 'lucide-react';

export const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect guard if not admin
  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      // Si pas admin, laisser le guard afficher l'écran Accès Interdit
    }
  }, [user]);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' ou 'orders'

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

  // Fallback mocks
  const mockProducts = [
    { id: 1, name: "Maillot Domicile Officiel ASFAR 2025/2026", description: "Maillot domicile.", price: 600.0, imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500", category: "MATCHDAY", stockQuantity: 50, personalizable: true, sizes: "S,M,L,XL,XXL" },
    { id: 2, name: "Maillot Extérieur Premium Noir & Or", description: "Maillot extérieur.", price: 650.0, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", category: "MATCHDAY", stockQuantity: 30, personalizable: true, sizes: "S,M,L,XL" },
    { id: 3, name: "Veste de Survêtement Askary", description: "Veste entraînement.", price: 450.0, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500", category: "STREETWEAR", stockQuantity: 2, personalizable: false, sizes: "M,L,XL" }
  ];

  const mockOrders = [
    {
      id: 101,
      user: { username: "Aymane Askary", email: "client@askary.ma" },
      totalPrice: 1280.0,
      status: "PAID",
      shippingAddress: "12 Rue de la Botola, Rabat (Tél: 0661234567)",
      createdAt: new Date().toISOString(),
      items: [
        {
          quantity: 2,
          price: 600.0,
          size: "L",
          customName: "AYMANE",
          customNumber: 12,
          product: { name: "Maillot Domicile Officiel ASFAR 2025/2026" }
        }
      ]
    },
    {
      id: 102,
      user: { username: "Med Askary 12", email: "abonne@askary.ma" },
      totalPrice: 585.0,
      status: "SHIPPED",
      shippingAddress: "Complexe Moulay Abdallah, Salé (Tél: 0670001958)",
      createdAt: new Date(Date.now() - 86400000).toISOString()
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

  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{ maxWidth: '600px', margin: '6rem auto', padding: '2rem' }} className="glass-panel text-center animate-fade-in">
        <ShieldAlert size={48} style={{ color: 'var(--asfar-red)', margin: '0 auto 1rem auto' }} />
        <h2 style={{ color: 'white', fontWeight: '800' }}>Accès Interdit</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '13px' }}>
          Cette zone d'administration est strictement réservée aux officiers d'état-major de l'ASFAR. Veuillez vous connecter avec un compte administrateur.
        </p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>Se connecter</Link>
      </div>
    );
  }

  // Calculs statistiques
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= 5).length;

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
        </div>
      </div>

      {/* KPI STATISTICS WIDGETS SECTION */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--asfar-gold)', padding: '10px', borderRadius: '12px' }}><BarChart3 size={24} /></div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Revenu Global</span>
            <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{totalRevenue.toFixed(1)} DH</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(22, 28, 36, 0.45)' }}>
          <div style={{ background: 'rgba(0, 107, 60, 0.15)', color: 'var(--asfar-green)', padding: '10px', borderRadius: '12px' }}><Users size={24} /></div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Ventes Enregistrées</span>
            <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{orders.length} Commandes</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(210, 20, 58, 0.15)', border: lowStockCount > 0 ? '1px solid rgba(210, 20, 58, 0.35)' : '1px solid var(--border-glass)' }}>
          <div style={{ background: 'rgba(210, 20, 58, 0.15)', color: 'var(--asfar-red)', padding: '10px', borderRadius: '12px' }}><Package size={24} /></div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Alertes Ruptures / Stocks Bas</span>
            <h3 style={{ fontSize: '22px', color: 'white', fontWeight: '800' }}>{lowStockCount} Produits</h3>
          </div>
        </div>
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
      ) : (
        
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
      )}

    </div>
  );
};
export default AdminDashboard;
