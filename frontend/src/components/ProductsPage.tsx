import { useEffect, useState } from 'react';
import { ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { localProducts } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id?: string;
  images: string[];
  materials: string[];
  in_stock: boolean;
  category?: string;
}

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'earring', name: 'Earring' },
  { id: 'ring', name: 'Ring' },
  { id: 'necklace', name: 'Necklace' },
  { id: 'Pearls Malas', name: 'Pearls Malas' },
  { id: 'bracelet', name: 'Bracelet' },
];

interface ProductsPageProps {
  onBack: () => void;
  onViewProduct: (productSlug: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductsPage({
  onBack,
  onViewProduct,
  onAddToCart,
}: ProductsPageProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyCategoryFilter();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const text = await res.text();

      let backendProducts: Product[] = [];
      if (res.ok && text) {
        const data = JSON.parse(text);
        backendProducts = Array.isArray(data) ? data : [];
      }

      const combinedProducts = [...backendProducts, ...localProducts];
      setAllProducts(combinedProducts);
      setProducts(combinedProducts);
    } catch (err) {
      console.error('Failed to load products', err);
      setAllProducts(localProducts);
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const applyCategoryFilter = () => {
    if (selectedCategory === 'all') {
      setProducts(allProducts);
    } else {
      setProducts(
        allProducts.filter(
          (p) => p.category?.toLowerCase() === selectedCategory
        )
      );
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-black px-2 py-11 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
      <center>
         <div className="mb-12 animate-fade-in">
          <h1 className="text-6xl font-light tracking-widest text-white mb-4">
            ALL PRODUCTS
          </h1>
          <p className="text-zinc-400 text-lg tracking-wide">
            Explore our complete collection of fine jewelry
          </p>
        </div>
      </center>


        <div className="flex gap-8">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-zinc-950 border border-zinc-800 p-6 sticky top-24">
              <h2 className="text-xl font-light tracking-wider text-white mb-6">
                CATEGORIES
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-4 py-3 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-white text-black'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filter */}
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="bg-white text-black p-4 rounded-full shadow-lg hover:bg-zinc-200 transition-colors flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-6 h-6" />
              <span className="tracking-wider font-medium">FILTER</span>
            </button>
          </div>

          {isMobileFilterOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 z-50 p-6 rounded-t-2xl animate-slide-up max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light tracking-wider text-white">
                    FILTER BY CATEGORY
                  </h2>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full text-left px-4 py-3 transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-white text-black'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center text-zinc-400 py-20">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 text-lg mb-4">
                  No products found in this category
                </p>
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="text-white hover:underline"
                >
                  View all products
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-zinc-400">
                    {products.length}{' '}
                    {products.length === 1 ? 'product' : 'products'}
                  </p>
                  <div className="text-zinc-600 text-sm">
                    {selectedCategory === 'all'
                      ? 'All Categories'
                      : categories.find((c) => c.id === selectedCategory)?.name}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="group relative bg-zinc-950 border border-zinc-800 overflow-hidden hover:border-zinc-600 transition-all duration-500"
                      style={{
                        animation: `fade-in-up 0.5s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      {/* Card Content */}
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
                          <span className="tracking-wider text-sm">
                            ADD TO BAG
                          </span>
                        </button>

                        {!product.in_stock && (
                          <div className="absolute top-4 right-4 bg-zinc-900 text-white px-3 py-1 text-xs tracking-wider">
                            OUT OF STOCK
                          </div>
                        )}
                      </div>

                      <div
                        className="p-6 cursor-pointer"
                        onClick={() => onViewProduct(product.slug)}
                      >
                        <h3 className="text-lg font-light tracking-wide text-white mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl text-white tracking-wider">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
