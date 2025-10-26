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
  const { user, token, logout } = useAuth(); // ← Get token separately

  // Fetch cart from backend on user login
  useEffect(() => {
    const fetchCart = async () => {
      if (user && token) { // ← Check both user and token
        try {
          const response = await axios.get('http://localhost:5001/api/cart', {
            headers: { Authorization: `Bearer ${token}` }, // ← Use token from context
          });
          setCartItems(response.data);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      } else {
        // Load from localStorage for guests
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };
    fetchCart();
  }, [user, token]); // ← Add token to dependencies

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);
const handleAddToCart = async (product: Product) => {
  if (user && token) {
    try {
      // MongoDB products have _id, local products have id
      const productId = (product as any)._id || product.id;
      
      console.log('Adding product to cart:', {
        productId,
        product,
      }); // Debug log
      
      const response = await axios.post(
        'http://localhost:5001/api/cart/add',
        {
          productId: productId,
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
      
      console.log('Cart response:', response.data); // Debug log
      setCartItems(response.data);
      setIsCartOpen(true);
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show more detailed error message
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Failed to add product to cart: ${errorMsg}`);
    }
  } else {
    // Guest cart logic
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }
};

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
      setCartItems(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  } else {
    // Guest cart logic
    setCartItems((prev) =>
      prev.map((item) =>
        (item.id === productId || (item as any)._id === productId)
          ? { ...item, quantity }
          : item
      )
    );
  }
};

const handleRemoveItem = async (productId: string) => {
  if (user && token) {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/cart/remove',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  } else {
    // Guest cart logic
    setCartItems((prev) => 
      prev.filter((item) => 
        item.id !== productId && (item as any)._id !== productId
      )
    );
  }
};

  const handleViewProduct = (productSlug: string) => {
    setSelectedProductSlug(productSlug);
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
    if (!user) {
      localStorage.removeItem('guestCart');
    }
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
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
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