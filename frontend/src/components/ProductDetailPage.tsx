import { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingBag, Heart, Share2, Check } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';

interface ProductDetailPageProps {
  productSlug: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailPage({
  productSlug,
  onBack,
  onAddToCart,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [productSlug]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', productSlug)
      .maybeSingle();

    if (!error && data) {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 text-center">
          <p className="text-xl mb-4">Product not found</p>
          <button
            onClick={onBack}
            className="text-white hover:underline"
          >
            Return to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-8 animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="tracking-wider">BACK TO SHOP</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-zinc-950 border border-zinc-800 overflow-hidden">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-zinc-950 border-2 overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'border-white'
                        : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-light tracking-wider text-white mb-4">
                {product.name}
              </h1>
              <p className="text-4xl text-white tracking-wider mb-6">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b border-zinc-800 py-6">
              <h3 className="text-zinc-400 text-sm tracking-wider mb-3">
                MATERIALS
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material, index) => (
                  <span
                    key={index}
                    className="bg-zinc-950 border border-zinc-800 px-4 py-2 text-white tracking-wide"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-zinc-400 text-sm tracking-wider mb-3">
                QUANTITY
              </h3>
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-zinc-950 border border-zinc-800 text-white hover:border-white transition-colors"
                >
                  -
                </button>
                <span className="text-white text-xl w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-zinc-950 border border-zinc-800 text-white hover:border-white transition-colors"
                >
                  +
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock || addedToCart}
                  className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>
                        {product.in_stock ? 'ADD TO BAG' : 'OUT OF STOCK'}
                      </span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button className="border border-zinc-800 text-white py-4 tracking-widest hover:border-white transition-colors flex items-center justify-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>SAVE</span>
                  </button>
                  <button className="border border-zinc-800 text-white py-4 tracking-widest hover:border-white transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>SHARE</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-light mb-1">
                    Complimentary Gift Packaging
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Each piece arrives in our signature box
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-light mb-1">
                    Lifetime Warranty
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Guaranteed craftsmanship and quality
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-light mb-1">
                    Free Shipping
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Complimentary delivery on all orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
