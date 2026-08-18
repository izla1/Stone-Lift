import { useEffect, useRef } from 'react';
import { ArrowDown, Shield, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';
import { useSite, useTextColor } from '@/cms/SiteContext';

const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  left: Math.random() * 100,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 10,
  color: i % 3 === 0 ? 'hsl(43, 53%, 54%)' : i % 3 === 1 ? 'hsl(6, 70%, 47%)' : 'rgba(255,255,255,0.4)',
}));

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { t, lang } = useLang();
  const { settings } = useSite();
  const h = settings?.hero;
  const kicker = h ? (lang === 'ar' ? h.kicker_ar : h.kicker_en) || t.hero.badge : t.hero.badge;
  const title1 = h ? (lang === 'ar' ? h.title1_ar : h.title1_en) || t.hero.title1 : t.hero.title1;
  const title2 = h ? (lang === 'ar' ? h.title2_ar : h.title2_en) || t.hero.title2 : t.hero.title2;
  const desc = h ? (lang === 'ar' ? h.desc_ar : h.desc_en) || t.hero.desc : t.hero.desc;
  const cta = h ? (lang === 'ar' ? h.cta_ar : h.cta_en) || t.hero.explore : t.hero.explore;
  const heroImage = h?.image || 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/photo_5976431767184936182_y_mklygm';

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    setTimeout(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300);
  }, [t]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 15% 60%, hsl(var(--red) / 0.32) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, hsl(var(--gold) / 0.14) 0%, transparent 50%), hsl(var(--background))',
      }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            width: p.size, height: p.size, left: `${p.left}%`,
            background: p.color, animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`, opacity: 0.5,
          }}
        />
      ))}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-10%] w-[600px] h-[600px] rounded-full opacity-5 animate-spin-slow" style={{ border: '1px solid hsl(var(--gold))' }} />
        <div className="absolute top-[15%] right-[-5%] w-[400px] h-[400px] rounded-full opacity-10 animate-spin-slow" style={{ border: '1px solid hsl(var(--red-light))', animationDirection: 'reverse', animationDuration: '15s' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px gold-line opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16 relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full" style={{ animation: 'fadeUp 0.8s ease forwards', opacity: 0 }}>
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--gold))] animate-pulse" />
            <span className="text-[hsl(var(--gold))] text-xs font-semibold tracking-widest uppercase" style={useTextColor('hero', lang === 'ar' ? 'kicker_ar' : 'kicker_en')}>{kicker}</span>
          </div>

          <h1 ref={titleRef} className="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-tight">
            <span className="text-white" style={useTextColor('hero', lang === 'ar' ? 'title1_ar' : 'title1_en')}>{title1}</span><br />
            <span className="animate-shimmer" style={useTextColor('hero', lang === 'ar' ? 'title2_ar' : 'title2_en')}>{title2}</span>
          </h1>

          <p className="text-xl text-white/70 leading-loose" style={{ animation: 'fadeUp 0.8s 0.4s ease both', ...useTextColor('hero', lang === 'ar' ? 'desc_ar' : 'desc_en') }}>
            {desc}
          </p>

          <div className="flex flex-wrap gap-4" style={{ animation: 'fadeUp 0.8s 0.6s ease both' }}>
            <Link to="/products" className="btn-primary text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide" style={useTextColor('hero', lang === 'ar' ? 'cta_ar' : 'cta_en')}>{cta}</Link>
            <Link to="/contact" className="btn-outline font-semibold px-8 py-4 rounded-full text-sm tracking-wide">{t.hero.contact}</Link>
          </div>

          <div className="flex gap-8 pt-4" style={{ animation: 'fadeUp 0.8s 0.8s ease both' }}>
            {[
              { icon: Shield, label: t.hero.safety },
              { icon: Star, label: t.hero.quality },
              { icon: Award, label: t.hero.certified },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/50 text-xs">
                <Icon size={16} className="text-[hsl(var(--gold))]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="animate-float relative">
            <div className="relative w-[340px] h-[420px] md:w-[600px] md:h-[540px] rounded-3xl overflow-hidden animate-glow-pulse"
              style={{ background: 'linear-gradient(135deg, hsla(0,75%,28%,0.2), hsla(43,53%,54%,0.1))', border: '1px solid hsl(var(--gold) / 0.3)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              <img
                src={heroImage}
                alt="Luxury Elevator Interior"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-gold rounded-2xl p-4">
                  <p className="font-display text-[hsl(var(--gold))] text-lg font-bold">Stone Lift</p>
                  <p className="text-white/70 text-xs mt-1">{t.hero.caption}</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 glass-gold rounded-2xl p-4 text-center" style={{ animation: 'fadeUp 1s 1.2s ease both' }}>
              <p className="font-display text-4xl font-black text-[hsl(var(--gold))]">30+</p>
              <p className="text-white/60 text-xs mt-1">{t.hero.years}<br />{t.hero.exp}</p>
            </div>
          </div>
        </div>
      </div>

      <a href="#story" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-[hsl(var(--gold))] transition-colors">
        <span className="text-xs tracking-widest uppercase">{t.hero.scroll}</span>
        <ArrowDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}
