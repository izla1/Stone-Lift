import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSite } from '@/cms/SiteContext';
import { useLang } from '@/i18n/LanguageContext';

export default function CustomPage() {
  const { slug } = useParams();
  const { pages, loading } = useSite();
  const { lang } = useLang();

  const page = pages.find((p) => p.slug === slug);

  useEffect(() => {
    if (page) document.title = `${(lang === 'ar' ? page.title_ar : page.title_en) || page.title_en} — Stone Lift`;
    window.scrollTo(0, 0);
  }, [page, lang]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-white/50">Loading...</div>;
  if (!page) return <Navigate to="/" replace />;

  const title = (lang === 'ar' ? page.title_ar : page.title_en) || page.title_en;

  return (
    <section className="pt-32 pb-20 min-h-screen" style={{ background: 'hsl(var(--dark))' }}>
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-4">{title}</h1>
        <div className="gold-line w-32 mb-12" />
        <div className="space-y-8">
          {page.blocks.map((b, i) => {
            const text = (lang === 'ar' ? b.ar : b.en) || b.en || b.ar || '';
            if (b.type === 'heading') return <h2 key={i} className="font-display text-3xl text-[hsl(var(--gold))] font-bold">{text}</h2>;
            if (b.type === 'image' && b.url) return <img key={i} src={b.url} alt="" className="w-full rounded-2xl border border-[hsl(var(--gold))]/20" />;
            return <p key={i} className="text-white/75 text-lg leading-loose whitespace-pre-line">{text}</p>;
          })}
        </div>
      </div>
    </section>
  );
}
