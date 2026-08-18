import { Link, NavLink } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/story", label: "Story" },
  { to: "/about", label: "Who We Are" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-gold">
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center text-primary-foreground font-bold text-xl shadow-gold group-hover:scale-105 transition-transform">S</div>
          <span className="font-serif text-2xl tracking-[0.2em] text-foreground">STONE LIFT</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a href="tel:01554930095" className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold text-sm hover:bg-secondary transition-colors">
            <Phone className="w-4 h-4 text-primary" />
            0155 493 0095
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gold bg-background/95 backdrop-blur-xl">
          <nav className="container flex flex-col py-6 gap-4">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-foreground py-2">
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
