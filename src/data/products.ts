export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: { en: string; ar: string };
  tagline: { en: string; ar: string };
  desc: { en: string; ar: string };
  image: string;
  tag: 'Home' | 'Commercial' | 'Accessibility';
  accent: 'gold' | 'red';
  features: { en: string[]; ar: string[] };
  specs: { label: { en: string; ar: string }; value: string }[];
  videoUrl?: string;
}

export const defaultProducts: Product[] = [
  {
    id: 'st-home-4000', slug: 'st-home-4000', name: 'ST-HOME 4000',
    subtitle: { en: 'Platform Lifts', ar: 'مصاعد منصة' },
    tagline: { en: 'Your elevator is not just a means of transportation; it is a work of art in your home.', ar: 'مصعدك مش مجرد وسيلة انتقال، هو تحفة فنية في بيتك' },
    desc: { en: 'Every detail matters at Stone Lift. From buttons to lighting, everything is designed with care. Quality is not in size — quality is in the details.', ar: 'في STONE LIFT كل تفصيلة مهمة. من الأزرار لحد الإضاءة، كل حاجة مصممة بعناية. الجودة مش في الحجم — الجودة في التفاصيل.' },
    image: 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/profile-1.pdf_5_gvwigg',
    tag: 'Home', accent: 'gold',
    features: {
      en: ['Hand-finished interior panels', 'Whisper-silent operation < 45 dB', 'Smart LED ambient lighting', 'Premium Italian buttons & fixtures', 'Anti-vibration suspension'],
      ar: ['ألواح داخلية يدوية الصنع', 'تشغيل هادئ < 45 ديسيبل', 'إضاءة LED ذكية', 'أزرار وتجهيزات إيطالية فاخرة', 'تعليق مضاد للاهتزاز'],
    },
    specs: [
      { label: { en: 'Capacity', ar: 'السعة' }, value: '450 kg' },
      { label: { en: 'Speed', ar: 'السرعة' }, value: '0.4 m/s' },
      { label: { en: 'Stops', ar: 'المحطات' }, value: 'Up to 6' },
      { label: { en: 'Travel', ar: 'الارتفاع' }, value: '15 m' },
    ],
  },
  {
    id: 'st-home-core', slug: 'st-home-core-3000', name: 'ST-HOME CORE 3000',
    subtitle: { en: 'Cabin Lift', ar: 'مصعد كابينة' },
    tagline: { en: 'Luxury does not need space — it needs taste', ar: 'الفخامة مش بتحتاج مساحة، بتحتاج ذوق' },
    desc: { en: 'Small space is not a lack of comfort. The cabin is smartly designed — soft lighting and smooth movement. Every moment feels comfortable and safe.', ar: 'المساحة الصغيرة مش قلة راحة. الكابينة مصممة بذكاء، الإضاءة ناعمة والحركة سلسة.' },
    image: 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/profile-1.pdf_4_djw99w',
    tag: 'Home', accent: 'gold',
    features: {
      en: ['Compact 800×1000 footprint', 'Mirrored cabin walls', 'Touch-control panel', 'Energy-efficient gearless drive', 'Auto-rescue device'],
      ar: ['مساحة صغيرة 800×1000', 'جدران مرآة', 'لوحة تحكم باللمس', 'موتور بدون تروس موفر للطاقة', 'جهاز إنقاذ تلقائي'],
    },
    specs: [
      { label: { en: 'Capacity', ar: 'السعة' }, value: '320 kg' },
      { label: { en: 'Speed', ar: 'السرعة' }, value: '0.5 m/s' },
      { label: { en: 'Stops', ar: 'المحطات' }, value: 'Up to 5' },
      { label: { en: 'Travel', ar: 'الارتفاع' }, value: '12 m' },
    ],
  },
  {
    id: 'st-air-100', slug: 'st-air-100', name: 'ST-AIR 100',
    subtitle: { en: 'Cabin Lift', ar: 'مصعد كابينة' },
    tagline: { en: 'Quality at a reasonable price — this is not a dream, this is Stone Lift', ar: 'جودة بسعر معقول — مش حلم، ده Stone Lift' },
    desc: { en: 'Not just one elevator — a comprehensive solution for all your needs. Hospital? School? Mall? It suits everyone. Flexible, powerful, reliable.', ar: 'مش مصعد واحد، هو حل شامل لكل احتياجاتك. مستشفى؟ مدرسة؟ مركز تجاري؟ بيناسب الكل.' },
    image: 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/profile-1.pdf_3_dzbth0',
    tag: 'Commercial', accent: 'red',
    features: {
      en: ['Heavy-duty steel frame', 'Modular configurations', 'High-traffic durability', 'Emergency intercom system', 'Compliant with EN 81-20/50'],
      ar: ['هيكل حديد ثقيل', 'تركيبات معيارية', 'متين للحركة الكثيفة', 'نظام اتصال للطوارئ', 'مطابق لمعايير EN 81-20/50'],
    },
    specs: [
      { label: { en: 'Capacity', ar: 'السعة' }, value: '1000 kg' },
      { label: { en: 'Speed', ar: 'السرعة' }, value: '1.0 m/s' },
      { label: { en: 'Stops', ar: 'المحطات' }, value: 'Up to 16' },
      { label: { en: 'Travel', ar: 'الارتفاع' }, value: '50 m' },
    ],
  },
  {
    id: 'st-air-200', slug: 'st-air-200', name: 'ST-AIR 200',
    subtitle: { en: 'Platform Lifts', ar: 'مصاعد منصة' },
    tagline: { en: 'Intelligence in design — power in performance', ar: 'ذكاء في التصميم، قوة في الأداء' },
    desc: { en: 'Safety first. Always. The ST-AIR 200 is designed to the highest safety standards. Every detail, every movement — monitored with care.', ar: 'الأمان أولاً، دائماً. ST-AIR 200 مصمم بأعلى معايير الأمان.' },
    image: 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/profile-1.pdf_1_d3zjkr',
    tag: 'Commercial', accent: 'red',
    features: {
      en: ['Real-time diagnostics', 'Triple safety brakes', 'Variable frequency drive', 'Fire-rated construction', 'Predictive maintenance ready'],
      ar: ['تشخيص فوري', 'ثلاثة أنظمة فرامل', 'موتور متغير التردد', 'مقاوم للحريق', 'صيانة تنبؤية'],
    },
    specs: [
      { label: { en: 'Capacity', ar: 'السعة' }, value: '1600 kg' },
      { label: { en: 'Speed', ar: 'السرعة' }, value: '1.6 m/s' },
      { label: { en: 'Stops', ar: 'المحطات' }, value: 'Up to 24' },
      { label: { en: 'Travel', ar: 'الارتفاع' }, value: '80 m' },
    ],
  },
  {
    id: 'stc-5000', slug: 'stc-5000-core', name: 'STC 5000 CORE',
    subtitle: { en: 'Disabled Lifts', ar: 'مصاعد لذوي الاحتياجات' },
    tagline: { en: 'Everyone deserves access. Everyone deserves comfort.', ar: 'كل شخص يستحق الوصول، كل شخص يستحق الراحة' },
    desc: { en: 'Not just an elevator — a message. A message that every person deserves access, every person deserves comfort, every person deserves dignity. Inclusion is not an option — inclusion is a right.', ar: 'مش مصعد عادي، هي رسالة. كل شخص يستحق الوصول، كل شخص يستحق الراحة، كل شخص يستحق الكرامة.' },
    image: 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/profile-1.pdf_6_tlmxak',
    tag: 'Accessibility', accent: 'gold',
    features: {
      en: ['Wheelchair-accessible platform', 'Low-step entry', 'Large tactile buttons', 'Audio announcements', 'Emergency call button at low height'],
      ar: ['منصة لكرسي متحرك', 'مدخل منخفض', 'أزرار كبيرة باللمس', 'تنبيهات صوتية', 'زر طوارئ في ارتفاع منخفض'],
    },
    specs: [
      { label: { en: 'Capacity', ar: 'السعة' }, value: '500 kg' },
      { label: { en: 'Speed', ar: 'السرعة' }, value: '0.15 m/s' },
      { label: { en: 'Travel', ar: 'الارتفاع' }, value: '6 m' },
      { label: { en: 'Platform', ar: 'المنصة' }, value: '900×1400' },
    ],
  },
  {
    id: 'dumbwaiter', slug: 'dumbwaiter', name: 'Dumbwaiter',
    subtitle: { en: 'Food Elevator', ar: 'مصعد طعام' },
    tagline: { en: 'Luxury delivered to your fingertips', ar: 'الفخامة في متناول يدك' },
    desc: { en: 'Designed to transfer your meals from kitchen to dining in seconds. With smooth, quiet movement and an appearance that matches the luxury of your home.', ar: 'مصمم علشان ينقل وجباتك من المطبخ إلى السفرة في ثواني. بحركة سلسة، هادية، ومظهر يناسب فخامة بيتك.' },
    image: 'https://res.cloudinary.com/dvvdplu18/image/upload/f_auto,q_auto/profile-1.pdf_rytgcf',
    tag: 'Home', accent: 'gold',
    features: {
      en: ['Stainless steel cabin', 'Whisper-quiet operation', 'Compact shaft footprint', 'Auto-leveling', 'Easy maintenance access'],
      ar: ['كابينة استانلس ستيل', 'تشغيل هادي تماماً', 'مساحة بئر صغيرة', 'تسوية تلقائية', 'سهولة في الصيانة'],
    },
    specs: [
      { label: { en: 'Capacity', ar: 'السعة' }, value: '100 kg' },
      { label: { en: 'Speed', ar: 'السرعة' }, value: '0.4 m/s' },
      { label: { en: 'Stops', ar: 'المحطات' }, value: 'Up to 4' },
      { label: { en: 'Cabin', ar: 'الكابينة' }, value: '600×600' },
    ],
  },
];

const STORAGE_KEY = 'sl_products';

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultProducts;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function resetProducts() { localStorage.removeItem(STORAGE_KEY); }
