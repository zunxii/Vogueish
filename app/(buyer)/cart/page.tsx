"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import CartHeader from "@/components/cart/CartHeader";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItem from "@/components/cart/CartItem";
import PromoCode from "@/components/cart/PromoCode";
import OrderSummary from "@/components/cart/OrderSummary";
import WishlistSidebar from "@/components/cart/WishListSidebar";

export default function CartPage() {
  const {
    cart,
    wishlist,
    isLoading,
    notification,
    clearCart,
    updateQuantity,
    removeItem,
    moveToWishlist,
    applyCouponCode,
    removeCoupon,
    appliedCoupon,
    discount,
    getSavings,
    coupons,
    getSubtotal,
  } = useCart();

  const subtotal = getSubtotal();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {notification}
        </div>
      )}

      {/* Header */}
      <CartHeader cartLength={cart.length} onClearCart={clearCart} />

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                    <span className="text-sm text-green-600 font-medium">
                      You&apos;re saving ₹
                      {typeof getSavings() === "number"
                        ? getSavings().toLocaleString()
                        : "0"}{" "}
                      on this order!
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {cart.map((item, index) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        isLast={index === cart.length - 1}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onMoveToWishlist={moveToWishlist}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Promo Code Section */}
              <PromoCode
                coupons={coupons}
                appliedCoupon={appliedCoupon}
                discount={discount}
                subtotal={subtotal}
                onApplyCoupon={applyCouponCode}
                onRemoveCoupon={removeCoupon}
              />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <OrderSummary />
              
              {/* Wishlist Sidebar */}
              {wishlist.length > 0 && <WishlistSidebar wishlist={wishlist} />}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Mobile-First Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}