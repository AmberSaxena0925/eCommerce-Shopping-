import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  onHomeClick: () => void;       // ← Navigate to home page
  onProductsClick: () => void;   // ← Navigate to products page
  onContactClick: () => void;    // ← Navigate to contact page
  user: any;
  onLogout: () => void;
}

export default function Navbar({
  cartCount,
  onCartClick,
  onAuthClick,
  onHomeClick,
  onProductsClick,
  onContactClick,
  user,
  onLogout,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Home */}
          <div
            className="text-2xl font-light tracking-widest text-white cursor-pointer"
            onClick={onHomeClick}
          >
            SAI NAMAN PEARLS
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <button
              onClick={onHomeClick}
              className="text-zinc-400 hover:text-white transition-colors tracking-wide"
            >
              HOME
            </button>
            <button
              onClick={onProductsClick}
              className="text-zinc-400 hover:text-white transition-colors tracking-wide"
            >
              PRODUCTS
            </button>
            <button
              onClick={onContactClick}
              className="text-zinc-400 hover:text-white transition-colors tracking-wide"
            >
              CONTACT
            </button>
            <a
              href="#about"
              className="text-zinc-400 hover:text-white transition-colors tracking-wide"
            >
              ABOUT
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-zinc-400" />
                  <span className="text-zinc-400 text-sm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-zinc-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="hidden md:flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm tracking-wide">LOGIN</span>
              </button>
            )}
            <button onClick={onCartClick} className="relative group">
              <ShoppingBag className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-zinc-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm border-t border-zinc-800">
          <div className="flex flex-col space-y-6 p-6">
            <button
              onClick={onHomeClick}
              className="text-zinc-400 hover:text-white transition-colors tracking-wide text-left"
            >
              HOME
            </button>
            <button
              onClick={onProductsClick}
              className="text-zinc-400 hover:text-white transition-colors tracking-wide text-left"
            >
              PRODUCTS
            </button>
            <button
              onClick={onContactClick}
              className="text-zinc-400 hover:text-white transition-colors tracking-wide text-left"
            >
              CONTACT
            </button>
            <a
              href="#about"
              className="text-zinc-400 hover:text-white transition-colors tracking-wide"
            >
              ABOUT
            </a>
            {user ? (
              <button
                onClick={onLogout}
                className="text-zinc-400 hover:text-white transition-colors tracking-wide text-left"
              >
                LOGOUT
              </button>
            ) : (
              <button
                onClick={onAuthClick}
                className="text-zinc-400 hover:text-white transition-colors tracking-wide text-left"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
