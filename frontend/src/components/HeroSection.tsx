import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function HeroSection({
  title = 'RENDERHAVEN',
  subtitle = 'Premium 3D assets for creators',
  ctaLabel = 'Explore the Shop',
  ctaTo = '/shop',
}: Props) {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-olive min-h-[520px] md:min-h-[600px] flex items-end">

      {/* Background gradient blobs */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 30% 40%, #9aad5a 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 75% 70%, #e8d44d 0%, transparent 65%)',
        }}
      />

      {/* Large display brand name */}
      <h1
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display font-black text-white/20 select-none pointer-events-none leading-none"
        style={{ fontSize: 'clamp(72px, 16vw, 200px)', letterSpacing: '-0.02em' }}
        aria-hidden="true"
      >
        RENDERHAVEN
      </h1>

      {/* Central decorative element — 3D cube wireframe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          className="w-64 h-64 md:w-96 md:h-96 opacity-40"
          fill="none"
          stroke="white"
          strokeWidth="1"
        >
          {/* Front face */}
          <rect x="50" y="70" width="90" height="90" rx="4" />
          {/* Back face offset */}
          <rect x="70" y="50" width="90" height="90" rx="4" />
          {/* Connecting lines */}
          <line x1="50" y1="70" x2="70" y2="50" />
          <line x1="140" y1="70" x2="160" y2="50" />
          <line x1="140" y1="160" x2="160" y2="140" />
          <line x1="50" y1="160" x2="70" y2="140" />
        </svg>
      </div>

      {/* Content overlay at bottom */}
      <div className="relative z-10 w-full p-8 md:p-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div>
          <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">
            {subtitle}
          </p>
          <h2 className="font-display font-black text-white text-4xl md:text-6xl leading-none">
            {title}
          </h2>
        </div>

        <Link
          to={ctaTo}
          className="group flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-yellow hover:text-dark hover:border-yellow transition-all duration-300"
        >
          <span>{ctaLabel}</span>
          <span className="w-7 h-7 bg-yellow text-dark rounded-full flex items-center justify-center group-hover:bg-dark group-hover:text-white transition-colors">
            <ArrowRight size={14} />
          </span>
        </Link>
      </div>
    </section>
  );
}

