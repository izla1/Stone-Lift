import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2, Globe } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useSite } from '@/cms/SiteContext';
import { useTheme } from '@/theme/ThemeContext';

const ICON_MAP: Record<string, any> = {
  Facebook, Instagram, LinkedIn: Linkedin, YouTube: Youtube, TikTok: Music2, WhatsApp: MessageCircle,
};

export default function Footer() {
  const { t, lang } = useLang();
  const { settings } = useSite();
  const { mode } = useTheme();
  const b = settings?.branding;
  const logo = (mode === 'light' ? (b?.footerLogoLight || b?.logo) : (b?.footerLogoDark || b?.logo)) || '';
  const socials = settings?.social || [];
  const phone = settings?.contact.phone || '';
  const email = settings?.contact.email || '';
  const address = (lang === 'ar' ? settings?.contact.address_ar : settings?.contact.address_en) || '';

  return (
    <footer className="border-t border-[hsl(var(--gold))]/20 bg-black/40">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            {logo && <img src={logo} alt="Stone Lift" className="h-12 w-auto" />}
          </div>
          <p className="text-white/60 max-w-md leading-relaxed text-sm">{t.hero.desc}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            {socials.map((s) => {
              const Icon = ICON_MAP[s.name] || Globe;
              return (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}
                  className="w-10 h-10 rounded-full border border-[hsl(var(--gold))]/30 flex items-center justify-center text-white hover:bg-[hsl(var(--gold))] hover:text-[hsl(var(--dark))] transition-all">
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-[hsl(var(--gold))] text-xs tracking-[0.25em] mb-4">EXPLORE</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li><Link to="/" className="hover:text-white">{t.nav.home}</Link></li>
            <li><Link to="/story" className="hover:text-white">{t.nav.story}</Link></li>
            <li><Link to="/about" className="hover:text-white">{t.nav.about}</Link></li>
            <li><Link to="/products" className="hover:text-white">{t.nav.products}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[hsl(var(--gold))] text-xs tracking-[0.25em] mb-4">CONTACT</h4>
          <ul className="space-y-3 text-white/60 text-sm">
            <li className="flex items-start gap-3"><Phone className="w-4 h-4 text-[hsl(var(--gold))] mt-0.5" /> {phone}</li>
            <li className="flex items-start gap-3"><Mail className="w-4 h-4 text-[hsl(var(--gold))] mt-0.5" /> {email}</li>
            <li className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[hsl(var(--gold))] mt-0.5" /> {address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--gold))]/10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-xs text-white/40 flex flex-col md:flex-row justify-between gap-3">
          <p>© {new Date().getFullYear()} Stone Lift. All rights reserved.</p>
          <Link to="/admin" className="hover:text-[hsl(var(--gold))]">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
