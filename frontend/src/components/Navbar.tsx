import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/shop?cat=3d-models', label: '3D Models' },
    { to: '/shop?cat=textures', label: 'Textures' },
    { to: '/shop?cat=hdri', label: 'HDRI' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-olive/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Left — Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide uppercase transition-colors ${
                    isActive ? 'text-olive' : 'text-dark/60 hover:text-dark'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Center — Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-2xl font-black tracking-wider text-dark hover:text-olive transition-colors"
          >
            RENDERHAVEN
          </Link>

          {/* Right — Icons */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-olive/10 transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-dark/70" />
            </button>

            <Link
              to={user ? '/profile' : '/login'}
              className="p-2 rounded-full hover:bg-olive/10 transition-colors"
              aria-label="Account"
            >
              <User size={20} className="text-dark/70" />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-olive/10 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-dark/70" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-yellow text-dark text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              to="/shop"
              className="hidden sm:inline-flex ml-2 items-center gap-2 bg-yellow text-dark font-semibold text-sm px-5 py-2 rounded-full hover:bg-yellow/80 transition-colors"
            >
              Shop Now
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-olive/10 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden bg-cream border-t border-olive/10 px-4 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium uppercase text-dark/70 hover:text-dark transition-colors"
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/shop"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex w-fit items-center gap-2 bg-yellow text-dark font-semibold text-sm px-5 py-2 rounded-full hover:bg-yellow/80 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

