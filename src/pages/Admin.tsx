import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSite, ProductRow, CustomPage } from '@/cms/SiteContext';
import { toast } from 'sonner';
import {
  LayoutDashboard, FileText, Package, Palette, Users, Mail, FilePlus,
  LogOut, Plus, Trash2, Save, Eye, EyeOff, Upload
} from 'lucide-react';

interface TeamMember {
  id: string; username: string; password: string; display_name: string | null; role: string;
}
interface Lead {
  id: string; name: string | null; email: string | null; phone: string | null; message: string | null; created_at: string;
}

const TABS = [
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'pages', label: 'Custom Pages', icon: FilePlus },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'leads', label: 'Leads', icon: Mail },
] as const;

export default function Admin() {
  const { settings, products, pages, refresh, loading } = useSite();
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState<TeamMember | null>(null);
  const [tab, setTab] = useState<typeof TABS[number]['id']>('content');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => { document.title = 'Admin — Stone Lift'; }, []);

  // Try existing session
  useEffect(() => {
    const raw = sessionStorage.getItem('sl_admin_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); setAuthed(true); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => setLeads((data as Lead[]) || []));
    supabase.from('team_members').select('*').order('created_at').then(({ data }) => setTeam((data as TeamMember[]) || []));
  }, [authed]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await supabase.from('team_members').select('*')
      .eq('username', loginForm.username.trim())
      .eq('password', loginForm.password)
      .maybeSingle();
    if (!data) { toast.error('Invalid credentials'); return; }
    setUser(data as TeamMember);
    setAuthed(true);
    sessionStorage.setItem('sl_admin_user', JSON.stringify(data));
    toast.success(`Welcome, ${(data as TeamMember).display_name || (data as TeamMember).username}`);
  }

  function logout() {
    sessionStorage.removeItem('sl_admin_user');
    setAuthed(false); setUser(null);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'hsl(var(--dark))' }}>
        <form onSubmit={login} className="w-full max-w-sm glass-gold rounded-3xl p-8 space-y-5">
          <h1 className="font-display text-3xl font-black text-white text-center">Stone Lift Admin</h1>
          <p className="text-white/50 text-sm text-center">Sign in to manage your website</p>
          <input autoFocus type="text" placeholder="Username" required value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--gold))]" />
          <input type="password" placeholder="Password" required value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--gold))]" />
          <button type="submit" className="w-full btn-primary text-white font-semibold py-3 rounded-full">Sign In</button>
          <Link to="/" className="block text-center text-white/40 text-xs hover:text-[hsl(var(--gold))]">← Back to site</Link>
        </form>
      </div>
    );
  }

  if (loading || !settings) return <div className="min-h-screen text-center pt-32 text-white/50">Loading dashboard...</div>;

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(var(--dark))' }}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-[hsl(var(--gold))]/20 p-6 flex flex-col">
        <Link to="/" className="font-display text-xl font-black text-white mb-1">Stone Lift</Link>
        <p className="text-[hsl(var(--gold))] text-xs tracking-widest uppercase mb-8">Admin Panel</p>
        <nav className="space-y-1 flex-1">
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${tab === tb.id ? 'bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold))]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
              <tb.icon size={16} /> {tb.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-4 mt-4">
          <p className="text-white text-sm font-medium">{user?.display_name || user?.username}</p>
          <p className="text-white/40 text-xs mb-3">{user?.role}</p>
          <button onClick={logout} className="w-full flex items-center gap-2 text-white/60 hover:text-white text-xs"><LogOut size={14} /> Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {tab === 'content' && <ContentTab refresh={refresh} settings={settings} />}
        {tab === 'products' && <ProductsTab products={products} refresh={refresh} />}
        {tab === 'pages' && <PagesTab pages={pages} refresh={refresh} />}
        {tab === 'theme' && <ThemeTab refresh={refresh} settings={settings} />}
        {tab === 'team' && <TeamTab team={team} setTeam={setTeam} />}
        {tab === 'leads' && <LeadsTab leads={leads} />}
      </main>
    </div>
  );
}

/* ============= Content tab ============= */
function ContentTab({ settings, refresh }: any) {
  const [s, setS] = useState(settings);
  useEffect(() => setS(settings), [settings]);

  async function save(key: string, value: any) {
    const { error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) { toast.error(error.message); return; }
    toast.success(`${key} saved`);
    refresh();
  }

  const SECTIONS: { key: string; title: string; fields: { name: string; label: string; type?: 'text' | 'textarea' | 'image' }[] }[] = [
    { key: 'branding', title: 'Branding & Logos', fields: [
      { name: 'siteName', label: 'Site name' },
      { name: 'logo', label: 'Default Logo URL (fallback)', type: 'image' },
      { name: 'navLogoDark', label: 'Navbar Logo — Night Theme', type: 'image' },
      { name: 'navLogoLight', label: 'Navbar Logo — Day Theme', type: 'image' },
      { name: 'footerLogoDark', label: 'Footer Logo — Night Theme', type: 'image' },
      { name: 'footerLogoLight', label: 'Footer Logo — Day Theme', type: 'image' },
    ]},
    { key: 'hero', title: 'Hero Section', fields: [
      { name: 'kicker_en', label: 'Kicker (EN)' }, { name: 'kicker_ar', label: 'Kicker (AR)' },
      { name: 'title1_en', label: 'Title line 1 (EN)' }, { name: 'title1_ar', label: 'Title line 1 (AR)' },
      { name: 'title2_en', label: 'Title line 2 (EN)' }, { name: 'title2_ar', label: 'Title line 2 (AR)' },
      { name: 'desc_en', label: 'Description (EN)', type: 'textarea' }, { name: 'desc_ar', label: 'Description (AR)', type: 'textarea' },
      { name: 'cta_en', label: 'CTA button (EN)' }, { name: 'cta_ar', label: 'CTA button (AR)' },
      { name: 'image', label: 'Hero Image URL', type: 'image' },
    ]},
    { key: 'whoweare', title: 'Who We Are', fields: [
      { name: 'kicker_en', label: 'Kicker (EN)' }, { name: 'kicker_ar', label: 'Kicker (AR)' },
      { name: 'title_en', label: 'Title (EN)' }, { name: 'title_ar', label: 'Title (AR)' },
      { name: 'desc_en', label: 'Description (EN)', type: 'textarea' }, { name: 'desc_ar', label: 'Description (AR)', type: 'textarea' },
      { name: 'image', label: 'Background Image URL', type: 'image' },
    ]},
    { key: 'story', title: 'Story Section', fields: [
      { name: 'kicker_en', label: 'Kicker (EN)' }, { name: 'kicker_ar', label: 'Kicker (AR)' },
      { name: 'title_en', label: 'Title (EN)' }, { name: 'title_ar', label: 'Title (AR)' },
      { name: 'body_en', label: 'Body (EN)', type: 'textarea' }, { name: 'body_ar', label: 'Body (AR)', type: 'textarea' },
    ]},
    { key: 'diff', title: 'Why We Are Different', fields: [
      { name: 'kicker_en', label: 'Kicker (EN)' }, { name: 'kicker_ar', label: 'Kicker (AR)' },
      { name: 'title1_en', label: 'Title line 1 (EN)' }, { name: 'title1_ar', label: 'Title line 1 (AR)' },
      { name: 'title2_en', label: 'Title line 2 (EN)' }, { name: 'title2_ar', label: 'Title line 2 (AR)' },
      { name: 'others_en', label: 'Left column heading (EN)' }, { name: 'others_ar', label: 'Left column heading (AR)' },
      { name: 'us_en', label: 'Right column heading (EN)' }, { name: 'us_ar', label: 'Right column heading (AR)' },
      { name: 'footer1_en', label: 'Footer line 1 (EN)' }, { name: 'footer1_ar', label: 'Footer line 1 (AR)' },
      { name: 'footer2_en', label: 'Footer line 2 (EN)', type: 'textarea' }, { name: 'footer2_ar', label: 'Footer line 2 (AR)', type: 'textarea' },
      { name: 'image', label: 'Background Image URL', type: 'image' },
    ]},
    { key: 'products_section', title: 'Products Section Heading', fields: [
      { name: 'kicker_en', label: 'Kicker (EN)' }, { name: 'kicker_ar', label: 'Kicker (AR)' },
      { name: 'title1_en', label: 'Title 1 (EN)' }, { name: 'title1_ar', label: 'Title 1 (AR)' },
      { name: 'title2_en', label: 'Title 2 (EN)' }, { name: 'title2_ar', label: 'Title 2 (AR)' },
      { name: 'desc_en', label: 'Description (EN)', type: 'textarea' }, { name: 'desc_ar', label: 'Description (AR)', type: 'textarea' },
      { name: 'learn_en', label: 'Learn link (EN)' }, { name: 'learn_ar', label: 'Learn link (AR)' },
    ]},
    { key: 'contact', title: 'Contact Info', fields: [
      { name: 'phone', label: 'Phone' }, { name: 'whatsapp', label: 'WhatsApp number (no +)' },
      { name: 'email', label: 'Email' },
      { name: 'address_en', label: 'Address (EN)' }, { name: 'address_ar', label: 'Address (AR)' },
      { name: 'mapEmbed', label: 'Google Maps Embed URL', type: 'textarea' },
    ]},
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-black text-white mb-2">Site Content</h1>
      <p className="text-white/50 mb-8 text-sm">Edit any text, image or link on the website.</p>

      {SECTIONS.map((sec) => (
        <div key={sec.key} className="glass rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-display text-xl text-white">{sec.title}</h3>
            <button onClick={() => save(sec.key, s[sec.key])} className="btn-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2"><Save size={12}/> Save</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {sec.fields.map((f) => {
              const colorVal = s[sec.key]?.__colors?.[f.name] || '';
              const setColor = (v: string) => setS({
                ...s,
                [sec.key]: {
                  ...s[sec.key],
                  __colors: { ...(s[sec.key]?.__colors || {}), [f.name]: v },
                },
              });
              return (
              <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea rows={3} value={s[sec.key]?.[f.name] || ''}
                    onChange={(e) => setS({ ...s, [sec.key]: { ...s[sec.key], [f.name]: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[hsl(var(--gold))] resize-none" />
                ) : (
                  <input type="text" value={s[sec.key]?.[f.name] || ''}
                    onChange={(e) => setS({ ...s, [sec.key]: { ...s[sec.key], [f.name]: e.target.value } })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[hsl(var(--gold))]" />
                )}
                {f.type === 'image' && s[sec.key]?.[f.name] && (
                  <img src={s[sec.key][f.name]} alt="" className="mt-2 h-20 rounded border border-white/10" />
                )}
                {f.type !== 'image' && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-white/40 text-[10px] uppercase tracking-wider">Text color</span>
                    <input type="color" value={colorVal || '#ffffff'} onChange={(e) => setColor(e.target.value)}
                      className="h-7 w-10 rounded border border-white/10 bg-transparent cursor-pointer" />
                    <input type="text" value={colorVal} placeholder="inherit" onChange={(e) => setColor(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs" />
                    {colorVal && (
                      <button type="button" onClick={() => setColor('')} className="text-white/40 hover:text-white text-[10px]">reset</button>
                    )}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Social Links */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-xl text-white">Social Links</h3>
          <button onClick={() => save('social', s.social)} className="btn-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2"><Save size={12}/> Save</button>
        </div>
        {(s.social || []).map((soc: any, i: number) => (
          <div key={i} className="flex gap-3 mb-3">
            <input value={soc.name} onChange={(e) => { const c = [...s.social]; c[i] = { ...c[i], name: e.target.value }; setS({ ...s, social: c }); }}
              placeholder="Name (e.g. Facebook)" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            <input value={soc.url} onChange={(e) => { const c = [...s.social]; c[i] = { ...c[i], url: e.target.value }; setS({ ...s, social: c }); }}
              placeholder="URL" className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            <button onClick={() => setS({ ...s, social: s.social.filter((_: any, j: number) => j !== i) })} className="text-red-400 hover:text-red-300 px-3"><Trash2 size={14}/></button>
          </div>
        ))}
        <button onClick={() => setS({ ...s, social: [...(s.social || []), { name: '', url: '' }] })} className="text-[hsl(var(--gold))] text-xs flex items-center gap-1 mt-2"><Plus size={14}/> Add social</button>
      </div>

      {/* Stats */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-xl text-white">Stats</h3>
          <button onClick={() => save('stats', s.stats)} className="btn-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2"><Save size={12}/> Save</button>
        </div>
        {(s.stats || []).map((st: any, i: number) => (
          <div key={i} className="grid grid-cols-4 gap-2 mb-2">
            <input value={st.value} placeholder="Value" onChange={(e) => { const c = [...s.stats]; c[i] = { ...c[i], value: e.target.value }; setS({ ...s, stats: c }); }} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            <input value={st.label_en} placeholder="Label EN" onChange={(e) => { const c = [...s.stats]; c[i] = { ...c[i], label_en: e.target.value }; setS({ ...s, stats: c }); }} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            <input value={st.label_ar} placeholder="Label AR" onChange={(e) => { const c = [...s.stats]; c[i] = { ...c[i], label_ar: e.target.value }; setS({ ...s, stats: c }); }} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            <button onClick={() => setS({ ...s, stats: s.stats.filter((_: any, j: number) => j !== i) })} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
          </div>
        ))}
        <button onClick={() => setS({ ...s, stats: [...(s.stats || []), { value: '', label_en: '', label_ar: '' }] })} className="text-[hsl(var(--gold))] text-xs flex items-center gap-1 mt-2"><Plus size={14}/> Add stat</button>
      </div>

      {/* Why Different rows */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display text-xl text-white">Why We Are Different — Comparison Rows</h3>
          <button onClick={() => save('diff', s.diff)} className="btn-primary text-white text-xs px-4 py-2 rounded-full inline-flex items-center gap-2"><Save size={12}/> Save</button>
        </div>
        <p className="text-white/40 text-xs mb-3">Each row pairs what others say (left) with what Stone Lift says (right).</p>
        {((s.diff?.rows) || []).map((r: any, i: number) => (
          <div key={i} className="grid md:grid-cols-2 gap-2 mb-3 p-3 border border-white/10 rounded-lg">
            <div className="space-y-2">
              <input value={r.other_en || ''} placeholder="Others say (EN)" onChange={(e) => { const c = [...s.diff.rows]; c[i] = { ...c[i], other_en: e.target.value }; setS({ ...s, diff: { ...s.diff, rows: c } }); }} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              <input value={r.other_ar || ''} placeholder="Others say (AR)" onChange={(e) => { const c = [...s.diff.rows]; c[i] = { ...c[i], other_ar: e.target.value }; setS({ ...s, diff: { ...s.diff, rows: c } }); }} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="space-y-2">
              <input value={r.us_en || ''} placeholder="We say (EN)" onChange={(e) => { const c = [...s.diff.rows]; c[i] = { ...c[i], us_en: e.target.value }; setS({ ...s, diff: { ...s.diff, rows: c } }); }} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              <input value={r.us_ar || ''} placeholder="We say (AR)" onChange={(e) => { const c = [...s.diff.rows]; c[i] = { ...c[i], us_ar: e.target.value }; setS({ ...s, diff: { ...s.diff, rows: c } }); }} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button onClick={() => setS({ ...s, diff: { ...s.diff, rows: s.diff.rows.filter((_: any, j: number) => j !== i) } })} className="text-red-400 hover:text-red-300 text-xs inline-flex items-center gap-1"><Trash2 size={12}/> Remove row</button>
            </div>
          </div>
        ))}
        <button onClick={() => setS({ ...s, diff: { ...(s.diff || {}), rows: [...((s.diff?.rows) || []), { other_en: '', other_ar: '', us_en: '', us_ar: '' }] } })} className="text-[hsl(var(--gold))] text-xs flex items-center gap-1 mt-2"><Plus size={14}/> Add comparison row</button>
      </div>
    </div>
  );
}
function ProductsTab({ products, refresh }: { products: ProductRow[]; refresh: () => void }) {
  const [editing, setEditing] = useState<ProductRow | null>(null);

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    toast.success('Deleted'); refresh();
  }

  async function toggleVisible(p: ProductRow) {
    await supabase.from('products').update({ visible: !p.visible }).eq('id', p.id);
    refresh();
  }

  function blank(): ProductRow {
    return { id: '', slug: '', name: '', subtitle_en: '', subtitle_ar: '', tagline_en: '', tagline_ar: '', desc_en: '', desc_ar: '', image: '', video_url: '', gallery: [], tag: 'Home', accent: 'gold', features_en: [], features_ar: [], specs: [], sort_order: products.length + 1, visible: true };
  }

  if (editing) return <ProductEditor product={editing} onClose={() => { setEditing(null); refresh(); }} />;

  return (
    <div className="max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-white">Products</h1>
          <p className="text-white/50 text-sm">Manage every product card and detail page.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="btn-primary text-white text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-2"><Plus size={14}/> New product</button>
      </div>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
            {p.image && <img src={p.image} className="w-16 h-16 object-cover rounded-lg" alt={p.name} />}
            <div className="flex-1">
              <p className="text-white font-semibold">{p.name}</p>
              <p className="text-white/40 text-xs">/products/{p.slug} · {p.tag}</p>
            </div>
            <button onClick={() => toggleVisible(p)} className="text-white/60 hover:text-white p-2" title={p.visible ? 'Hide' : 'Show'}>
              {p.visible ? <Eye size={16}/> : <EyeOff size={16}/>}
            </button>
            <button onClick={() => setEditing(p)} className="text-[hsl(var(--gold))] text-sm px-4 py-2 rounded-full border border-[hsl(var(--gold))]/30 hover:bg-[hsl(var(--gold))]/10">Edit</button>
            <button onClick={() => remove(p.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductEditor({ product, onClose }: { product: ProductRow; onClose: () => void }) {
  const [p, setP] = useState<ProductRow>(product);
  const isNew = !product.id;

  async function save() {
    const payload: any = { ...p };
    delete payload.id;
    if (isNew) {
      const { error } = await supabase.from('products').insert(payload);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', product.id);
      if (error) return toast.error(error.message);
    }
    toast.success('Saved'); onClose();
  }

  function arrField<K extends 'features_en' | 'features_ar'>(key: K) {
    return (
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">{key.replace('_', ' ')}</label>
        {p[key].map((f, i) => (
          <div key={i} className="flex gap-2 mb-1">
            <input value={f} onChange={(e) => { const c = [...p[key]]; c[i] = e.target.value; setP({ ...p, [key]: c }); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm" />
            <button onClick={() => setP({ ...p, [key]: p[key].filter((_, j) => j !== i) })} className="text-red-400"><Trash2 size={14}/></button>
          </div>
        ))}
        <button onClick={() => setP({ ...p, [key]: [...p[key], ''] })} className="text-[hsl(var(--gold))] text-xs flex items-center gap-1"><Plus size={12}/> Add</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <button onClick={onClose} className="text-white/50 text-sm mb-4">← Back</button>
      <h1 className="font-display text-2xl font-black text-white mb-6">{isNew ? 'New' : 'Edit'} Product</h1>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['name','Name'],['slug','Slug (url-friendly)'],
            ['subtitle_en','Subtitle EN'],['subtitle_ar','Subtitle AR'],
            ['tagline_en','Tagline EN'],['tagline_ar','Tagline AR'],
            ['image','Image URL'],['video_url','Video Embed URL (optional)'],
            ['tag','Tag (Home / Commercial / Accessibility)'],['accent','Accent (gold / red)'],
          ].map(([k, label]) => (
            <div key={k}>
              <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">{label}</label>
              <input value={(p as any)[k] || ''} onChange={(e) => setP({ ...p, [k]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Description EN</label>
            <textarea rows={4} value={p.desc_en || ''} onChange={(e) => setP({ ...p, desc_en: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
          </div>
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Description AR</label>
            <textarea rows={4} value={p.desc_ar || ''} onChange={(e) => setP({ ...p, desc_ar: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">{arrField('features_en')}{arrField('features_ar')}</div>

        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Specs</label>
          {p.specs.map((s, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-1">
              <input placeholder="Label EN" value={s.label_en} onChange={(e) => { const c = [...p.specs]; c[i] = { ...c[i], label_en: e.target.value }; setP({ ...p, specs: c }); }} className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm" />
              <input placeholder="Label AR" value={s.label_ar} onChange={(e) => { const c = [...p.specs]; c[i] = { ...c[i], label_ar: e.target.value }; setP({ ...p, specs: c }); }} className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm" />
              <input placeholder="Value" value={s.value} onChange={(e) => { const c = [...p.specs]; c[i] = { ...c[i], value: e.target.value }; setP({ ...p, specs: c }); }} className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm" />
              <button onClick={() => setP({ ...p, specs: p.specs.filter((_, j) => j !== i) })} className="text-red-400"><Trash2 size={14}/></button>
            </div>
          ))}
          <button onClick={() => setP({ ...p, specs: [...p.specs, { label_en: '', label_ar: '', value: '' }] })} className="text-[hsl(var(--gold))] text-xs flex items-center gap-1"><Plus size={12}/> Add spec</button>
        </div>

        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Gallery image URLs</label>
          {p.gallery.map((url, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input value={url} onChange={(e) => { const c = [...p.gallery]; c[i] = e.target.value; setP({ ...p, gallery: c }); }} className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm" />
              <button onClick={() => setP({ ...p, gallery: p.gallery.filter((_, j) => j !== i) })} className="text-red-400"><Trash2 size={14}/></button>
            </div>
          ))}
          <button onClick={() => setP({ ...p, gallery: [...p.gallery, ''] })} className="text-[hsl(var(--gold))] text-xs flex items-center gap-1"><Plus size={12}/> Add image</button>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button onClick={save} className="btn-primary text-white px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2"><Save size={14}/> Save</button>
          <button onClick={onClose} className="btn-outline px-6 py-2.5 rounded-full text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ============= Pages tab ============= */
function PagesTab({ pages, refresh }: { pages: CustomPage[]; refresh: () => void }) {
  const [editing, setEditing] = useState<CustomPage | null>(null);

  async function remove(id: string) {
    if (!confirm('Delete this page?')) return;
    await supabase.from('custom_pages').delete().eq('id', id);
    toast.success('Deleted'); refresh();
  }

  function blank(): CustomPage {
    return { id: '', slug: '', title_en: '', title_ar: '', blocks: [], show_in_nav: false, sort_order: pages.length + 1, published: true };
  }

  if (editing) return <PageEditor page={editing} onClose={() => { setEditing(null); refresh(); }} />;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-white">Custom Pages</h1>
          <p className="text-white/50 text-sm">Build your own pages, accessible at /p/your-slug</p>
        </div>
        <button onClick={() => setEditing(blank())} className="btn-primary text-white text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-2"><Plus size={14}/> New page</button>
      </div>
      <div className="space-y-3">
        {pages.length === 0 && <p className="text-white/40 text-sm">No custom pages yet.</p>}
        {pages.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold">{p.title_en}</p>
              <p className="text-white/40 text-xs">/p/{p.slug} {p.show_in_nav && '· in navigation'}</p>
            </div>
            <button onClick={() => setEditing(p)} className="text-[hsl(var(--gold))] text-sm px-4 py-2 rounded-full border border-[hsl(var(--gold))]/30 hover:bg-[hsl(var(--gold))]/10">Edit</button>
            <button onClick={() => remove(p.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageEditor({ page, onClose }: { page: CustomPage; onClose: () => void }) {
  const [p, setP] = useState<CustomPage>(page);
  const isNew = !page.id;

  async function save() {
    const payload: any = { ...p };
    delete payload.id;
    if (isNew) {
      const { error } = await supabase.from('custom_pages').insert(payload);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from('custom_pages').update(payload).eq('id', page.id);
      if (error) return toast.error(error.message);
    }
    toast.success('Saved'); onClose();
  }

  function addBlock(type: 'heading' | 'text' | 'image') {
    setP({ ...p, blocks: [...p.blocks, { type, en: '', ar: '', url: '' }] });
  }

  return (
    <div className="max-w-4xl">
      <button onClick={onClose} className="text-white/50 text-sm mb-4">← Back</button>
      <h1 className="font-display text-2xl font-black text-white mb-6">{isNew ? 'New' : 'Edit'} Page</h1>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="text-white/50 text-xs uppercase block mb-1">Title EN</label>
            <input value={p.title_en} onChange={(e) => setP({ ...p, title_en: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" /></div>
          <div><label className="text-white/50 text-xs uppercase block mb-1">Title AR</label>
            <input value={p.title_ar || ''} onChange={(e) => setP({ ...p, title_ar: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" /></div>
          <div><label className="text-white/50 text-xs uppercase block mb-1">Slug</label>
            <input value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" /></div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-white text-sm"><input type="checkbox" checked={p.show_in_nav} onChange={(e) => setP({ ...p, show_in_nav: e.target.checked })} /> Show in navigation</label>
            <label className="flex items-center gap-2 text-white text-sm"><input type="checkbox" checked={p.published} onChange={(e) => setP({ ...p, published: e.target.checked })} /> Published</label>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Content blocks</h3>
          {p.blocks.map((b, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-3 mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[hsl(var(--gold))] text-xs uppercase">{b.type}</span>
                <button onClick={() => setP({ ...p, blocks: p.blocks.filter((_, j) => j !== i) })} className="text-red-400"><Trash2 size={14}/></button>
              </div>
              {b.type === 'image' ? (
                <input placeholder="Image URL" value={b.url || ''} onChange={(e) => { const c = [...p.blocks]; c[i] = { ...c[i], url: e.target.value }; setP({ ...p, blocks: c }); }} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm" />
              ) : (
                <div className="grid md:grid-cols-2 gap-2">
                  <textarea placeholder="English" rows={3} value={b.en || ''} onChange={(e) => { const c = [...p.blocks]; c[i] = { ...c[i], en: e.target.value }; setP({ ...p, blocks: c }); }} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm resize-none" />
                  <textarea placeholder="Arabic" rows={3} value={b.ar || ''} onChange={(e) => { const c = [...p.blocks]; c[i] = { ...c[i], ar: e.target.value }; setP({ ...p, blocks: c }); }} className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm resize-none" />
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={() => addBlock('heading')} className="text-[hsl(var(--gold))] text-xs border border-[hsl(var(--gold))]/30 px-3 py-1.5 rounded">+ Heading</button>
            <button onClick={() => addBlock('text')} className="text-[hsl(var(--gold))] text-xs border border-[hsl(var(--gold))]/30 px-3 py-1.5 rounded">+ Text</button>
            <button onClick={() => addBlock('image')} className="text-[hsl(var(--gold))] text-xs border border-[hsl(var(--gold))]/30 px-3 py-1.5 rounded">+ Image</button>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button onClick={save} className="btn-primary text-white px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2"><Save size={14}/> Save</button>
          <button onClick={onClose} className="btn-outline px-6 py-2.5 rounded-full text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ============= Theme tab ============= */

// --- Color conversion helpers (HSL triplet "H S% L%" <-> hex) ---
function hslTripletToHex(triplet: string): string {
  if (!triplet) return '#000000';
  const m = triplet.trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!m) return '#000000';
  let h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hexToHslTriplet(hex: string): string {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return '';
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, ss = 0;
  const ll = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    ss = ll > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hh = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hh = (b - r) / d + 2; break;
      case b: hh = (r - g) / d + 4; break;
    }
    hh /= 6;
  }
  return `${Math.round(hh * 360)} ${Math.round(ss * 100)}% ${Math.round(ll * 100)}%`;
}

function ThemeTab({ settings, refresh }: any) {
  const [t, setT] = useState<any>(() => ({
    ...settings.theme,
    darkMode: { ...(settings.theme.darkMode || {}) },
    lightMode: { ...(settings.theme.lightMode || {}) },
  }));
  const [typo, setTypo] = useState<any>(settings.typography || {});
  const [mode, setMode] = useState<'darkMode' | 'lightMode'>('darkMode');
  const [section, setSection] = useState<'surface' | 'text' | 'brand'>('surface');

  async function saveTheme() {
    const { error } = await supabase.from('site_settings').upsert({ key: 'theme', value: t, updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    toast.success('Theme saved'); refresh();
  }
  async function saveTypo() {
    const { error } = await supabase.from('site_settings').upsert({ key: 'typography', value: typo, updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    toast.success('Typography saved'); refresh();
  }

  const GROUPS: Record<string, { label: string; fields: [string, string, string?][] }> = {
    surface: {
      label: 'Surfaces & Layout',
      fields: [
        ['background', 'Page background', 'Main page background color'],
        ['foreground', 'Default text', 'Falls back here when a specific text color is empty'],
        ['borderColor', 'Border / divider', 'Borders, separators, outlines'],
        ['cardBg', 'Card background', 'Card / panel surfaces'],
      ],
    },
    text: {
      label: 'Text Colors',
      fields: [
        ['textHeading', 'Headings (h1–h6)'],
        ['textBody', 'Body / paragraph text'],
        ['textMuted', 'Muted / secondary text'],
        ['textAccent', 'Accent text (highlights)'],
        ['textKicker', 'Kicker / eyebrow text'],
        ['textLink', 'Links'],
        ['buttonText', 'Button text (on primary)'],
      ],
    },
    brand: {
      label: 'Brand Accents',
      fields: [
        ['gold', 'Gold accent'],
        ['goldLight', 'Gold light'],
        ['red', 'Red accent'],
        ['redLight', 'Red light'],
      ],
    },
  };

  const FONT_PRESETS = [
    "'Playfair Display', serif",
    "'Inter', sans-serif",
    "'Noto Naskh Arabic', serif",
    "'Cairo', sans-serif",
    "'Georgia', serif",
    "'Times New Roman', serif",
    "'Helvetica Neue', sans-serif",
    "'Arial', sans-serif",
    "system-ui, sans-serif",
  ];

  const palette = t[mode] || {};
  const setPaletteField = (k: string, v: string) =>
    setT({ ...t, [mode]: { ...palette, [k]: v } });

  const TEXT_TARGETS: [string, string][] = [
    ['headingFont', 'Headings font'],
    ['bodyFont', 'Body font'],
    ['arabicFont', 'Arabic font'],
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-black text-white mb-2">Theme & Typography</h1>
      <p className="text-white/50 text-sm mb-6">
        Click a swatch to open the RGB color picker. Changes save when you press <em>Save Theme</em>.
      </p>

      {/* Theme mode switch */}
      <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1 mb-4">
        <button onClick={() => setMode('lightMode')}
          className={`px-5 py-2 rounded-full text-sm transition ${mode === 'lightMode' ? 'bg-[hsl(var(--gold))] text-black font-semibold' : 'text-white/70'}`}>
          ☀ Day Theme
        </button>
        <button onClick={() => setMode('darkMode')}
          className={`px-5 py-2 rounded-full text-sm transition ${mode === 'darkMode' ? 'bg-[hsl(var(--gold))] text-black font-semibold' : 'text-white/70'}`}>
          ☾ Night Theme
        </button>
      </div>

      {/* Group switch */}
      <div className="inline-flex flex-wrap bg-white/5 border border-white/10 rounded-full p-1 mb-6 ml-3">
        {(Object.keys(GROUPS) as (keyof typeof GROUPS)[]).map((g) => (
          <button key={g} onClick={() => setSection(g as any)}
            className={`px-4 py-2 rounded-full text-xs transition ${section === g ? 'bg-white/15 text-white font-semibold' : 'text-white/60'}`}>
            {GROUPS[g].label}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-3 mb-8">
        <h3 className="font-display text-xl text-white mb-2">
          {GROUPS[section].label} — {mode === 'lightMode' ? 'Day Theme' : 'Night Theme'}
        </h3>
        {GROUPS[section].fields.map(([k, label, hint]) => {
          const val = palette[k] || '';
          const hex = val ? hslTripletToHex(val) : '';
          return (
            <div key={k} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
              <input
                type="color"
                value={hex || '#888888'}
                onChange={(e) => setPaletteField(k, hexToHslTriplet(e.target.value))}
                className="w-14 h-14 rounded-lg bg-transparent border border-white/20 cursor-pointer shrink-0"
                title="Pick color (RGB)"
              />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{label}</div>
                {hint && <div className="text-white/40 text-xs">{hint}</div>}
                <div className="text-white/30 text-[11px] font-mono mt-1">{hex || '— inherits default —'}</div>
              </div>
              {val && (
                <button onClick={() => setPaletteField(k, '')}
                  className="text-white/40 hover:text-red-300 text-xs px-3 py-1 border border-white/10 rounded"
                  title="Reset to default">Reset</button>
              )}
            </div>
          );
        })}
        <button onClick={saveTheme} className="btn-primary text-white px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2 mt-4">
          <Save size={14}/> Save {mode === 'lightMode' ? 'Day' : 'Night'} Theme
        </button>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display text-xl text-white mb-2">Typography (applies to both themes)</h3>
        {TEXT_TARGETS.map(([k, label]) => (
          <div key={k}>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">{label}</label>
            <div className="flex gap-2">
              <input value={typo[k] || ''} onChange={(e) => setTypo({ ...typo, [k]: e.target.value })}
                placeholder="'Font Name', fallback"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono" />
              <select onChange={(e) => setTypo({ ...typo, [k]: e.target.value })} value=""
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-white/70 text-xs">
                <option value="">Preset…</option>
                {FONT_PRESETS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            {typo[k] && (
              <p className="mt-2 text-white/80 text-lg" style={{ fontFamily: typo[k] }}>
                The quick brown fox — أبجد هوز
              </p>
            )}
          </div>
        ))}
        <p className="text-white/40 text-xs">
          Tip: to use Google Fonts, add the &lt;link&gt; in <code>index.html</code> first, then enter the family name here, e.g. <code>'Cairo', sans-serif</code>.
        </p>
        <button onClick={saveTypo} className="btn-primary text-white px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2 mt-2">
          <Save size={14}/> Save Typography
        </button>
      </div>
    </div>
  );
}

/* ============= Team tab ============= */
function TeamTab({ team, setTeam }: { team: TeamMember[]; setTeam: (t: TeamMember[]) => void }) {
  const [form, setForm] = useState({ username: '', password: '', display_name: '', role: 'admin' });

  async function refresh() {
    const { data } = await supabase.from('team_members').select('*').order('created_at');
    setTeam((data as TeamMember[]) || []);
  }

  async function add() {
    if (!form.username || !form.password) return toast.error('Username and password required');
    const { error } = await supabase.from('team_members').insert(form);
    if (error) return toast.error(error.message);
    toast.success('Member added');
    setForm({ username: '', password: '', display_name: '', role: 'admin' });
    refresh();
  }

  async function remove(id: string) {
    if (!confirm('Remove this team member?')) return;
    await supabase.from('team_members').delete().eq('id', id);
    refresh();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-black text-white mb-2">Team Members</h1>
      <p className="text-white/50 text-sm mb-8">Anyone here can sign in to this dashboard with their username + password.</p>

      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Add new member</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          <input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          <input placeholder="Display name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
            <option value="admin">admin</option>
            <option value="editor">editor</option>
            <option value="owner">owner</option>
          </select>
        </div>
        <button onClick={add} className="btn-primary text-white text-sm px-5 py-2 rounded-full mt-4 inline-flex items-center gap-2"><Plus size={14}/> Add member</button>
      </div>

      <div className="space-y-2">
        {team.map((m) => (
          <div key={m.id} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-semibold">{m.display_name || m.username}</p>
              <p className="text-white/40 text-xs">{m.username} · {m.role}</p>
            </div>
            <button onClick={() => remove(m.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============= Leads tab ============= */
function LeadsTab({ leads }: { leads: Lead[] }) {
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-black text-white mb-2">Contact Leads</h1>
      <p className="text-white/50 text-sm mb-8">{leads.length} {leads.length === 1 ? 'lead' : 'leads'} from the contact form.</p>
      <div className="space-y-3">
        {leads.length === 0 && <p className="text-white/40 text-sm">No leads yet.</p>}
        {leads.map((l) => (
          <div key={l.id} className="glass rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-white font-semibold">{l.name}</p>
              <p className="text-white/40 text-xs">{new Date(l.created_at).toLocaleString()}</p>
            </div>
            <p className="text-[hsl(var(--gold))] text-sm mb-2">{l.phone} {l.email && `· ${l.email}`}</p>
            <p className="text-white/70 text-sm whitespace-pre-line">{l.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
