// src/App.tsx
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
import LoadingScreen from './components/LoadingScreen';
import { Product } from './types';
import { useAuth } from './context/AuthContext';
import axios from 'axios';

// ✅ Import Toastify
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CartItem extends Product {
  quantity: number;
}

type View = 'home' | 'checkout' | 'confirmation' | 'product' | 'contact' | 'products';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [orderId, setOrderId] = useState<string>('');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, token, logout } = useAuth();

  // Fetch cart from backend or localStorage
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) {
        try {
          const response = await axios.get('http://localhost:5001/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartItems(response.data || []);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
      }
    };
    fetchCart();
  }, [user, token]);

  // Save guest cart
  useEffect(() => {
    if (!user) localStorage.setItem('guestCart', JSON.stringify(cartItems));
  }, [cartItems, user]);

  // ✅ Add product to cart with Toast
  const handleAddToCart = async (product: Product) => {
    if (user && token) {
      try {
        const productId = (product as any)._id || product.id;
        const response = await axios.post(
          'http://localhost:5001/api/cart/add',
          {
            productId,
            name: product.name,
            price: product.price,
            images: product.images || [],
            description: product.description || '',
            materials: product.materials || [],
            slug: product.slug || productId,
            quantity: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data || []);
        setIsCartOpen(true);
        toast.success(`${product.name} added to your cart 🛍️`, { transition: Bounce });
      } catch (error: any) {
        console.error('Full error:', error);
        toast.error(`Failed to add product: ${error.response?.data?.message || error.message}`);
      }
    } else {
      // Guest cart
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      setIsCartOpen(true);
      toast.success(`${product.name} added to your bag 🛍️`, { transition: Bounce });
    }
  };

  // ✅ Update quantity
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    if (user && token) {
      try {
        const response = await axios.post(
          'http://localhost:5001/api/cart/update',
          { productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data || []);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId || (item as any)._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // ✅ Remove item from cart with Toast
  const handleRemoveItem = async (productId: string) => {
    if (user && token) {
      try {
        const response = await axios.post(
          'http://localhost:5001/api/cart/remove',
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(response.data || []);
        toast.info('Item removed from cart 🗑️', { transition: Bounce });
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      setCartItems((prev) =>
        prev.filter((item) => item.id !== productId && (item as any)._id !== productId)
      );
      toast.info('Item removed 🗑️', { transition: Bounce });
    }
  };

  // ✅ Other handlers
  const handleViewProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentView('product');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleOrderComplete = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentView('confirmation');
    setCartItems([]);
    if (!user) localStorage.removeItem('guestCart');
    toast.success('🎉 Order placed successfully!', { transition: Bounce });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <LoadingScreen onComplete={() => setIsLoading(false)} />;

  return (
    <div className="min-h-screen bg-black">
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onHomeClick={handleBackToHome}
        onProductsClick={() => setCurrentView('products')}
        onContactClick={() => setCurrentView('contact')}
        user={user}
        onLogout={logout}
      />

      {/* Auth modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Cart sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onCheckout={handleCheckout}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Page content */}
      {currentView === 'home' && (
        <>
          <Hero />
          <FeaturedCollections />
          <ProductGrid onAddToCart={handleAddToCart} onViewProduct={handleViewProduct} />
          <About />
        </>
      )}

      {currentView === 'products' && (
        <ProductsPage onBack={handleBackToHome} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} />
      )}

      {currentView === 'product' && (
        <ProductDetailPage productSlug={selectedProductSlug} onBack={handleBackToHome} onAddToCart={handleAddToCart} />
      )}

      {currentView === 'checkout' && (
        <CheckoutPage items={cartItems} onBack={handleBackToHome} onOrderComplete={handleOrderComplete} />
      )}

      {currentView === 'confirmation' && <OrderConfirmation orderId={orderId} onBackToHome={handleBackToHome} />}

      {currentView === 'contact' && <ContactPage onBack={handleBackToHome} />}

      {/* Footer */}
      <Footer onContactClick={() => setCurrentView('contact')} />

      {/* ✅ Toast container (must be at bottom of App) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default App;
