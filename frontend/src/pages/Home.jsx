import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { Award, ShieldAlert, Sparkles, TrendingUp, Star, ChevronRight, Trophy, Medal } from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 65;
    const colors = [
      'rgba(0, 143, 83, 0.45)',  // ASFAR Green
      'rgba(212, 175, 55, 0.5)',  // ASFAR Gold
      'rgba(225, 29, 72, 0.4)'    // ASFAR Red
    ];

    const rect = canvas.getBoundingClientRect();
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let mouse = { x: null, y: null, radius: 130 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parentSection = canvas.parentElement;
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > rect.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > rect.height) p1.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p1.x += (dx / dist) * force * 0.5;
            p1.y += (dy / dist) * force * 0.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (90 - dist) / 90 * 0.12;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);



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
      <style>{`
        @keyframes floatJersey {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes blobMove1 {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blobMove2 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.2); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes spinRadar {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 4rem;
          align-items: center;
          text-align: left;
        }
        @media (max-width: 990px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 3rem;
          }
          .hero-left-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-image-wrap {
            display: flex;
            justify-content: center;
            margin-top: 1.5rem;
          }
          .hero-buttons-container {
            justify-content: center !important;
          }
          .hero-stats-row {
            justify-content: center !important;
          }
        }
        .trophy-card {
          background: rgba(7, 8, 10, 0.6) !important;
          border: 1px solid rgba(212, 175, 55, 0.1) !important;
          padding: 2rem 1.5rem !important;
          border-radius: 18px !important;
          text-align: center !important;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
          box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.6) !important;
          position: relative !important;
          overflow: hidden !important;
          backdrop-filter: blur(10px);
        }
        .trophy-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.06),
            transparent
          );
          transition: 0.6s;
          pointer-events: none;
        }
        .trophy-card:hover::before {
          left: 150%;
        }
        .trophy-card:hover {
          transform: translateY(-8px) scale(1.03) !important;
          border-color: rgba(212, 175, 55, 0.45) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.15), inset 0 0 15px rgba(212, 175, 55, 0.05) !important;
        }
        .trophy-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.07);
          margin-bottom: 1.25rem;
          border: 1px solid rgba(212, 175, 55, 0.12);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ;
        }
        .trophy-card:hover .trophy-icon-wrapper {
          background: rgba(212, 175, 55, 0.18);
          border-color: rgba(212, 175, 55, 0.45);
          transform: scale(1.15) rotate(8deg);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }
        .metallic-title {
          background: linear-gradient(135deg, #ffffff 10%, #D4AF37 55%, #ffffff 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.15));
        }
        @keyframes meshMovement1 {
          0% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.25); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes meshMovement2 {
          0% { transform: translate(0px, 0px) scale(1.1); }
          50% { transform: translate(-50px, 50px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1.1); }
        }
        @keyframes meshMovement3 {
          0% { transform: translate(0px, 0px) scale(0.9); }
          50% { transform: translate(40px, 60px) scale(1.15); }
          100% { transform: translate(0px, 0px) scale(0.9); }
        }
        .mesh-blob-1 {
          position: absolute;
          top: -20%;
          left: 10%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(0, 143, 83, 0.38) 0%, transparent 70%);
          filter: blur(50px);
          animation: meshMovement1 16s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }
        .mesh-blob-2 {
          position: absolute;
          bottom: -20%;
          right: 10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, transparent 70%);
          filter: blur(60px);
          animation: meshMovement2 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }
        .mesh-blob-3 {
          position: absolute;
          top: 25%;
          right: 25%;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(225, 29, 72, 0.22) 0%, transparent 70%);
          filter: blur(45px);
          animation: meshMovement3 24s ease-in-out infinite;
          pointer-events: none;
          z-index: 2;
        }
      `}</style>

      <section className="glass-panel" style={{
        padding: '5rem 4rem',
        borderRadius: '32px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '4.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        background: '#07080a'
      }}>
        {/* Video Background Loop */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            pointerEvents: 'none',
            opacity: 0.7
          }}
        >
          <source
            src="/green_hero_bg.mp4"
            type="video/mp4"
          />
        </video>

        {/* Canvas Particle Network (Plexus) */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0.8
          }}
        />

        {/* Semi-transparent dark gradient overlay for optimal text contrast */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(7, 8, 10, 0.86) 0%, rgba(0, 50, 25, 0.5) 50%, rgba(100, 10, 25, 0.3) 100%)',
          zIndex: 3,
          pointerEvents: 'none'
        }} />

        {/* Tactical Blueprint Grid Overlay */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 4,
          opacity: 0.28
        }}>
          <defs>
            <pattern id="tactical-grid" width="45" height="45" patternUnits="userSpaceOnUse">
              <path d="M 45 0 L 0 0 0 45" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.2" fill="#D4AF37" opacity="0.5" />
            </pattern>
            <linearGradient id="radar-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#008f53" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Blueprint Grid pattern */}
          <rect width="100%" height="100%" fill="url(#tactical-grid)" />

          {/* Concentric radar rings behind jersey showcase */}
          <g style={{ transformOrigin: '80% 50%', animation: 'spinRadar 40s linear infinite' }}>
            <circle cx="80%" cy="50%" r="200" fill="none" stroke="url(#radar-glow)" strokeWidth="1.2" strokeDasharray="6,8" />
            <circle cx="80%" cy="50%" r="140" fill="none" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="0.8" strokeDasharray="3,12" />
          </g>
          
          <circle cx="80%" cy="50%" r="250" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <circle cx="80%" cy="50%" r="5" fill="#D4AF37" opacity="0.3" />

          {/* Strategy whiteboard playbook items */}
          <path d="M 60,60 Q 140,140 100,220" fill="none" stroke="#008f53" strokeWidth="1.5" strokeDasharray="4,6" opacity="0.4" />
          <path d="M 85,210 L 100,220 L 105,200" fill="none" stroke="#008f53" strokeWidth="1.5" opacity="0.4" />
          <text x="50" y="55" fill="#008f53" fontSize="9" opacity="0.4" fontFamily="monospace">O1</text>

          <path d="M 320,260 Q 400,200 500,240" fill="none" stroke="#e11d48" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.35" />
          <text x="510" y="245" fill="#e11d48" fontSize="9" opacity="0.45" fontFamily="monospace">X</text>

          {/* Technical scope markings at four corners */}
          <path d="M 20 30 L 20 20 L 30 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 98% 30 L 98% 20 L 97% 20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 20 95% L 20 97% L 30 97%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 98% 95% L 98% 97% L 97% 97%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>

        <div className="hero-container" style={{ position: 'relative', zIndex: 5 }}>
          {/* Left Column: Text Content */}
          <div className="hero-left-content">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.5rem',
              padding: '6px 16px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: '#fff',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              borderRadius: '50px',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--asfar-gold)',
                boxShadow: '0 0 8px var(--asfar-gold)'
              }} />
              NOUVELLE COLLECTION COMPLÈTE 25/26
            </span>

            <h1 style={{
              fontSize: '56px',
              fontWeight: '900',
              lineHeight: '1.08',
              fontFamily: "'Outfit', sans-serif",
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              letterSpacing: '-1.5px',
              color: '#ffffff'
            }}>
              REJOIGNEZ LA FORCE <br />
              <span style={{
                background: 'linear-gradient(90deg, #008f53 0%, #D4AF37 50%, #e11d48 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                DE L'ÉQUIPE MILITAIRE
              </span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.75)',
              marginBottom: '2.5rem',
              lineHeight: '1.8',
              maxWidth: '600px'
            }}>
              Explorez la nouvelle armure officielle des Askary. Personnalisez vos maillots avec notre outil de flocage 3D exclusif et rejoignez la famille militaire avec honneur, style et fidélité.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'flex-start' }} className="hero-buttons-container">
              <Link to="/shop" className="btn btn-accent" style={{
                padding: '1rem 2.25rem',
                fontSize: '15px',
                fontWeight: 'bold',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s'
              }}>
                Acheter Maintenant <ChevronRight size={16} />
              </Link>
              <button onClick={() => handleCollectionClick('MATCHDAY')} className="btn" style={{
                padding: '1rem 2.25rem',
                fontSize: '15px',
                fontWeight: 'bold',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer'
              }}>
                Équipement Pro
              </button>
            </div>

            {/* Club Statistics Shelf */}
            <div className="hero-stats-row" style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '3.5rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <strong style={{ display: 'block', fontSize: '20px', color: 'white', fontWeight: '800' }}>1958</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fondation Club</span>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '20px', color: 'var(--asfar-gold)', fontWeight: '800' }}>★ 13</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Titres Championnat</span>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '20px', color: 'white', fontWeight: '800' }}>Premium</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Flocage Officiel 3D</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Jersey Showcase */}
          <div className="hero-image-wrap" style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Ambient gold glow behind jersey */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, transparent 70%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />

            {/* Dashed rotating border frame */}
            <div style={{
              position: 'absolute',
              width: '260px',
              height: '340px',
              border: '1.5px dashed rgba(212, 175, 55, 0.3)',
              borderRadius: '24px',
              transform: 'rotate(-4deg)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />

            {/* Floating Jersey Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              animation: 'floatJersey 6s ease-in-out infinite'
            }}>
              <img
                src="/asfar_jersey_hero.png"
                alt="ASFAR Official Jersey Matchday Collection"
                style={{
                  width: '250px',
                  height: 'auto',
                  borderRadius: '20px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(0, 107, 60, 0.25)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'block'
                }}
              />

              {/* Badges overlapping the image */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '-20px',
                background: 'rgba(7, 8, 10, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--asfar-gold)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'var(--asfar-gold)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}>
                👕 Flocage 3D Inclu
              </div>

              <div style={{
                position: 'absolute',
                bottom: '30px',
                left: '-25px',
                background: 'rgba(7, 8, 10, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--asfar-green)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}>
                ★ Édition Officielle
              </div>
            </div>
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
        padding: '4.5rem 3rem',
        borderRadius: '32px',
        textAlign: 'center',
        background: '#07080a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Dynamic CSS Mesh Blobs simulating an ambient loop video */}
        <div className="mesh-blob-1" />
        <div className="mesh-blob-2" />
        <div className="mesh-blob-3" />

        {/* Semi-transparent dark overlay to blend the background and guarantee text legibility */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(7, 8, 10, 0.94) 0%, rgba(7, 8, 10, 0.8) 60%, rgba(17, 24, 39, 0.85) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Faint gold background spotlight */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 3
        }} />

        {/* Special Victory Tactical Grid Background */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
          opacity: 0.25
        }}>
          <defs>
            <pattern id="palmares-grid" width="55" height="55" patternUnits="userSpaceOnUse">
              <path d="M 55 0 L 0 0 0 55" fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.3" fill="#D4AF37" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#palmares-grid)" />
          
          {/* Victory Laurel Rings in the center background */}
          <circle cx="50%" cy="50%" r="220" fill="none" stroke="rgba(212, 175, 55, 0.07)" strokeWidth="1" strokeDasharray="4,8" />
          <circle cx="50%" cy="50%" r="280" fill="none" stroke="rgba(212, 175, 55, 0.03)" strokeWidth="1" />
          
          {/* Corner brackets framing the Palmares */}
          <path d="M 30 40 L 30 30 L 40 30" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.2" />
          <path d="M 97% 40 L 97% 30 L 96% 30" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.2" />
          <path d="M 30 90% L 30 92% L 40 92%" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.2" />
          <path d="M 97% 90% L 97% 92% L 96% 92%" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.2" />
        </svg>

        <div style={{ position: 'relative', zIndex: 4 }}>
          <img 
            src="/AS_FAR_logo.png" 
            alt="ASFAR Logo" 
            style={{
              width: '72px',
              height: '72px',
              objectFit: 'contain',
              margin: '0 auto 1.5rem auto',
              display: 'block',
              filter: 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.4))'
            }}
          />
          <h2 className="metallic-title" style={{
            fontSize: '32px',
            fontWeight: '900',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            letterSpacing: '1px'
          }}>
            LE PALMARÈS HISTORIQUE DES MILITAIRES
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: '1.65',
            maxWidth: '680px',
            margin: '0 auto 3rem auto'
          }}>
            L'ASFAR est l'un des clubs les plus titrés de l'histoire du football marocain. Fondé par décret royal en 1958, le club porte haut les valeurs de bravoure, de discipline, et de succès permanent.
          </p>

          {/* Trophies Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.75rem'
          }}>
            {[
              { count: '13', title: 'Botola Pro', desc: 'Championnats du Maroc', icon: <Trophy size={22} color="#D4AF37" /> },
              { count: '12', title: 'Coupes du Trône', desc: 'Coupe Nationale', icon: <Award size={22} color="#D4AF37" /> },
              { count: '1', title: 'Ligue des Champions', desc: 'CAF Champions League (1985)', icon: <Star size={22} color="#D4AF37" /> },
              { count: '1', title: 'Coupe de la CAF', desc: 'Confederation Cup (2005)', icon: <Medal size={22} color="#D4AF37" /> }
            ].map((trophy, index) => (
              <div key={index} className="trophy-card">
                <div className="trophy-icon-wrapper">
                  {trophy.icon}
                </div>
                <div style={{
                  fontSize: '38px',
                  fontWeight: '950',
                  color: 'var(--asfar-gold)',
                  fontFamily: "'Outfit', sans-serif",
                  textShadow: '0 0 15px rgba(212,175,55,0.3)',
                  lineHeight: '1'
                }}>
                  {trophy.count}
                </div>
                <h4 style={{ color: 'white', fontSize: '15px', fontWeight: '750', marginTop: '10px' }}>{trophy.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', lineHeight: '1.4' }}>{trophy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
export default Home;
