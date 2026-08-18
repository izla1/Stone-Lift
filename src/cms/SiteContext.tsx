import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ThemePalette {
  background: string;
  foreground: string;
  gold: string;
  goldLight: string;
  red: string;
  redLight: string;
  // Per-text colors (HSL triplets). When empty, components fall back to foreground.
  textHeading: string;
  textBody: string;
  textMuted: string;
  textAccent: string;
  // Extended fine-grained controls
  textLink: string;
  textKicker: string;
  buttonText: string;
  borderColor: string;
  cardBg: string;
}

export interface SiteTheme {
  // Legacy flat fields kept for backward compat
  dark: string; gold: string; goldLight: string; red: string; redLight: string; background: string; foreground: string;
  // New per-mode palettes
  darkMode: ThemePalette;
  lightMode: ThemePalette;
}

export interface Typography {
  headingFont: string;   // e.g. "'Playfair Display', serif"
  bodyFont: string;      // e.g. "'Inter', sans-serif"
  arabicFont: string;    // e.g. "'Noto Naskh Arabic', serif"
}

export interface SiteSettings {
  branding: {
    logo: string; siteName: string;
    navLogoLight?: string; navLogoDark?: string;
    footerLogoLight?: string; footerLogoDark?: string;
  };
  theme: SiteTheme;
  typography: Typography;
  contact: { phone: string; whatsapp: string; email: string; address_en: string; address_ar: string; mapEmbed: string };
  social: { name: string; url: string }[];
  hero: { kicker_en: string; kicker_ar: string; title1_en: string; title1_ar: string; title2_en: string; title2_ar: string; desc_en: string; desc_ar: string; cta_en: string; cta_ar: string; image: string };
  whoweare: { kicker_en: string; kicker_ar: string; title_en: string; title_ar: string; desc_en: string; desc_ar: string; image: string };
  story: { kicker_en: string; kicker_ar: string; title_en: string; title_ar: string; body_en: string; body_ar: string };
  stats: { value: string; label_en: string; label_ar: string }[];
  products_section: { kicker_en: string; kicker_ar: string; title1_en: string; title1_ar: string; title2_en: string; title2_ar: string; desc_en: string; desc_ar: string; learn_en: string; learn_ar: string };
  diff: {
    kicker_en: string; kicker_ar: string;
    title1_en: string; title1_ar: string;
    title2_en: string; title2_ar: string;
    others_en: string; others_ar: string;
    us_en: string; us_ar: string;
    footer1_en: string; footer1_ar: string;
    footer2_en: string; footer2_ar: string;
    image: string;
    rows: { other_en: string; other_ar: string; us_en: string; us_ar: string }[];
  };
}

export interface ProductRow {
  id: string; slug: string; name: string;
  subtitle_en: string | null; subtitle_ar: string | null;
  tagline_en: string | null; tagline_ar: string | null;
  desc_en: string | null; desc_ar: string | null;
  image: string | null; video_url: string | null;
  gallery: string[]; tag: string | null; accent: string | null;
  features_en: string[]; features_ar: string[];
  specs: { label_en: string; label_ar: string; value: string }[];
  sort_order: number; visible: boolean;
}

export interface CustomPage {
  id: string; slug: string;
  title_en: string; title_ar: string | null;
  blocks: { type: 'heading' | 'text' | 'image'; en?: string; ar?: string; url?: string }[];
  show_in_nav: boolean; sort_order: number; published: boolean;
}

interface Ctx {
  settings: SiteSettings | null;
  products: ProductRow[];
  pages: CustomPage[];
  loading: boolean;
  refresh: () => Promise<void>;
}

/** Returns inline style object honoring a per-field color override stored at `settings[section].__colors[field]`. */
export function useTextColor(section: string, field: string): React.CSSProperties {
  const c = useContext(SiteContext);
  const v = (c?.settings as any)?.[section]?.__colors?.[field];
  return v ? { color: v } : {};
}

const SiteContext = createContext<Ctx | null>(null);

export const useSite = () => {
  const c = useContext(SiteContext);
  if (!c) throw new Error('useSite must be used within SiteProvider');
  return c;
};

const DARK_DEFAULT: ThemePalette = {
  background: '0 60% 3%', foreground: '0 0% 100%',
  gold: '43 53% 54%', goldLight: '43 64% 69%',
  red: '0 70% 36%', redLight: '6 70% 47%',
  textHeading: '', textBody: '', textMuted: '', textAccent: '',
  textLink: '', textKicker: '', buttonText: '', borderColor: '', cardBg: '',
};
const LIGHT_DEFAULT: ThemePalette = {
  background: '38 40% 92%', foreground: '0 0% 12%',
  gold: '32 35% 44%', goldLight: '32 40% 55%',
  red: '0 64% 34%', redLight: '0 64% 40%',
  textHeading: '', textBody: '', textMuted: '', textAccent: '',
  textLink: '', textKicker: '', buttonText: '', borderColor: '', cardBg: '',
};

const DEFAULTS: SiteSettings = {
  branding: { logo: '', siteName: 'Stone Lift' },
  theme: {
    dark: '0 0% 4%', gold: '43 56% 52%', goldLight: '43 70% 65%', red: '0 72% 45%', redLight: '0 85% 60%', background: '0 0% 4%', foreground: '0 0% 98%',
    darkMode: DARK_DEFAULT, lightMode: LIGHT_DEFAULT,
  },
  typography: {
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    arabicFont: "'Noto Naskh Arabic', serif",
  },
  contact: { phone: '', whatsapp: '', email: '', address_en: '', address_ar: '', mapEmbed: '' },
  social: [],
  hero: { kicker_en: '', kicker_ar: '', title1_en: '', title1_ar: '', title2_en: '', title2_ar: '', desc_en: '', desc_ar: '', cta_en: '', cta_ar: '', image: '' },
  whoweare: { kicker_en: '', kicker_ar: '', title_en: '', title_ar: '', desc_en: '', desc_ar: '', image: '' },
  story: { kicker_en: '', kicker_ar: '', title_en: '', title_ar: '', body_en: '', body_ar: '' },
  stats: [],
  products_section: { kicker_en: '', kicker_ar: '', title1_en: '', title1_ar: '', title2_en: '', title2_ar: '', desc_en: '', desc_ar: '', learn_en: 'Learn more', learn_ar: 'اعرف المزيد' },
  diff: {
    kicker_en: '', kicker_ar: '',
    title1_en: '', title1_ar: '',
    title2_en: '', title2_ar: '',
    others_en: '', others_ar: '',
    us_en: '', us_ar: '',
    footer1_en: '', footer1_ar: '',
    footer2_en: '', footer2_ar: '',
    image: '',
    rows: [],
  },
};

function applyThemeAndFonts(settings: SiteSettings) {
  const root = document.documentElement;
  const isLight = root.classList.contains('light');
  const palette = isLight ? { ...LIGHT_DEFAULT, ...(settings.theme.lightMode || {}) }
                          : { ...DARK_DEFAULT,  ...(settings.theme.darkMode  || {}) };

  // Only accept valid HSL triplets like "43 56% 52%" — silently skip garbage so a bad value can't blank the site.
  const HSL_RE = /^\s*\d+(?:\.\d+)?\s+\d+(?:\.\d+)?%\s+\d+(?:\.\d+)?%\s*$/;
  const setVar = (k: string, v: string) => {
    if (v && HSL_RE.test(v)) root.style.setProperty(k, v.trim());
    else root.style.removeProperty(k);
  };
  // Fonts use a different format
  const setRawVar = (k: string, v: string) => {
    if (v && v.trim()) root.style.setProperty(k, v);
    else root.style.removeProperty(k);
  };

  setVar('--background', palette.background);
  setVar('--foreground', palette.foreground);
  setVar('--gold', palette.gold);
  setVar('--gold-light', palette.goldLight);
  setVar('--red', palette.red);
  setVar('--red-light', palette.redLight);

  // Per-text custom colors (optional). Components/global CSS read these.
  setVar('--text-heading', palette.textHeading || palette.foreground);
  setVar('--text-body',    palette.textBody    || palette.foreground);
  setVar('--text-muted-custom', palette.textMuted || '');
  setVar('--text-accent',  palette.textAccent  || palette.gold);
  setVar('--text-link',    palette.textLink    || palette.gold);
  setVar('--text-kicker',  palette.textKicker  || palette.gold);
  setVar('--button-text',  palette.buttonText  || '0 0% 100%');
  setVar('--border-color', palette.borderColor || palette.gold);
  setVar('--card-bg-custom', palette.cardBg    || '');

  // Fonts
  const t = settings.typography || DEFAULTS.typography;
  setRawVar('--font-heading', t.headingFont || DEFAULTS.typography.headingFont);
  setRawVar('--font-body',    t.bodyFont    || DEFAULTS.typography.bodyFont);
  setRawVar('--font-arabic',  t.arabicFont  || DEFAULTS.typography.arabicFont);
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [{ data: s }, { data: p }, { data: pg }] = await Promise.all([
      supabase.from('site_settings').select('*'),
      supabase.from('products').select('*').order('sort_order'),
      supabase.from('custom_pages').select('*').order('sort_order'),
    ]);
    const merged: SiteSettings = JSON.parse(JSON.stringify(DEFAULTS));
    (s || []).forEach((row: any) => {
      const def = (DEFAULTS as any)[row.key];
      const val = row.value;
      if (Array.isArray(def)) {
        (merged as any)[row.key] = Array.isArray(val) ? val : def;
      } else if (def && typeof def === 'object') {
        // Deep-ish merge for theme.darkMode / lightMode
        if (row.key === 'theme' && val && typeof val === 'object') {
          (merged as any).theme = {
            ...def, ...val,
            darkMode:  { ...DARK_DEFAULT,  ...(val.darkMode  || {}) },
            lightMode: { ...LIGHT_DEFAULT, ...(val.lightMode || {}) },
          };
        } else {
          (merged as any)[row.key] = { ...def, ...(val && typeof val === 'object' && !Array.isArray(val) ? val : {}) };
        }
      } else {
        (merged as any)[row.key] = val ?? def;
      }
    });
    setSettings(merged);

    const normProducts = ((p || []) as any[]).map((r) => ({
      ...r,
      gallery: Array.isArray(r.gallery) ? r.gallery : [],
      features_en: Array.isArray(r.features_en) ? r.features_en : [],
      features_ar: Array.isArray(r.features_ar) ? r.features_ar : [],
      specs: Array.isArray(r.specs) ? r.specs : [],
    })) as ProductRow[];
    setProducts(normProducts);
    const normPages = ((pg || []) as any[]).filter((x) => x.published).map((r) => ({
      ...r,
      blocks: Array.isArray(r.blocks) ? r.blocks : [],
    })) as CustomPage[];
    setPages(normPages);
    setLoading(false);

    applyThemeAndFonts(merged);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Re-apply CMS theme whenever the user toggles light/dark on <html>.
  useEffect(() => {
    if (!settings) return;
    const obs = new MutationObserver(() => applyThemeAndFonts(settings));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, [settings]);

  return <SiteContext.Provider value={{ settings, products, pages, loading, refresh }}>{children}</SiteContext.Provider>;
}
