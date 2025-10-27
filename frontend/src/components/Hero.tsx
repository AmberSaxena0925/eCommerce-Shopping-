import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Parallax gradient background */}
      <div
        className="absolute inset-0 bg-gradient-radial from-neutral-900 via-neutral-950 to-black"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      {/* Glowing ambient shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-800 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-700 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 animate-fade-in">
        {/* ✅ Logo with glowing white background */}
        <div className="relative inline-block mx-auto mb-6 animate-slide-up">
          <img
            src="/Logo2.png"
            alt="NOIR Logo"
            className="relative mx-auto w-40 md:w-80 "
          />
        </div>

        <p className="text-xl md:text-2xl text-gray-400 tracking-wider mb-12 animate-slide-up-delay">
          ADD YOUR ELEGANCE TO YOUR LIFESTYLE
        </p>

        <button className="group relative px-12 py-4 text-white border border-gray-700 hover:border-gray-300 transition-all duration-500 tracking-widest overflow-hidden">
          <span className="relative z-10 group-hover:text-black transition-colors duration-500">
            EXPLORE COLLECTION
          </span>
          <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-gray-500" />
      </div>
    </section>
  );
}
