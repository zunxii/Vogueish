'use client';

import { useParams } from 'next/navigation';
import { products } from '@/data/products';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product, TabType } from '@/types/product';
import { Cormorant_Garamond } from 'next/font/google';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number | string;
  size: string;
  quantity: number;
  image: string;
  slug: string;
}

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number | string;
  image: string;
  slug: string;
}

export default function ProductPage() {
  const { slug } = useParams();
  const product: Product | undefined = products.find((p) => p.slug === slug);

  const images = product
    ? [
        product.mainImage,
        product.extraImage1,
        product.extraImage2,
        product.extraImage3,
        product.extraImage4,
      ].filter(Boolean) as string[]
    : [];

  const [selectedImg, setSelectedImg] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ecommerce-cart');
    const savedWishlist = localStorage.getItem('ecommerce-wishlist');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    if (savedWishlist) {
      const wishlistData = JSON.parse(savedWishlist);
      setWishlist(wishlistData);
      setIsInWishlist(wishlistData.some((item: WishlistItem) => item.slug === slug));
    }
  }, [slug]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecommerce-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = () => {
    if (!product || !selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartItemId = `${product.slug}-${selectedSize}`;
    const existingItemIndex = cart.findIndex(item => item.id === cartItemId);

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: cartItemId,
        productId: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.discountedPrice,
        size: selectedSize,
        quantity: quantity,
        image: product.mainImage,
        slug: product.slug,
      };
      setCart([...cart, newCartItem]);
    }

    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const toggleWishlist = () => {
    if (!product) return;

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.slug !== product.slug);
      setWishlist(updatedWishlist);
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      const wishlistItem: WishlistItem = {
        id: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.discountedPrice,
        image: product.mainImage,
        slug: product.slug,
      };
      setWishlist([...wishlist, wishlistItem]);
      setIsInWishlist(true);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8f6] p-6 md:p-12 text-neutral-800">
      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Added to cart!
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-16 max-w-7xl mx-auto">
        {/* Left - Images */}
        <div className="flex gap-6">
          {/* Thumbnails */}
          <div className="flex flex-col gap-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(img)}
                className={`overflow-hidden border rounded-lg w-16 h-16 ${
                  selectedImg === img ? 'ring-2 ring-neutral-800' : ''
                }`}
              >
                <Image
                  src={img}
                  alt={`thumb-${i}`}
                  width={60}
                  height={60}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={selectedImg}
              alt="main"
              fill
              className="object-cover transition-all duration-300"
            />
            
            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">
              {product.brand}
            </h3>
            <h1 className={`text-4xl font-semibold ${cormorant.className}`}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(128 reviews)</span>
            </div>

            <div className="flex items-center gap-3 text-xl mt-3">
              ₹{product.discountedPrice.toLocaleString()}
              <span className="line-through text-gray-400 text-base">
                ₹{product.realPrice.toLocaleString()}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {Math.round(((product.realPrice - product.discountedPrice) / product.realPrice) * 100)}% OFF
              </span>
            </div>

            {/* Sizes */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Size</h4>
              <div className="flex gap-3 flex-wrap">
                {product.sizesAvailable.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Quantity</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-3 mt-8">
            <button 
              onClick={addToCart}
              className="w-full bg-black text-white py-4 rounded-full text-sm tracking-wide uppercase hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
            
            {getCartItemCount() > 0 && (
              <div className="text-center text-sm text-gray-600">
                Cart: {getCartItemCount()} item{getCartItemCount() !== 1 ? 's' : ''}
              </div>
            )}
          </div>

            {/* Tabs */}
            <div className="mt-10">
              <div className="flex gap-6 border-b">
                {(['description', 'details', 'returns'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2 text-sm font-medium capitalize transition-all ${
                      activeTab === tab
                        ? 'border-b-2 border-black text-black'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm leading-relaxed text-gray-700 min-h-[80px]">
                {activeTab === 'description' && <p>{product.description}</p>}
                {activeTab === 'details' && (
                  <div className="space-y-2">
                    <p><strong>Material:</strong> Premium Cotton Blend</p>
                    <p><strong>Care Instructions:</strong> Machine wash cold, tumble dry low</p>
                    <p><strong>Fit:</strong> Regular fit</p>
                    <p><strong>Origin:</strong> Made in India</p>
                  </div>
                )}
                {activeTab === 'returns' && (
                  <div className="space-y-2">
                    <p>Easy 30-day returns and exchanges</p>
                    <p>Free return shipping for orders above ₹1999</p>
                    <p>Items must be unused with original tags</p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-3 gap-4 py-4 border-t">
              <div className="flex flex-col items-center text-center">
                <Truck className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-xs text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Shield className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-xs text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <RotateCcw className="w-6 h-6 text-gray-600 mb-2" />
                <span className="text-xs text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}