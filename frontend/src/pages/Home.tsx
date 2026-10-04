import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Shield, Download } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { productApi } from '../lib/api';
import type { Product } from '../types';

const features = [
  {
    icon: <Star size={24} className="text-yellow" />,
    title: 'Premium Quality',
    desc: 'Every asset is professionally crafted and ready for production.',
  },
  {
    icon: <Zap size={24} className="text-yellow" />,
    title: 'Instant Download',
    desc: 'Get your files immediately after purchase. No waiting.',
  },
  {
    icon: <Shield size={24} className="text-yellow" />,
    title: 'Commercial License',
    desc: 'Use in personal and commercial projects without restrictions.',
  },
  {
    icon: <Download size={24} className="text-yellow" />,
    title: 'Multiple Formats',
    desc: 'OBJ, FBX, BLEND, GLB and more — for every pipeline.',
  },
];

const categories = [
  { label: '3D Models', emoji: '🧊', slug: '3d-models' },
  { label: 'Textures', emoji: '🖼️', slug: 'textures' },
  { label: 'HDRI', emoji: '🌅', slug: 'hdri' },
  { label: 'Scenes', emoji: '🎬', slug: 'scenes' },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi
      .getTree({})
      .then((data) => {
        const products = (data as { products?: Product[] })?.products ?? (data as Product[]);
        setFeatured(Array.isArray(products) ? products.slice(0, 8) : []);
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="space-y-20 pb-20">
      {/* Hero */}
      <section className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <HeroSection
          title="SHOP"
          subtitle="RenderHaven · Premium 3D Assets"
          ctaLabel="Explore the Shop"
          ctaTo="/shop"
        />
      </section>

      {/* Category quick links */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-3xl text-dark">Browse by Category</h2>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-medium text-olive hover:gap-2 transition-all"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?cat=${cat.slug}`}
              className="group flex flex-col items-center justify-center gap-3 bg-cream rounded-2xl py-8 hover:bg-olive hover:text-white transition-all duration-300 border border-olive/10 hover:border-olive"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className="font-semibold text-sm">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-3xl text-dark">Featured Assets</h2>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-medium text-olive hover:gap-2 transition-all"
          >
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-cream rounded-2xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-cream rounded-2xl py-20 text-center">
            <p className="text-dark/40 text-sm">No products yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Features / USP strip */}
      <section className="bg-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA banner */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-olive rounded-3xl px-8 md:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-black text-white text-4xl md:text-5xl leading-tight">
              Ready to render<br />
              <span className="text-yellow">something amazing?</span>
            </h2>
            <p className="text-white/70 mt-3 max-w-sm text-sm leading-relaxed">
              Join thousands of artists using RenderHaven assets in their projects.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/shop"
              className="flex items-center gap-2 bg-yellow text-dark font-bold px-7 py-3.5 rounded-full hover:bg-yellow/80 transition-colors"
            >
              <span>Shop Now</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-7 py-3.5 rounded-full hover:bg-white/20 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* About / story */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto" id="about">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-olive font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="font-display font-black text-4xl text-dark mt-2 mb-4">
              Built by artists,<br />for artists.
            </h2>
            <p className="text-dark/60 leading-relaxed mb-6">
              RenderHaven was born out of frustration with low-quality, overpriced 3D assets.
              We curate and create only the best — tested in real production pipelines.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm font-semibold text-olive hover:gap-3 transition-all"
            >
              Explore the collection <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['🧊', '🖼️', '🌅', '🎬'].map((emoji, i) => (
              <div
                key={i}
                className="aspect-square rounded-2xl bg-gradient-to-br from-olive/20 to-yellow/20 flex items-center justify-center text-5xl"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto" id="contact">
        <div className="bg-cream rounded-3xl px-8 md:px-16 py-14 text-center">
          <h2 className="font-display font-black text-4xl text-dark mb-3">Get in touch</h2>
          <p className="text-dark/60 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Have a question, a custom request, or just want to say hi? We'd love to hear from you.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white rounded-full px-5 py-3 text-sm border border-olive/20 focus:outline-none focus:border-olive"
            />
            <button
              type="submit"
              className="bg-olive text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-olive/80 transition-colors whitespace-nowrap"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

