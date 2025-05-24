'use client'
import React from "react";
import Image from "next/image";

const ProductGrid = () => {
  const products = new Array(6).fill({
    title: "Loro Piana",
    subtitle: "Line-Blend Polo Shirt",
    price: "699$",
    img: "/white-tee.jpg"
  });

  return (
    <section className="py-24 px-6 md:px-20 bg-[#fefefe]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((item, index) => (
          <div
            key={index}
            className="rounded-xl shadow hover:shadow-md overflow-hidden bg-white"
          >
            <div className="relative w-full h-80">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h4 className="font-medium text-base">{item.title}</h4>
              <p className="text-sm text-neutral-600">{item.subtitle}</p>
              <p className="font-semibold mt-2">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
