'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);  // dynamic cart count
  const pathname = usePathname();

  const isAuthenticated = false;

  // Pages where navbar should always be white, including shop slug pages
  const isForceWhite =
    pathname === '/shop' ||
    pathname === '/cart' ||
    pathname.startsWith('/shop/');  // Handles slug pages like /shop/blue-dress

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const cart = localStorage.getItem('ecommerce-cart');
        if (cart) {
          const cartItems = JSON.parse(cart);
          // Assuming cartItems is an array of items
          setCartItemCount(cartItems.length);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
        setCartItemCount(0);
      }
    };

    loadCart();

    // Optional: Listen for storage event to update cart count if other tabs/windows update it
    const onStorageChange = (e) => {
      if (e.key === 'ecommerce-cart') {
        loadCart();
      }
    };
    window.addEventListener('storage', onStorageChange);

    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  return (
    <nav
      className={clsx(
        'top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out',
        isForceWhite
          ? 'bg-white shadow-md'
          : isScrolled
          ? 'bg-white shadow-md fixed'
          : 'bg-transparent shadow-none fixed'
      )}
    >
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="ml-2">
            <Image
              src="/Nav-logo.png"
              alt="Vogueish Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-12 text-gray-700 text-lg">
          <Link href="/shop" className="hover:text-black">Shop</Link>
          <Link href="/ai-bot" className="hover:text-black">AI Bot</Link>
          <Link href="/custom-tailoring" className="hover:text-black">Custom Tailoring</Link>
          <Link href="/home-trials" className="hover:text-black">Home Trials</Link>
        </div>

        {/* Icons */}
        <div className="flex space-x-4 items-center">
          <Link href="/cart" className="relative p-2 text-black rounded-full">
            <div className="relative">
              <ShoppingBag size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </div>
          </Link>
          <Link href={isAuthenticated ? "/my-account" : "/login"} className="p-2 text-black rounded-full">
            <User size={24} />
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-5 flex flex-col z-50">
          <button onClick={() => setIsOpen(false)} className="self-end p-2">
            <X size={24} />
          </button>
          <nav className="mt-6 space-y-4 text-lg text-gray-700">
            <Link href="/shop" className="block" onClick={() => setIsOpen(false)}>Shop</Link>
            <Link href="/ai-bot" className="block" onClick={() => setIsOpen(false)}>AI Bot</Link>
            <Link href="/custom-tailoring" className="block" onClick={() => setIsOpen(false)}>Custom Tailoring</Link>
            <Link href="/home-trials" className="block" onClick={() => setIsOpen(false)}>Home Trials</Link>
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
