import { Link } from 'react-router-dom';
import { ExternalLink, MessageCircle, Code2, Play } from 'lucide-react';

const links = {
  Shop: [
    { label: '3D Models', to: '/shop?cat=3d-models' },
    { label: 'Textures', to: '/shop?cat=textures' },
    { label: 'HDRI', to: '/shop?cat=hdri' },
    { label: 'New Arrivals', to: '/shop?sort=newest' },
  ],
  Account: [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/profile#wishlist' },
  ],
  Company: [
    { label: 'About Us', to: '/#about' },
    { label: 'Contact', to: '/#contact' },
    { label: 'FAQ', to: '/#faq' },
  ],
};

const socials = [
  { icon: <ExternalLink size={18} />, href: '#', label: 'Twitter / X' },
  { icon: <MessageCircle size={18} />, href: '#', label: 'Discord' },
  { icon: <Code2 size={18} />, href: '#', label: 'GitHub' },
  { icon: <Play size={18} />, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white/60 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-3xl font-black text-white tracking-widest">
              RENDERHAVEN
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              Premium 3D assets for artists, architects, and game developers.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="p-2 rounded-full bg-white/10 hover:bg-yellow hover:text-dark transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <h4 className="text-white font-semibold mb-1">Stay in the loop</h4>
            <p className="text-sm">New assets and promos, straight to your inbox.</p>
          </div>
          <form
            className="flex gap-2 w-full md:w-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/40 border border-white/20 focus:outline-none focus:border-yellow"
            />
            <button
              type="submit"
              className="bg-yellow text-dark font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-yellow/80 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-xs flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} RenderHaven Shop. All rights reserved.</span>
          <span className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
