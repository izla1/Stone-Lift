import { useState, useEffect } from 'react';
import { Menu, X, Phone, Globe, Sun, Moon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useLang } from '@/i18n/LanguageContext';
import { useSite } from '@/cms/SiteContext';
import { useTheme } from '@/theme/ThemeContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  const { settings, pages } = useSite();
  const { mode, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const customNav = pages.filter((p) => p.show_in_nav).map((p) => ({
    to: `/p/${p.slug}`,
    label: (lang === 'ar' ? p.title_ar : p.title_en) || p.title_en,
    end: false,
  }));

  const links: { to: string; label: string; end?: boolean }[] = [
    { to: '/', label: t.nav.home, end: true },
    { to: '/story', label: t.nav.story },
    { to: '/about', label: t.nav.about },
    { to: '/products', label: t.nav.products },
    { to: '/contact', label: t.nav.contact },
    ...customNav,
  ];

  const b = settings?.branding;
  const fallbackLogo = 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/stone_lift_quick_guide.pdf_ah9tlr';
  const logo = (mode === 'light' ? (b?.navLogoLight || b?.logo) : (b?.navLogoDark || b?.logo)) || fallbackLogo;
  const phone = settings?.contact.phone || '0155 493 0095';
  const whatsapp = settings?.contact.whatsapp || '201554930095';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-md bg-black/50 shadow-lg shadow-black/50 py-3' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Stone Lift"
            className="h-12 md:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(201,168,76,0.6)]"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-[hsl(var(--gold))]' : 'text-white/80 hover:text-[hsl(var(--gold))]'}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full glass-gold text-[hsl(var(--gold))] flex items-center justify-center hover:bg-[hsl(var(--gold))]/20 transition-colors"
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full glass-gold text-[hsl(var(--gold))] text-xs font-bold tracking-wider hover:bg-[hsl(var(--gold))]/20 transition-colors"
            aria-label="Switch language"
          >
            <Globe size={14} />
            {lang === 'en' ? 'العربية' : 'EN'}
          </button>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener" className="btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2">
            <Phone size={14} /> {phone}
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-white" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[hsl(var(--gold))]/20 bg-black/90 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)} className="text-white py-2">
                {l.label}
              </NavLink>
            ))}
            <div className="flex gap-2">
              <button onClick={() => { setLang(lang === 'en' ? 'ar' : 'en'); setOpen(false); }} className="self-start flex items-center gap-2 px-3 py-2 rounded-full glass-gold text-[hsl(var(--gold))] text-xs font-bold">
                <Globe size={14} /> {lang === 'en' ? 'العربية' : 'EN'}
              </button>
              <button onClick={toggle} className="self-start flex items-center gap-2 px-3 py-2 rounded-full glass-gold text-[hsl(var(--gold))] text-xs font-bold" aria-label="Toggle theme">
                {mode === 'dark' ? <Sun size={14} /> : <Moon size={14} />} {mode === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  );
}
