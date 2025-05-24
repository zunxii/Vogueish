'use client';

import { useParams } from 'next/navigation';
import { products } from '@/data/products';
import Image from 'next/image';
import { useState } from 'react';
import { Product, TabType } from '@/types/product';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

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

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f8f6] p-6 md:p-12 text-neutral-800">
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
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300"
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-1">{product.brand}</h3>
            <h1 className={`text-4xl font-semibold ${cormorant.className}`}>
              {product.name}
            </h1>

            <div className="flex items-center gap-3 text-xl mt-3">
              ₹{product.discountedPrice}
              <span className="line-through text-gray-400 text-base">₹{product.realPrice}</span>
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
                {activeTab === 'details' && <p>Product Details Coming Soon...</p>}
                {activeTab === 'returns' && <p>Return Policy Coming Soon...</p>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div>
            <button className="w-full bg-black text-white py-4 rounded-full text-sm tracking-wide uppercase hover:bg-neutral-800 transition-all duration-300">
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
