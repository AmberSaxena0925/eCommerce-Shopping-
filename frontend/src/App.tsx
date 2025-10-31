import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import FeaturedCollections from './components/FeaturedCollections';
import About from './components/About';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import ContactPage from './components/ContactPage';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import LoadingScreen from './components/LoadingScreen';
import AdminProductForm from './components/AdminProductForm';
import AdminCollectionForm from './components/AdminCollectionForm';
import UserOrdersPage from './components/UserOrdersPage';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './context/AuthContext';

type View = 'home' | 'contact' | 'products' | 'product-detail' | 'checkout' | 'order-confirmation' | 'orders' | 'admin-dashboard';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  in_stock: boolean;
  materials: string[];
}

interface CartItem extends Product {
  quantity: number;
}

function App() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminProductFormOpen, setIsAdminProductFormOpen] = useState(false);
  const [isAdminCollectionFormOpen, setIsAdminCollectionFormOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (user) {
      syncCartWithBackend();
    }
  }, [user]);

  const syncCartWithBackend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // Transform backend cart to frontend format
        const items = data.reduce((acc: CartItem[], item: any) => {
          const existing = acc.find((i) => i.id === item.id);
          if (existing) {
            existing.quantity += item.quantity || 1;
          } else {
            acc.push({ ...item, quantity: item.quantity || 1 });
          }
          return acc;
        }, []);
        setCartItems(items);
      }
    } catch (err) {
      console.error('Failed to sync cart', err);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (user) {
      // If logged in, add to backend
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            description: product.description,
            materials: product.materials,
            slug: product.slug,
            quantity: 1,
          }),
        });

        if (res.ok) {
          await syncCartWithBackend();
        }
      } catch (err) {
        console.error('Failed to add to cart', err);
      }
    } else {
      // If not logged in, use local state
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/cart/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (res.ok) {
          await syncCartWithBackend();
        }
      } catch (err) {
        console.error('Failed to update cart', err);
      }
    } else {
      if (quantity === 0) {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
      } else {
        setCartItems((prev) =>
          prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
      }
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        });

        if (res.ok) {
          await syncCartWithBackend();
        }
      } catch (err) {
        console.error('Failed to remove from cart', err);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView('checkout');
    setIsCartOpen(false);
  };

  const handleOrderComplete = async (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentView('order-confirmation');
    setCartItems([]);
    
    // Clear backend cart if user is logged in
    if (user) {
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/cart/clear', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Failed to clear cart', err);
      }
    }
  };

  const handleViewProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProductSlug(null);
    setOrderId(null);
  };

  const handleLogout = () => {
    logout();
    setCartItems([]);
    setCurrentView('home');
  };

  const handleAdminProductSuccess = () => {
    // Refresh products if needed
    console.log('Product created successfully!');
  };

  const handleAdminCollectionSuccess = () => {
    // Refresh collections if needed
    console.log('Collection created successfully!');
  };

  // Convert cartItems for display (flatten duplicates)
  const cartItemsForCheckout = cartItems.flatMap((item) =>
    Array(item.quantity).fill({ ...item, quantity: 1 })
  );

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onContactClick={() => setCurrentView('contact')}
        onProductsClick={() => setCurrentView('products')}
        onAdminAddProduct={() => setIsAdminProductFormOpen(true)}
        onAdminDashboardClick={() => setCurrentView('admin-dashboard')}
        onOrdersClick={() => setCurrentView('orders')}
        onHomeClick={handleBackToHome}
        onAdminAddCollection={() => setIsAdminCollectionFormOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {currentView === 'home' && (
        <>
          <Hero />
          <FeaturedCollections />
          <ProductGrid onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />
          <About />
          <Footer onContactClick={() => setCurrentView('contact')} />
        </>
      )}

      {currentView === 'contact' && <ContactPage onBack={handleBackToHome} />}

      {currentView === 'products' && (
        <ProductsPage
          onBack={handleBackToHome}
          onViewProduct={handleViewProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {currentView === 'product-detail' && selectedProductSlug && (
        <ProductDetailPage
          productSlug={selectedProductSlug}
          onBack={handleBackToHome}
          onAddToCart={handleAddToCart}
        />
      )}

      {currentView === 'checkout' && (
        <CheckoutPage
          items={cartItemsForCheckout}
          onBack={() => setIsCartOpen(true)}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {currentView === 'order-confirmation' && orderId && (
        <OrderConfirmation orderId={orderId} onBackToHome={handleBackToHome} />
      )}

      {currentView === 'orders' && (
        <UserOrdersPage onBack={handleBackToHome} />
      )}

      {currentView === 'admin-dashboard' && (
        <AdminDashboard onClose={handleBackToHome} />
      )}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onCheckout={handleCheckout}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />

      <AdminProductForm
        isOpen={isAdminProductFormOpen}
        onClose={() => setIsAdminProductFormOpen(false)}
        onSuccess={handleAdminProductSuccess}
      />

      <AdminCollectionForm
        isOpen={isAdminCollectionFormOpen}
        onClose={() => setIsAdminCollectionFormOpen(false)}
        onSuccess={handleAdminCollectionSuccess}
      />
    </div>
  );
}

export default App;