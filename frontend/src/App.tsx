import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import type { Toast as ToastType, ToastType as ToastKind } from './types';

function AppShell() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback((message: string, type: ToastKind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Expose addToast globally so any module can call window.__addToast(...)
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__addToast = addToast;
  }, [addToast]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-center px-4">
                <p className="text-8xl">🎨</p>
                <h1 className="font-display font-black text-5xl text-dark">404</h1>
                <p className="text-dark/50">This page doesn't exist.</p>
                <a
                  href="/"
                  className="bg-olive text-white font-bold px-6 py-3 rounded-full hover:bg-olive/80 transition-colors text-sm"
                >
                  Go Home
                </a>
              </div>
            }
          />
        </Routes>
      </div>

      <Footer />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
