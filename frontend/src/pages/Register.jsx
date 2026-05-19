import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, AlertTriangle, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/shop');
    } catch (err) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '4rem auto',
      padding: '1rem'
    }} className="animate-fade-in">

      <div className="glass-panel" style={{
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'rgba(22, 28, 36, 0.55)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>

        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '4px',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            boxShadow: 'var(--shadow-gold-glow)',
            marginBottom: '10px'
          }}>
            <img 
              src="/AS_FAR_logo.png" 
              alt="ASFAR Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span style={{
              display: 'none',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '900',
              color: 'white',
              fontSize: '16px'
            }}>FAR</span>
          </div>
          <h2 style={{ fontSize: '24px', color: 'white', fontWeight: '800', fontFamily: "'Outfit', sans-serif" }}>
            Rejoindre la Famille
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Inscrivez-vous pour rejoindre les supporters militaires.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="glass-panel" style={{
            background: 'rgba(210, 20, 58, 0.15)',
            border: '1px solid rgba(210, 20, 58, 0.35)',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            color: '#f87171',
            fontSize: '12px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>NOM D'UTILISATEUR</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="E.g., Aymane Askary" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', fontSize: '13px' }}
              />
              <User size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label>ADRESSE EMAIL</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="E.g., client@askary.ma" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', fontSize: '13px' }}
              />
              <Mail size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label>MOT DE PASSE (MIN. 6 CARACTÈRES)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                placeholder="Saisissez un mot de passe fort" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', fontSize: '13px' }}
              />
              <KeyRound size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {loading ? 'Création de compte...' : "S'inscrire"} <ArrowRight size={14} />
          </button>
        </form>

        {/* Bottom selector */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: 'var(--asfar-green)', textDecoration: 'none', fontWeight: 'bold' }} onMouseOver={(e)=>e.target.style.textDecoration='underline'} onMouseOut={(e)=>e.target.style.textDecoration='none'}>
            Se connecter
          </Link>
        </div>

      </div>

    </div>
  );
};
export default Register;
