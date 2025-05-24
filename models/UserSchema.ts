// models/UserSchema.ts
import mongoose, { Schema, model, models } from 'mongoose';

// Base user schema with shared fields
const baseUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true,
  },
});

// Buyer-specific schema
const buyerSchema = new Schema({
  // Add buyer-specific fields here
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      isDefault: Boolean,
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});

// Seller-specific schema
const sellerSchema = new Schema({
  // Add seller-specific fields here
  gst: {
    type: String,
    required: true,
  },
  companyName: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  stores: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  onboardingComplete: {
    type: Boolean,
    default: false,
  },
});

// Create models
export const User = models.User || model('User', baseUserSchema);
export const Buyer = models.Buyer || model('Buyer', buyerSchema);
export const Seller = models.Seller || model('Seller', sellerSchema);