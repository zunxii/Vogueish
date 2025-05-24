"use client";
import { useState } from "react";

const initialCart = [
  { id: 1, name: "Woman Kurta with Palazzo", color: "Red", size: "M", price: 2999, quantity: 1, inStock: true },
  { id: 2, name: "Woman Kurta with Palazzo", color: "Red", size: "M", price: 2999, quantity: 1, inStock: true },
  { id: 3, name: "Woman Kurta with Palazzo", color: "Red", size: "M", price: 2999, quantity: 1, inStock: false },
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCart);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Update Quantity
  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item));
  };

  // Apply Coupon
  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      setDiscount(10);
    } else {
      alert("Invalid Coupon");
    }
  };

  // Calculate Total
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal - (subtotal * discount) / 100 + 214;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold">Shopping Bag</h2>
      <p className="text-lg font-semibold"> {cart.length} item(s) in your bag</p>

      {/* Cart Items */}
      <div className="bg-white p-6 mt-4 rounded-lg shadow-lg">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b py-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
            </div>
            <p className="text-lg font-bold">₹{item.price}</p>
            <div className="flex items-center">
              <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
              <p className="px-4">{item.quantity}</p>
              <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
            </div>
            <p className={item.inStock ? "text-green-500" : "text-red-500"}>
              {item.inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold">Coupon Code</h3>
        <p className="text-gray-600">Apply a brand or payment coupon.</p>
        <div className="flex mt-2">
          <input 
            type="text" 
            className="border p-2 flex-1 rounded" 
            placeholder="Enter coupon code" 
            value={coupon} 
            onChange={(e) => setCoupon(e.target.value)} 
          />
          <button onClick={applyCoupon} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold">Cart Total</h3>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Discount: {discount}%</p>
        <p>Convenience Fee + Delivery: ₹214</p>
        <h2 className="text-2xl font-bold mt-2">Total: ₹{total}</h2>
        <button className="mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded">Proceed to Checkout</button>
      </div>
    </div>
  );
}
