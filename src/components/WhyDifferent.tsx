import { X, Check } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useSite, useTextColor } from '@/cms/SiteContext';

export default function WhyDifferent() {
  const { t, lang } = useLang();
  const { settings } = useSite();
  const d = settings?.diff;

  const pick = (en?: string, ar?: string, fallback?: string) =>
    (lang === 'ar' ? (ar || en || fallback) : (en || ar || fallback)) || '';

  const kicker = pick(d?.kicker_en, d?.kicker_ar, t.diff.kicker);
  const title1 = pick(d?.title1_en, d?.title1_ar, t.diff.title1);
  const title2 = pick(d?.title2_en, d?.title2_ar, t.diff.title2);
  const others = pick(d?.others_en, d?.others_ar, t.diff.others);
  const us     = pick(d?.us_en,     d?.us_ar,     t.diff.us);
  const footer1 = pick(d?.footer1_en, d?.footer1_ar, t.diff.footer1);
  const footer2 = pick(d?.footer2_en, d?.footer2_ar, t.diff.footer2);

  const cmsRows = (d?.rows && d.rows.length > 0)
    ? d.rows.map((r) => ({
        other: lang === 'ar' ? (r.other_ar || r.other_en) : (r.other_en || r.other_ar),
        us:    lang === 'ar' ? (r.us_ar    || r.us_en)    : (r.us_en    || r.us_ar),
      }))
    : t.diff.rows;

  const bg = d?.image || 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/photo_5976431767184936180_y_rf0k9u';

  return (
    <section
      className="relative py-28 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(var(--background) / 0.94) 0%, hsl(var(--red) / 0.55) 100%, hsl(var(--background) / 0.95) 100%), url('${bg}')`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--gold) / 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute left-0 top-0 w-1/3 h-full opacity-20" style={{ background: 'radial-gradient(ellipse at left, hsl(var(--gold)), transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="scroll-reveal text-[hsl(var(--gold))] text-xs font-bold tracking-widest uppercase mb-4" style={useTextColor('diff', lang === 'ar' ? 'kicker_ar' : 'kicker_en')}>{kicker}</p>
          <h2 className="scroll-reveal delay-100 font-display text-4xl md:text-5xl font-black text-white leading-tight">
            <span style={useTextColor('diff', lang === 'ar' ? 'title1_ar' : 'title1_en')}>{title1}</span> <span className="text-[hsl(var(--gold))]" style={useTextColor('diff', lang === 'ar' ? 'title2_ar' : 'title2_en')}>{title2}</span>
          </h2>
          <div className="scroll-reveal delay-300 w-32 h-[2px] bg-[hsl(var(--gold))] mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">
          <div className="scroll-reveal-left space-y-4">
            <div className="backdrop-blur-md bg-white/5 rounded-2xl p-4 mb-6 border-l-2 border-white/20">
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-1" style={useTextColor('diff', lang === 'ar' ? 'others_ar' : 'others_en')}>{others}</p>
            </div>
            {cmsRows.map((c, i) => (
              <div key={i} className="flex items-start gap-3 backdrop-blur-md bg-white/5 rounded-xl p-4 opacity-70">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X size={14} className="text-white/50" />
                </div>
                <p className="text-white/60 text-sm leading-relaxed">{c.other}</p>
              </div>
            ))}
          </div>

          <div className="scroll-reveal-right space-y-4">
            <div className="backdrop-blur-md bg-[hsl(var(--gold))]/10 rounded-2xl p-4 mb-6 border-l-2 border-[hsl(var(--gold))]">
              <p className="text-[hsl(var(--gold))] text-sm font-bold uppercase tracking-widest mb-1" style={useTextColor('diff', lang === 'ar' ? 'us_ar' : 'us_en')}>{us}</p>
            </div>
            {cmsRows.map((c, i) => (
              <div key={i} className="flex items-start gap-3 backdrop-blur-md bg-[hsl(var(--gold))]/5 rounded-xl p-4" style={{ boxShadow: '0 4px 20px hsl(var(--gold) / 0.08)' }}>
                <div className="w-6 h-6 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={14} className="text-[hsl(var(--gold))]" />
                </div>
                <p className="text-white font-medium text-sm leading-relaxed">{c.us}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="scroll-reveal text-center backdrop-blur-md bg-[hsl(var(--gold))]/5 border border-[hsl(var(--gold))]/20 rounded-3xl p-10" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <p className="font-display text-3xl md:text-4xl font-black text-white mb-3" style={useTextColor('diff', lang === 'ar' ? 'footer1_ar' : 'footer1_en')}>{footer1}</p>
          <p className="text-[hsl(var(--gold))] text-lg font-medium" style={useTextColor('diff', lang === 'ar' ? 'footer2_ar' : 'footer2_en')}>{footer2}</p>
        </div>
      </div>
    </section>
  );
}
