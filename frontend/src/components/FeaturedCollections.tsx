import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { localCollections } from '../data/collections'; // adjust path if needed

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured?: boolean;
}

export default function FeaturedCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collections?featured=true');
      const text = await res.text();

      let backendCollections: Collection[] = [];

      if (!res.ok) {
        console.error('Failed to fetch /api/collections', res.status, text);
      } else {
        const data = text ? JSON.parse(text) : [];
        backendCollections = Array.isArray(data) ? data : [];
      }

      const combined = [...backendCollections, ...localCollections].filter(
        (c) => c.featured
      );

      const deduped = Array.from(
        new Map(combined.map((c) => [c.slug, c])).values()
      );

      setCollections(deduped);
    } catch (err) {
      console.error('Failed to load collections', err);
      setCollections(localCollections.filter((c) => c.featured));
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto-slide animation
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let scrollAmount = 0;
    const slideSpeed = 1; // pixels per frame
    let animationFrame: number;

    const scroll = () => {
      if (!slider) return;
      scrollAmount += slideSpeed;
      if (scrollAmount >= slider.scrollWidth / 2) {
        scrollAmount = 0;
      }
      slider.scrollLeft = scrollAmount;
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    // Pause on hover
    const stop = () => cancelAnimationFrame(animationFrame);
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', () => {
      animationFrame = requestAnimationFrame(scroll);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      slider.removeEventListener('mouseenter', stop);
    };
  }, [collections]);

  if (loading) {
    return (
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-zinc-400">Loading...</div>
        </div>
      </section>
    );
  }

  // 🔄 Duplicate collections for seamless infinite scroll
  const doubledCollections = [...collections, ...collections];

  return (
    <section id="collections" className="py-24 bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-widest text-white mb-4">
            COLLECTIONS
          </h2>
          <p className="text-zinc-400 tracking-wide">
            Curated selections of our finest pieces
          </p>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-scroll no-scrollbar snap-x snap-mandatory"
        >
          {doubledCollections.map((collection, index) => (
            <div
              key={`${collection.id}-${index}`}
              className="group relative overflow-hidden flex-shrink-0 snap-center w-[300px] sm:w-[400px] md:w-[450px] h-[450px] cursor-pointer rounded-2xl"
            >
              <img
                src={collection.image_url}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-light tracking-widest text-white mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                  {collection.name.toUpperCase()}
                </h3>
                <p className="text-zinc-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {collection.description}
                </p>
                <button className="flex items-center space-x-2 text-white border border-white px-6 py-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="tracking-wider">VIEW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
