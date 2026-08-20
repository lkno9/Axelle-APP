import { useMemo, useState } from "react";
import { Heart, Shuffle } from "lucide-react";
import { useApp } from "../lib/store";
import { QUOTES, THEMES } from "../data/quotes";

export default function Motivation() {
  const { favorites, setFavorites } = useApp();
  const [theme, setTheme] = useState<string>("all");
  const [seed, setSeed] = useState(0);

  const pool = useMemo(() => {
    if (theme === "favs") return QUOTES.filter((q) => favorites.includes(q.id));
    if (theme === "all") return QUOTES;
    return QUOTES.filter((q) => q.theme === theme);
  }, [theme, favorites]);

  const shuffled = useMemo(() => {
    const arr = [...pool];
    // simple seeded shuffle so the "mélanger" button re-orders
    let s = seed + 1;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return seed === 0 ? pool : arr;
  }, [pool, seed]);

  function toggleFav(id: string) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-dim">
        Des mots pour les jours où la volonté vacille.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
        <button className={`chip ${theme === "all" ? "chip-on" : ""}`} onClick={() => setTheme("all")}>
          Tout
        </button>
        {THEMES.map((t) => (
          <button
            key={t.id}
            className={`chip ${theme === t.id ? "chip-on" : ""}`}
            onClick={() => setTheme(t.id)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
        <button className={`chip ${theme === "favs" ? "chip-on" : ""}`} onClick={() => setTheme("favs")}>
          ♥ Favoris
        </button>
      </div>

      <button onClick={() => setSeed((s) => s + 1)} className="btn-ghost w-full flex items-center justify-center gap-2">
        <Shuffle size={16} /> Mélanger
      </button>

      {shuffled.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-ink-dim text-sm">Aucun favori pour l'instant.</p>
          <p className="text-ink-faint text-xs mt-1">Touche le cœur d'une citation pour la garder ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shuffled.map((q) => {
            const fav = favorites.includes(q.id);
            const themeMeta = THEMES.find((t) => t.id === q.theme);
            return (
              <div key={q.id} className="card">
                <p className="italic text-lg leading-snug">« {q.text} »</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-ink-dim">
                    — {q.author} · <span className="text-ink-faint">{themeMeta?.label}</span>
                  </p>
                  <button
                    onClick={() => toggleFav(q.id)}
                    className={fav ? "text-ink" : "text-ink-faint"}
                    aria-label="Favori"
                  >
                    <Heart size={18} fill={fav ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
