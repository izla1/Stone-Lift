import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Check, Phone, Play } from 'lucide-react';
import { useSite } from '@/cms/SiteContext';
import { useLang } from '@/i18n/LanguageContext';

const tagColors: Record<string, string> = {
  Home: 'bg-[hsl(var(--gold))]/20 text-[hsl(var(--gold))]',
  Commercial: 'bg-[hsl(var(--red-light))]/20 text-[hsl(var(--red-light))]',
  Accessibility: 'bg-emerald-500/20 text-emerald-400',
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { products, settings, loading } = useSite();
  const product = products.find((x) => x.slug === slug);
  const phone = settings?.contact.phone || '';
  const phoneTel = (settings?.contact.phone || '').replace(/\s+/g, '');

  useEffect(() => {
    if (product) document.title = `${product.name} — Stone Lift`;
    window.scrollTo(0, 0);
  }, [product]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-white/50">Loading...</div>;
  if (!product) return <Navigate to="/products" replace />;

  const subtitle = (lang === 'ar' ? product.subtitle_ar : product.subtitle_en) || '';
  const tagline = (lang === 'ar' ? product.tagline_ar : product.tagline_en) || '';
  const desc = (lang === 'ar' ? product.desc_ar : product.desc_en) || '';
  const features = (lang === 'ar' ? product.features_ar : product.features_en) || [];

  return (
    <section className="pt-28 pb-20" style={{ background: 'hsl(var(--dark))' }}>
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/products" className="inline-flex items-center gap-2 text-white/50 hover:text-[hsl(var(--gold))] mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" /> {t.productDetail.back}
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative animate-fade-up">
            <div className="absolute -inset-6 bg-[hsl(var(--gold))]/20 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden border border-[hsl(var(--gold))]/30 animate-glow-pulse">
              <img src={product.image || ''} alt={`${product.name}${subtitle ? ` ${subtitle}` : ''} elevator by Stone Lift`} className="w-full object-cover" />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {product.tag && (
              <span className={`inline-block px-3 py-1 text-[10px] tracking-[0.3em] rounded-full font-bold ${tagColors[product.tag] || 'bg-white/10 text-white'}`}>
                {product.tag.toUpperCase()} · {subtitle.toUpperCase()}
              </span>
            )}
            <h1 className="font-display text-5xl md:text-6xl font-black mt-6 mb-4 text-white">{product.name}</h1>
            {tagline && <p className="text-xl text-[hsl(var(--gold))] italic mb-6 font-display">"{tagline}"</p>}
            <p className="text-white/70 leading-relaxed mb-10">{desc}</p>

            <h3 className="font-display text-2xl mb-4 text-white">{t.productDetail.specs}</h3>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {product.specs.map((s, i) => (
                <div key={i} className="p-5 rounded-xl glass-gold">
                  <p className="text-xs tracking-wider text-white/50 uppercase mb-1">{lang === 'ar' ? s.label_ar : s.label_en}</p>
                  <p className="font-display text-2xl text-[hsl(var(--gold))] font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            <h3 className="font-display text-2xl mb-4 text-white">{t.productDetail.features}</h3>
            <ul className="space-y-3 mb-10">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70">
                  <span className="w-6 h-6 rounded-full bg-[hsl(var(--gold))]/15 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Check className="w-3 h-3 text-[hsl(var(--gold))]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary text-white font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2">
                {t.productDetail.requestQuote}
              </Link>
              <a href={`tel:${phoneTel}`} className="btn-outline font-semibold px-7 py-3.5 rounded-full inline-flex items-center gap-2">
                <Phone size={16} /> {t.productDetail.callUs} {phone}
              </a>
            </div>
          </div>
        </div>

        {/* Gallery / Videos */}
        <div className="mt-24 scroll-reveal">
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2">{t.productDetail.gallery}</h2>
          <div className="gold-line w-32 mb-10" />

          {product.video_url ? (
            <div className="aspect-video rounded-3xl overflow-hidden border border-[hsl(var(--gold))]/30 mb-8">
              <iframe src={product.video_url} title={product.name} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : null}

          {product.gallery && product.gallery.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {product.gallery.map((url, i) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-[hsl(var(--gold))]/20">
                  <img src={url} alt={`${product.name}${subtitle ? ` ${subtitle}` : ''} elevator — gallery view ${i + 1} of ${product.gallery.length}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : !product.video_url && (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-video rounded-2xl glass border border-dashed border-[hsl(var(--gold))]/20 flex flex-col items-center justify-center text-white/40 hover:border-[hsl(var(--gold))]/50 transition-colors">
                  <Play className="w-10 h-10 text-[hsl(var(--gold))]/40 mb-3" />
                  <p className="text-sm">{t.productDetail.videoPlaceholder}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
