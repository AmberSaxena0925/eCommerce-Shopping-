// import { useEffect, useState, useRef } from 'react';
// import { ArrowRight } from 'lucide-react';
// import { localCollections } from '../data/collections'; // adjust path if needed

// interface Collection {
//   id: string;
//   name: string;
//   slug: string;
//   description: string;
//   image_url: string;
//   featured?: boolean;
// }
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    title: "BRACELETS",
    category: "bracelets",
    image: "/collection/Bracelet.jpg",
  },
  {
    title: "PEARL MALAS",
    category: "pearl-malas",
    image: "/collection/Bracelet.jpg",
  },
  {
    title: "RINGS",
    category: "rings",
    image: "/collection/Ring.jpg",
  },
  {
    title: "PEARL NECKLACES",
    category: "necklaces",
    image: "/images/collections/necklace.jpg",
  },
  {
    title: "EARRINGS",
    category: "earrings",
    image: "/collection/Earring.jpg",
  },
  {
    title: "PEARLS BRACELETS",
    category: "pearls-bracelets",
    image: "/collection/Bracelet.jpg",
  },
];

export default function CollectionsPage() {
  const navigate = useNavigate();

  const handleCollectionClick = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <section className="min-h-screen bg-black text-white py-20 px-6 lg:px-16">
      <h1 className="text-4xl lg:text-5xl font-light tracking-wide mb-8">
        EXPLORE A UNIVERSE OF LUXURIOUS PEARLS.
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        {collections.map((item, index) => (
          <div
            key={index}
            className="group cursor-pointer flex flex-col"
            onClick={() => handleCollectionClick(item.category)}
          >
            <div className="relative overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex items-center justify-between mt-4 border-t border-white/40 pt-3">
              <h2 className="text-lg tracking-wide font-light">{item.title}</h2>
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
