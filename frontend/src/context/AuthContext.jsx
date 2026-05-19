import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = 'http://localhost:8082/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger la session utilisateur au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('askary_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Connexion
  const login = async (email, password) => {
    setError(null);
    try {
      // Tenter d'appeler le backend Spring Boot
      const response = await axios.post(`${API_BASE}/login`, { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('askary_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.warn("Connexion API échouée, tentative en mode autonome local...");
      
      // Fallback local en cas de serveur arrêté (pour tester immédiatement le frontend !)
      if (email === 'admin@askary.ma' && password === 'AdminPassword123') {
        const mockAdmin = { id: 3, username: 'Admin ASFAR', email, role: 'ADMIN', subscriber: false, fidelityPoints: 0 };
        setUser(mockAdmin);
        localStorage.setItem('askary_user', JSON.stringify(mockAdmin));
        return mockAdmin;
      } else if (email === 'abonne@askary.ma' && password === 'Password123') {
        const mockSub = { id: 2, username: 'Med Askary 12', email, role: 'USER', askaryCardNumber: 'ASK-19580', subscriber: true, fidelityPoints: 150 };
        setUser(mockSub);
        localStorage.setItem('askary_user', JSON.stringify(mockSub));
        return mockSub;
      } else if (email === 'client@askary.ma' && password === 'Password123') {
        const mockUser = { id: 1, username: 'Aymane Askary', email, role: 'USER', subscriber: false, fidelityPoints: 0 };
        setUser(mockUser);
        localStorage.setItem('askary_user', JSON.stringify(mockUser));
        return mockUser;
      }

      // Si le serveur a répondu avec une erreur mais était en ligne
      if (err.response && err.response.data) {
        throw new Error(err.response.data);
      }
      throw new Error("Identifiants incorrects ou serveur indisponible.");
    }
  };

  // Inscription
  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE}/register`, { username, email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('askary_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      // Afficher une vraie erreur si le backend est indisponible ou si l'email est déjà utilisé
      if (err.response && err.response.data) {
        throw new Error(err.response.data);
      }
      throw new Error("Le serveur est indisponible. Assurez-vous que le backend est bien démarré.");
    }
  };

  // Liaison "Carte Askary"
  // Liaison "Carte Askary"
  const validateAskaryCard = async (cardNumber) => {
    setError(null);
    if (!user) throw new Error("Vous devez être connecté pour lier votre carte.");

    try {
      const response = await axios.post(`${API_BASE}/validate-askary`, {
        userId: user.id,
        cardNumber: cardNumber
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('askary_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.warn("Validation API de carte échouée, validation locale...");
      
      // Validation locale : format ASK-XXXXX (ex: ASK-19580)
      if (cardNumber && cardNumber.toUpperCase().startsWith('ASK-') && cardNumber.length >= 7) {
        const updatedUser = {
          ...user,
          askaryCardNumber: cardNumber.toUpperCase(),
          subscriber: true,
          fidelityPoints: user.fidelityPoints + 50 // Points fidélité bonus
        };
        setUser(updatedUser);
        localStorage.setItem('askary_user', JSON.stringify(updatedUser));
        return updatedUser;
      } else {
        throw new Error(err.response?.data || "Numéro de carte invalide. Utilisez le format 'ASK-XXXXX' (ex: ASK-19580).");
      }
    }
  };

  // Résiliation d'Abonnement Askary
  const cancelAskarySubscription = async () => {
    setError(null);
    if (!user) throw new Error("Vous devez être connecté pour modifier votre abonnement.");

    try {
      const response = await axios.post(`${API_BASE}/cancel-askary`, {
        userId: user.id
      });
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('askary_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.warn("Résiliation API échouée, application locale...");
      const updatedUser = {
        ...user,
        askaryCardNumber: null,
        subscriber: false
      };
      setUser(updatedUser);
      localStorage.setItem('askary_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  };

  // Envoi du code de vérification par email
  const sendVerificationCode = async () => {
    if (!user) throw new Error("Vous devez être connecté.");
    try {
      const response = await axios.post(`${API_BASE}/send-verification-code`, { userId: user.id });
      // Backend a réussi : supprimer tout ancien code local pour éviter les conflits
      localStorage.removeItem('_askary_pending_code');
      return response.data;
    } catch (err) {
      // Fallback local uniquement si le backend est hors ligne (pas de réponse du tout)
      if (!err.response) {
        console.warn("Backend hors ligne, génération d'un code local de secours.");
        const randomDigits = Math.floor(10000 + Math.random() * 90000);
        const fallbackCode = `ASK-SUB-${randomDigits}`;
        localStorage.setItem('_askary_pending_code', JSON.stringify({ userId: user.id, code: fallbackCode }));
        return {
          message: "Mode hors ligne : code de simulation généré localement.",
          sent: false,
          fallbackCode: fallbackCode
        };
      }
      const backendError = err.response?.data;
      const errorMessage = typeof backendError === 'string'
        ? backendError
        : (backendError?.message || "Erreur lors de l'envoi du code.");
      throw new Error(errorMessage);
    }
  };

  // Vérification du code
  const verifyCode = async (code) => {
    if (!user) throw new Error("Vous devez être connecté.");
    try {
      const response = await axios.post(`${API_BASE}/verify-code`, { userId: user.id, code });
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('askary_user', JSON.stringify(updatedUser));
      localStorage.removeItem('_askary_pending_code');
      return updatedUser;
    } catch (err) {
      // Si le backend a répondu avec une erreur (ex: code incorrect), on la remonte directement
      if (err.response) {
        throw new Error(err.response.data || "Code incorrect. Vérifiez votre email et réessayez.");
      }
      // Sinon, fallback local uniquement si le backend est hors ligne
      console.warn("Backend hors ligne, vérification locale du code.");
      const stored = localStorage.getItem('_askary_pending_code');
      if (stored) {
        const { userId, code: expectedCode } = JSON.parse(stored);
        if (userId === user.id && code.trim().toUpperCase() === expectedCode.toUpperCase()) {
          const randomDigits = Math.floor(10000 + Math.random() * 90000);
          const generatedCard = `ASK-${randomDigits}`;
          const updatedUser = {
            ...user,
            askaryCardNumber: generatedCard,
            subscriber: true,
            fidelityPoints: user.fidelityPoints + 50
          };
          setUser(updatedUser);
          localStorage.setItem('askary_user', JSON.stringify(updatedUser));
          localStorage.removeItem('_askary_pending_code');
          return updatedUser;
        } else {
          throw new Error("Code incorrect. Vérifiez le code affiché à l'écran.");
        }
      }
      throw new Error("Backend indisponible et aucun code local trouvé. Veuillez réessayer.");
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('askary_user');
  };

  // Mettre à jour manuellement les points de fidélité après un achat réussi en local
  const addLocalFidelityPoints = (points) => {
    if (user) {
      const updatedUser = { ...user, fidelityPoints: user.fidelityPoints + points };
      setUser(updatedUser);
      localStorage.setItem('askary_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, validateAskaryCard, cancelAskarySubscription, sendVerificationCode, verifyCode, logout, addLocalFidelityPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
