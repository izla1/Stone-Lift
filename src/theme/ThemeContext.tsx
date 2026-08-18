import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Mode = 'dark' | 'light';
const Ctx = createContext<{ mode: Mode; toggle: () => void; setMode: (m: Mode) => void }>({
  mode: 'dark', toggle: () => {}, setMode: () => {},
});

export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('sl-theme') as Mode) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.setAttribute('data-theme', mode);
    localStorage.setItem('sl-theme', mode);
  }, [mode]);

  return <Ctx.Provider value={{ mode, setMode, toggle: () => setMode(mode === 'dark' ? 'light' : 'dark') }}>{children}</Ctx.Provider>;
}
