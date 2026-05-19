import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  // Charger le panier depuis localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('askary_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('askary_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Ajouter un produit au panier
  const addToCart = (product, quantity = 1, size = 'M', customName = '', customNumber = '') => {
    setCartItems((prevItems) => {
      // Générer une clé unique combinant produit, taille et flocage
      const cartItemId = `${product.id}-${size}-${customName || 'no'}-${customNumber || 'no'}`;
      
      const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Mettre à jour la quantité si l'article identique existe déjà
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Calculer le prix unitaire (+50 DH si maillot floqué personnalisé)
        let unitPrice = product.price;
        if (product.personalizable && customName && customName.trim() !== '') {
          unitPrice += 50.0;
        }

        // Ajouter la nouvelle ligne au panier
        return [
          ...prevItems,
          {
            cartItemId,
            product,
            quantity,
            size,
            customName: customName ? customName.toUpperCase() : '',
            customNumber: customNumber ? parseInt(customNumber) : '',
            unitPrice
          }
        ];
      }
    });
  };

  // Retirer un produit du panier
  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Modifier la quantité
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculs financiers
  const subTotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  
  // Réduction abonné : 10% si l'utilisateur est abonné
  const discountAmount = user && user.subscriber ? subTotal * 0.10 : 0.0;
  
  // Frais de port : Gratuit à partir de 800 DH d'achat net, sinon 30 DH (si panier vide, 0 DH)
  const shippingFee = cartItems.length === 0 ? 0 : (subTotal - discountAmount >= 800 ? 0 : 30);
  
  const totalPrice = subTotal - discountAmount + shippingFee;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subTotal,
      discountAmount,
      shippingFee,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
