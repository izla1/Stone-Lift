import { useState } from 'react';
import { Phone, MapPin, Mail, Send, CheckCircle, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2, Globe } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useSite } from '@/cms/SiteContext';
import { supabase } from '@/integrations/supabase/client';

const ICON_MAP: Record<string, any> = {
  Facebook, Instagram, LinkedIn: Linkedin, YouTube: Youtube, TikTok: Music2, WhatsApp: MessageCircle,
};

export default function Contact() {
  const { t, lang } = useLang();
  const { settings } = useSite();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const c = settings?.contact;
  const socials = settings?.social || [];
  const phone = c?.phone || '';
  const email = c?.email || 'info@stonelifteg.com';
  const address = (lang === 'ar' ? c?.address_ar : c?.address_en) || '';
  const map = c?.mapEmbed || 'https://www.google.com/maps?q=StoneLift+%D9%84%D8%AA%D9%88%D8%B1%D9%8A%D8%AF+%D9%88%D8%AA%D8%B1%D9%83%D9%8A%D8%A8+%D8%A7%D9%84%D9%85%D8%B5%D8%A7%D8%B9%D8%AF&hl=en&t=m&z=16&ll=30.084924,31.3368674&output=embed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('leads').insert({ name: form.name, phone: form.phone, message: form.message, email: '', source: 'contact_form' });
    const subject = encodeURIComponent(`New inquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSent(true);
    setForm({ name: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="contact" className="relative py-28 overflow-hidden" style={{ background: 'hsl(var(--dark))' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 gold-line opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className="scroll-reveal text-[hsl(var(--gold))] text-xs font-bold tracking-widest uppercase mb-4">{t.contact.kicker}</p>
          <h2 className="scroll-reveal delay-100 font-display text-4xl md:text-5xl font-black text-white">
            {t.contact.title1} <span className="text-[hsl(var(--red-light))]">{t.contact.title2}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6 scroll-reveal-left">
            <div className="glass-gold rounded-3xl p-8">
              <h3 className="text-white text-2xl font-bold mb-6 font-display">{t.contact.info}</h3>
              <div className="space-y-5">
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-4 group">
                  <Phone className="text-[hsl(var(--gold))] group-hover:scale-110 transition-transform" />
                  <p className="text-white">{phone}</p>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                  <Mail className="text-[hsl(var(--gold))] group-hover:scale-110 transition-transform" />
                  <p className="text-white">{email}</p>
                </a>
                <div className="flex items-start gap-4">
                  <MapPin className="text-[hsl(var(--gold))] mt-1" />
                  <p className="text-white">{address}</p>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-white/60 text-sm mb-4 uppercase tracking-widest">{t.contact.follow}</h4>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => {
                    const Icon = ICON_MAP[s.name] || Globe;
                    return (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                        className="w-11 h-11 rounded-full border border-[hsl(var(--gold))]/30 flex items-center justify-center text-white hover:bg-[hsl(var(--gold))] hover:text-[hsl(var(--dark))] hover:scale-110 transition-all duration-300">
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {map && (
              <div className="rounded-3xl overflow-hidden border border-[hsl(var(--gold))]/20">
                <iframe
                  title="Stone Lift Location"
                  src={map}
                  width="100%" height="280" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="glass rounded-3xl p-8 scroll-reveal-right">
            <h3 className="text-white text-2xl font-bold mb-6 font-display">{t.contact.sendTitle}</h3>
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle className="text-[hsl(var(--gold))] mx-auto mb-3" size={50} />
                <p className="text-white">{t.contact.sent}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" required maxLength={100} placeholder={t.contact.name}
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--gold))] transition-colors" />
                <input type="tel" required maxLength={20} placeholder={t.contact.phone}
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--gold))] transition-colors" />
                <textarea required maxLength={1000} rows={5} placeholder={t.contact.message}
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--gold))] resize-none transition-colors" />
                <button type="submit" className="btn-primary text-white font-semibold px-8 py-4 rounded-full inline-flex items-center gap-2">
                  {t.contact.sendBtn} <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
