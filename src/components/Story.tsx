import { useLang } from '@/i18n/LanguageContext';

export default function Story() {
  const { t } = useLang();
  return (
    <section id="story" className="relative py-28 overflow-hidden" style={{ background: 'hsl(var(--dark))' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 gold-line opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 gold-line opacity-20" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="scroll-reveal text-[hsl(var(--gold))] text-xs font-bold tracking-widest uppercase mb-4">{t.story.kicker}</p>
          <h2 className="scroll-reveal delay-100 font-display text-4xl md:text-5xl font-black text-white leading-tight">
            {t.story.title1} <span className="text-[hsl(var(--red-light))]">{t.story.title2}</span>
          </h2>
          <div className="scroll-reveal delay-200 gold-line w-32 mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="scroll-reveal-left relative">
            <div className="rounded-3xl overflow-hidden relative" style={{ border: '1px solid hsl(var(--gold) / 0.2)', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <img src="https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/photo_5976431767184936178__gcvpmh" alt="Premium building lobby" className="w-full h-[450px] object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, hsl(var(--dark)) 10%, transparent 50%)' }} />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-gold rounded-2xl p-5 max-w-[220px]">
              <p className="text-[hsl(var(--gold))] font-bold text-sm leading-relaxed">{t.story.caption}</p>
            </div>
          </div>

          <div className="scroll-reveal-right space-y-6">
            <div className="glass rounded-2xl p-6 border-l-2 border-[hsl(var(--red-light))]">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-3">{t.story.q1}</p>
              <p className="text-white/80 text-lg leading-relaxed">
                {t.story.q1text} <span className="text-[hsl(var(--gold))] font-semibold">{t.story.q1bold}</span>
              </p>
            </div>
            <div className="glass rounded-2xl p-6 border-l-2 border-[hsl(var(--gold))]">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-3">{t.story.p1}</p>
              <p className="text-white/80 leading-relaxed">
                {t.story.p1text} <span className="text-white font-medium">{t.story.p1bold}</span>.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 border-l-2 border-[hsl(var(--red-light))]">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wider mb-3">{t.story.v1}</p>
              <p className="text-white/80 leading-relaxed">
                {t.story.v1text} <span className="text-[hsl(var(--gold))] font-medium">{t.story.v1bold}</span>{t.story.v1end}
              </p>
            </div>
            <p className="text-white/60 text-lg leading-loose pt-2">{t.story.tag}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
