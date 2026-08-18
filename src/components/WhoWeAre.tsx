import { Heart, Building2, Users, Sparkles } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useSite, useTextColor } from '@/cms/SiteContext';

const icons = [Heart, Building2, Users, Sparkles];

export default function WhoWeAre() {
  const { t, lang } = useLang();
  const { settings } = useSite();
  const w = settings?.whoweare;
  const bgImage = w?.image || 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/photo_5976431767184936177_y_ch7yb6';
  const title = w ? (lang === 'ar' ? w.title_ar : w.title_en) || t.about.title : t.about.title;
  const desc = w ? (lang === 'ar' ? w.desc_ar : w.desc_en) : '';

  return (
    <section
      id="about"
      className="relative py-28 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(180deg, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.85) 70%, hsl(var(--background) / 0.95) 90%), url('${bgImage}')`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10" style={{ background: 'radial-gradient(ellipse at right, hsl(var(--red-light)), transparent 100%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="scroll-reveal-left">
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              <span className="text-[hsl(var(--gold))] text-3xl" style={useTextColor('whoweare', lang === 'ar' ? 'title_ar' : 'title_en')}>{title}</span>
            </h2>
            <div className="w-24 h-[2px] bg-[hsl(var(--gold))] mb-8" />
            {desc && <p className="text-white/80 text-lg leading-loose mb-6" style={useTextColor('whoweare', lang === 'ar' ? 'desc_ar' : 'desc_en')}>{desc}</p>}
            <div className="space-y-5 text-white/70 leading-relaxed">
              <p>{t.about.p1a} <span className="text-white font-medium">{t.about.p1b}</span></p>
              <p className="text-lg leading-loose">{t.about.p2}</p>
              <p>{t.about.p3a} <span className="text-[hsl(var(--gold))] font-semibold">{t.about.p3b}</span></p>
              <p>{t.about.p4}</p>
              <p className="text-base text-[hsl(var(--gold))] leading-loose font-medium">{t.about.p5}</p>
            </div>
          </div>

          <div className="scroll-reveal-right relative">
            <div className="rounded-3xl overflow-hidden relative" style={{ border: '1px solid hsl(var(--gold) / 0.2)', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              <img src="https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/OSA01038_mbnios" alt="Stone Lift Experience" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(201,158,103,0.4) 5%, transparent 50%)' }} />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.about.values.map((v, i) => {
            const Icon = icons[i];
            return (
              <div key={v.title} className={`scroll-reveal delay-${(i + 1) * 100} backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 group hover:border-[hsl(var(--gold))]/50 hover:bg-white/10 transition-all duration-500`}>
                <div className="w-12 h-12 rounded-xl bg-[hsl(var(--red-light))]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={22} className="text-[hsl(var(--gold))]" />
                </div>
                <h3 className="font-display text-white font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
