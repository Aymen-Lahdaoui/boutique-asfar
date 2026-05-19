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
      console.warn("Inscription API échouée, tentative en mode autonome local...");
      
      // Fallback local
      const mockNewUser = { id: Date.now(), username, email, role: 'USER', subscriber: false, fidelityPoints: 0 };
      setUser(mockNewUser);
      localStorage.setItem('askary_user', JSON.stringify(mockNewUser));
      return mockNewUser;
    }
  };

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
    <AuthContext.Provider value={{ user, loading, error, login, register, validateAskaryCard, logout, addLocalFidelityPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
