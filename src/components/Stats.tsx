import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/i18n/LanguageContext';

const targets = [30, 850, 98, 7];
const suffixes = ['+', '+', '%', ''];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000; const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="tabular-nums">{count.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  const { t } = useLang();
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--dark-2)) 0%, hsl(var(--dark)) 50%, hsl(var(--dark-2)) 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 gold-line opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 gold-line opacity-30" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(hsl(var(--gold) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold) / 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="scroll-reveal text-[hsl(var(--gold))] text-xs font-bold tracking-widest uppercase mb-4">{t.stats.kicker}</p>
          <h2 className="scroll-reveal delay-100 font-display text-3xl md:text-4xl font-black text-white">{t.stats.title}</h2>
          <p className="scroll-reveal delay-200 text-white/50 mt-3 text-sm">{t.stats.desc}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {targets.map((v, i) => (
            <div key={i} className={`scroll-reveal delay-${(i + 1) * 100} glass-gold rounded-3xl p-8 text-center`} style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
              <p className="font-display text-5xl font-black text-[hsl(var(--gold))] mb-2"><CountUp target={v} suffix={suffixes[i]} /></p>
              <p className="text-white font-semibold text-sm">{t.stats.labels[i]}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 scroll-reveal">
          <div className="rounded-3xl p-10 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, hsl(var(--red) / 0.55), hsl(var(--red-dark) / 0.85))', border: '1px solid hsl(var(--gold) / 0.25)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--gold) / 0.8) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            <p className="text-2xl md:text-3xl leading-loose mb-4 relative z-10" style={{ color: '#fff' }}>{t.stats.quote1}</p>
            <p className="text-[hsl(var(--gold))] text-lg font-medium relative z-10">{t.stats.quote2}</p>
            <p className="text-xs mt-4 relative z-10" style={{ color: '#fff' }}>{t.stats.quote3}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
