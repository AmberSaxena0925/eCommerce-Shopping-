import { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onViewProduct: (productSlug: string) => void;
}

export default function ProductGrid({ onAddToCart, onViewProduct }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-zinc-400">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-widest text-white mb-4">
            FEATURED PIECES
          </h2>
          <p className="text-zinc-400 tracking-wide">
            Discover our signature creations
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative bg-black border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all duration-500"
              style={{
                animation: `fade-in-up 0.8s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => onViewProduct(product.slug)}
              >
                <img
                  src={product.images[0] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-500"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="tracking-wider">ADD TO BAG</span>
                </button>
              </div>

              <div className="p-6 cursor-pointer" onClick={() => onViewProduct(product.slug)}>
                <h3 className="text-xl font-light tracking-wide text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl text-white tracking-wider">
                    ${product.price.toLocaleString()}
                  </span>
                  <div className="flex gap-1">
                    {product.materials.slice(0, 2).map((material, i) => (
                      <span
                        key={i}
                        className="text-xs text-zinc-600 border border-zinc-800 px-2 py-1"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
