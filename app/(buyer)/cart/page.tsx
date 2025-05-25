"use client";
import { useState } from "react";
import { Plus, Minus, ShoppingBag, Tag, Shield, Truck, ArrowRight, X, Check } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  inStock: boolean;
}

interface Coupon {
  code: string;
  discount: number;
  description: string;
}

const initialCart: CartItem[] = [
  { id: 1, name: "Woman Kurta with Palazzo", color: "Crimson Red", size: "M", price: 2999, quantity: 1, inStock: true },
  { id: 2, name: "Woman Kurta with Palazzo", color: "Deep Navy", size: "L", price: 2999, quantity: 2, inStock: true },
  { id: 3, name: "Premium Silk Kurta Set", color: "Ivory White", size: "S", price: 4299, quantity: 1, inStock: false },
];

const coupons: Coupon[] = [
  { code: "SAVE10", discount: 10, description: "Get 10% off your order" },
  { code: "WELCOME20", discount: 20, description: "New customer discount" },
  { code: "PREMIUM25", discount: 25, description: "Premium member exclusive" },
];

export default function ProfessionalCart() {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [showCoupons, setShowCoupons] = useState<boolean>(false);

  const updateQuantity = (id: number, change: number): void => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    ));
  };

  const removeItem = (id: number): void => {
    setCart(cart.filter(item => item.id !== id));
  };

  const applyCouponCode = (): void => {
    const validCoupon = coupons.find(c => c.code === coupon.toUpperCase());
    if (validCoupon) {
      setDiscount(validCoupon.discount);
      setAppliedCoupon(coupon.toUpperCase());
      setCoupon("");
      setShowCoupons(false);
    } else {
      alert("Invalid coupon code");
    }
  };

  const removeCoupon = (): void => {
    setDiscount(0);
    setAppliedCoupon("");
  };

  const subtotal: number = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount: number = (subtotal * discount) / 100;
  const shippingFee: number = 214;
  const total: number = subtotal - discountAmount + shippingFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-gray-900" />
            <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
            <span className="text-sm text-gray-500 ml-2">({cart.length} items)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Items</h2>
                
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div key={item.id} className={`flex gap-4 ${index !== cart.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                      {/* Product Image Placeholder */}
                      <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-16 h-20 bg-gray-200 rounded"></div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-base font-medium text-gray-900 leading-tight">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors ml-4"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          <div className="flex items-center gap-2">
                            <span>Color:</span>
                            <span className="font-medium">{item.color}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Size:</span>
                            <span className="font-medium">{item.size}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <div className="px-4 py-2 text-sm font-medium text-gray-900 border-x border-gray-300">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Price and Stock */}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className={`text-xs mt-1 ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Promo Code
                  </h3>
                  {!showCoupons && (
                    <button
                      onClick={() => setShowCoupons(true)}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      View available codes
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Code {appliedCoupon} applied</div>
                        <div className="text-sm text-green-700">You saved ₹{discountAmount.toLocaleString()}</div>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={applyCouponCode}
                      className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {showCoupons && !appliedCoupon && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Available codes:</span>
                      <button
                        onClick={() => setShowCoupons(false)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Hide
                      </button>
                    </div>
                    {coupons.map(c => (
                      <button
                        key={c.code}
                        onClick={() => setCoupon(c.code)}
                        className="w-full text-left p-3 border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{c.code}</div>
                            <div className="text-sm text-gray-600">{c.description}</div>
                          </div>
                          <div className="text-sm font-medium text-green-600">{c.discount}% OFF</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount ({discount}%)</span>
                      <span className="text-green-600">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Shipping
                    </span>
                    <span className="text-gray-900">₹{shippingFee}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">Total</span>
                      <span className="text-xl font-semibold text-gray-900">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-600">Secure Payment</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Truck className="w-5 h-5 text-gray-600" />
                      <span className="text-xs text-gray-600">Free Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}