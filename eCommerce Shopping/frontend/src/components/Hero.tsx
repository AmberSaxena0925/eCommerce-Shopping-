import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-gradient-radial from-zinc-900 via-black to-black"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-zinc-800 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-700 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h1 className="text-7xl md:text-9xl font-light tracking-widest text-white mb-6 animate-slide-up">
          NOIR
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 tracking-wider mb-12 animate-slide-up-delay">
          Timeless Elegance in Every Detail
        </p>
        <button className="group relative px-12 py-4 text-white border border-zinc-700 hover:border-white transition-all duration-500 tracking-widest overflow-hidden">
          <span className="relative z-10 group-hover:text-black transition-colors duration-500">
            EXPLORE COLLECTION
          </span>
          <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-zinc-600" />
      </div>
    </section>
  );
}
