import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { Home, CalendarDays, Sparkles, BookOpen, Leaf, User, Settings } from "lucide-react";

const TABS = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/motivation", label: "Motivation", icon: Sparkles },
  { to: "/study", label: "Study", icon: BookOpen },
  { to: "/hobbies", label: "Hobbies", icon: Leaf },
];

const TITLES: Record<string, string> = {
  "/": "KAIROS",
  "/agenda": "Agenda",
  "/motivation": "Motivation",
  "/study": "Study with me",
  "/hobbies": "Hobbies",
  "/profil": "Profil",
  "/parametres": "Paramètres",
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "KAIROS";

  return (
    <div className="mx-auto max-w-md min-h-dvh flex flex-col">
      <header className="sticky top-0 z-20 bg-night/85 backdrop-blur border-b border-night-line px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 flex items-center justify-between">
        <h1 className="font-serif text-2xl tracking-wide text-gold-soft">
          {title === "KAIROS" ? (
            <span className="tracking-[0.25em]">KAIROS</span>
          ) : (
            title
          )}
        </h1>
        <div className="flex items-center gap-1">
          <Link
            to="/profil"
            className={`p-2 rounded-full ${pathname === "/profil" ? "text-gold-soft" : "text-ink-dim"}`}
            aria-label="Profil"
          >
            <User size={20} />
          </Link>
          <Link
            to="/parametres"
            className={`p-2 rounded-full ${pathname === "/parametres" ? "text-gold-soft" : "text-ink-dim"}`}
            aria-label="Paramètres"
          >
            <Settings size={20} />
          </Link>
        </div>
      </header>

      <main className="flex-1 px-5 py-5 pb-28">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-20 bg-night/90 backdrop-blur border-t border-night-line">
        <div className="mx-auto max-w-md grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {TABS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] ${
                  isActive ? "text-gold-soft" : "text-ink-faint"
                }`
              }
            >
              <Icon size={21} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
