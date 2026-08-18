import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';
import { useSite, useTextColor } from '@/cms/SiteContext';

const tagColors: Record<string, string> = {
  Home: 'bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))]',
  Commercial: 'bg-[hsl(var(--red-light))]/20 text-[hsl(var(--red-light))]',
  Accessibility: 'bg-emerald-500/20 text-emerald-400',
};

export default function ProductsSection({ limit }: { limit?: number }) {
  const { t, lang } = useLang();
  const { products, settings } = useSite();
  const ps = settings?.products_section;

  const items = (limit ? products.slice(0, limit) : products).filter((p) => p.visible);
  const kicker = ps ? (lang === 'ar' ? ps.kicker_ar : ps.kicker_en) || t.products.kicker : t.products.kicker;
  const title1 = ps ? (lang === 'ar' ? ps.title1_ar : ps.title1_en) || t.products.title1 : t.products.title1;
  const title2 = ps ? (lang === 'ar' ? ps.title2_ar : ps.title2_en) || t.products.title2 : t.products.title2;
  const desc = ps ? (lang === 'ar' ? ps.desc_ar : ps.desc_en) || t.products.desc : t.products.desc;
  const learn = ps ? (lang === 'ar' ? ps.learn_ar : ps.learn_en) || t.products.learn : t.products.learn;

  return (
    <section id="products" className="relative py-28 overflow-hidden" style={{ background: 'hsl(var(--dark))' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 gold-line opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="scroll-reveal text-[hsl(var(--gold))] text-xs font-bold tracking-widest uppercase mb-4" style={useTextColor('products_section', lang === 'ar' ? 'kicker_ar' : 'kicker_en')}>{kicker}</p>
          <h2 className="scroll-reveal delay-100 font-display text-4xl md:text-5xl font-black text-white leading-tight">
            <span style={useTextColor('products_section', lang === 'ar' ? 'title1_ar' : 'title1_en')}>{title1}</span> <span className="text-[hsl(var(--red-light))]" style={useTextColor('products_section', lang === 'ar' ? 'title2_ar' : 'title2_en')}>{title2}</span>
          </h2>
          <p className="scroll-reveal delay-200 text-white/50 mt-4 max-w-xl mx-auto" style={useTextColor('products_section', lang === 'ar' ? 'desc_ar' : 'desc_en')}>{desc}</p>
          <div className="scroll-reveal delay-300 gold-line w-32 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((p, i) => {
            const sub = (lang === 'ar' ? p.subtitle_ar : p.subtitle_en) || '';
            const desc = (lang === 'ar' ? p.desc_ar : p.desc_en) || '';
            const tagline = (lang === 'ar' ? p.tagline_ar : p.tagline_en) || '';
            return (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className={`scroll-reveal delay-${Math.min((i % 3 + 1) * 100, 300)} product-card rounded-3xl overflow-hidden glass block`}
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={p.image || ''} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark))] to-transparent" />
                  {p.tag && <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full ${tagColors[p.tag] || 'bg-white/10 text-white'}`}>{p.tag}</span>}
                </div>
                <div className="p-6">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{sub}</p>
                  <h3 className="font-display text-2xl font-black text-white mb-3">{p.name}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">{desc}</p>
                  {tagline && <p className="text-[hsl(var(--gold))] italic text-sm mb-5 leading-relaxed">"{tagline}"</p>}
                  <div className="flex items-center gap-2 text-[hsl(var(--gold))] text-sm font-semibold group">
                    {learn} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
