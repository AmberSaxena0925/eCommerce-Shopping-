import { useState } from 'react';
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
import LoadingScreen from './components/LoadingScreen';
import { Product } from './types';
import { useAuth } from './context/AuthContext';

type View = 'home' | 'checkout' | 'confirmation' | 'product' | 'contact' | 'products';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [orderId, setOrderId] = useState<string>('');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();
 

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

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

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
        onLogout={logout}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
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
