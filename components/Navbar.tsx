'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ShoppingBag, Heart, User } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isAuthenticated = false;

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <nav
    className={clsx(
      'top-0 left-0 w-full z-50 transition-colors duration-300 ease-in-out',
      isHome
        ? clsx(
            'fixed',
            isScrolled ? 'bg-white shadow-md' : 'bg-transparent shadow-none'
          )
        : 'sticky bg-white shadow-md'
    )}
    >
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="ml-2">
            <Image src="/Nav-logo.png" alt="Vogueish Logo" width={120} height={40} />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-12 text-gray-700 text-lg">
          <Link href="/shop" className="hover:text-black">Topwear</Link>
          <Link href="/shop" className="hover:text-black">Bottomwear</Link>
          <Link href="/brands" className="hover:text-black">Brands</Link>
        </div>

        {/* Icons */}
        <div className="flex space-x-4">
          <Link href="/search" className="p-2"><Search size={24} /></Link>
          <Link href="/cart" className="p-2 text-black rounded-full"><ShoppingBag size={24} /></Link>
          <Link href="/wishlist" className="p-2 text-black rounded-full"><Heart size={24} /></Link>
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
            <Link href="/topwear" className="block" onClick={() => setIsOpen(false)}>Topwear</Link>
            <Link href="/bottomwear" className="block" onClick={() => setIsOpen(false)}>Bottomwear</Link>
            <Link href="/brands" className="block" onClick={() => setIsOpen(false)}>Brands</Link>
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
