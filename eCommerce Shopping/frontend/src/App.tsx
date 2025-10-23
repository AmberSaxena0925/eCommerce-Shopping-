import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import AuthModal from './components/AuthModal';
import ProductDetailPage from './components/ProductDetailPage';
import ContactPage from './components/ContactPage';
import ProductsPage from './components/ProductsPage';
import { Product } from './lib/supabase';

type View = 'home' | 'checkout' | 'confirmation' | 'product' | 'contact' | 'products';

function App() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [orderId, setOrderId] = useState<string>('');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // initialize from backend JWT stored in localStorage
    const token = localStorage.getItem('token');
    const init = async () => {
      if (!token) return setUser(null);
      try {
        const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';
        const res = await fetch(`${base}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem('token');
          return setUser(null);
        }
        const json = await res.json();
        setUser(json.user ?? null);
      } catch (err) {
        console.error('auth init error', err);
        localStorage.removeItem('token');
        setUser(null);
      }
    };
    init();
  }, []);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
    setIsCartOpen(true);
  };

  const handleViewProduct = (productSlug: string) => {
    setSelectedProductSlug(productSlug);
    setCurrentView('product');
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      return;
    }

    const currentItem = cartItems.find((item) => item.id === productId);
    if (!currentItem) return;

    const currentCount = cartItems.filter(
      (item) => item.id === productId
    ).length;

    if (quantity > currentCount) {
      setCartItems((prev) => [...prev, currentItem]);
    } else if (quantity < currentCount) {
      const index = cartItems.findIndex((item) => item.id === productId);
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentView('confirmation');
    setCartItems([]);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  if (currentView === 'checkout') {
    return (
      <CheckoutPage
        items={cartItems}
        onBack={() => {
          setCurrentView('home');
          setIsCartOpen(true);
        }}
        onOrderComplete={handleOrderComplete}
      />
    );
  }

  if (currentView === 'confirmation') {
    return (
      <OrderConfirmation orderId={orderId} onBackToHome={handleBackToHome} />
    );
  }

  if (currentView === 'product') {
    return (
      <ProductDetailPage
        productSlug={selectedProductSlug}
        onBack={handleBackToHome}
        onAddToCart={handleAddToCart}
      />
    );
  }

  if (currentView === 'contact') {
    return <ContactPage onBack={handleBackToHome} />;
  }

  if (currentView === 'products') {
    return (
      <ProductsPage
        onBack={handleBackToHome}
        onViewProduct={handleViewProduct}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        cartCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
  onAuthClick={() => setIsAuthModalOpen(true)}
        onContactClick={() => setCurrentView('contact')}
        onProductsClick={() => setCurrentView('products')}
        user={user}
        onLogout={async () => {
          // clear token and local user state
          localStorage.removeItem('token');
          setUser(null);
        }}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onCheckout={handleCheckout}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <Hero />
      <FeaturedCollections />
      <ProductGrid onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />
      <About />
      <Footer onContactClick={() => setCurrentView('contact')} />
    </div>
  );
}

export default App;
