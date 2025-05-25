import { useState, useEffect } from 'react';
import { CartItem, CustomTailoringDetails } from '@/types/cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem('vogueish-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vogueish-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (
    productId: string,
    name: string,
    price: number,
    image: string,
    color: string,
    size: string,
    quantity: number = 1,
    customTailoring?: CustomTailoringDetails,
    isHomeTrial?: boolean
  ) => {
    const itemId = `${productId}-${color}-${size}-${customTailoring ? 'custom' : 'regular'}`;
    
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, {
          id: itemId,
          productId,
          name,
          price: price + (customTailoring?.additionalCost || 0),
          image,
          color,
          size,
          quantity,
          customTailoring,
          isHomeTrial
        }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return {
    cartItems,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    openCart,
    closeCart
  };
};
