"use client";
import React, { createContext, useContext, useState } from "react";

interface CartModalContextType {
  isCartModalOpen: boolean;
  isOpen: boolean;  
  openCartModal: () => void;
  closeCartModal: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
}

const CartModalContext = createContext<CartModalContextType | undefined>(
  undefined
);

export const useCartModalContext = () => {
  const context = useContext(CartModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

export const CartModalProvider = ({ children }) => {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openSearchModal = () => {
    setIsOpen(true);
  };

  const closeSearchModal = () => {
    setIsOpen(false);
  };

  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  return (
    <CartModalContext.Provider
      value={{ isCartModalOpen, openCartModal, closeCartModal,openSearchModal,closeSearchModal,isOpen }}
    >
      {children}
    </CartModalContext.Provider>
  );
};
