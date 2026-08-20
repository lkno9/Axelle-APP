import { Link } from "react-router-dom";
import { CalendarPlus, Timer, Sparkles, ChevronRight, Clock, Wand2 } from "lucide-react";
import { useApp } from "../lib/store";
import { todayKey, formatLong, formatMinutes, weekStart, toKey, addDays } from "../lib/dates";
import { CATEGORY_META } from "../lib/types";
import { QUOTES } from "../data/quotes";

export default function Dashboard() {
  const { events, profile, sessions, settings } = useApp();
  const now = new Date();
  const today = todayKey();

  const greeting = now.getHours() < 5 ? "Bonne nuit" : now.getHours() < 18 ? "Bonjour" : "Bonsoir";

  const todayEvents = events
    .filter((e) => e.date === today)
    .sort((a, b) => a.start.localeCompare(b.start));

  const nowHM = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const nextEvent = todayEvents.find((e) => e.end > nowHM);

  // quote of the day: deterministic per day
  const dayIndex = Math.floor(now.getTime() / 86_400_000);
  const quote = QUOTES[dayIndex % QUOTES.length];

  // study minutes this week
  const monday = weekStart(now);
  const weekKeys = Array.from({ length: 7 }, (_, i) => toKey(addDays(monday, i)));
  const weekFocus = sessions
    .filter((s) => weekKeys.includes(s.date))
    .reduce((sum, s) => sum + s.focusMin, 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-ink-dim text-sm capitalize">{formatLong(now)}</p>
        <h2 className="text-3xl mt-1">
          {greeting}
          {profile.name ? ` ${profile.name}` : ""} <span className="text-ink">✦</span>
        </h2>
      </div>

      {settings.showQuoteOnHome && (
        <div className="card border-gold-dim/40">
          <p className="italic text-lg leading-snug">« {quote.text} »</p>
          <p className="text-right text-xs text-ink mt-2">— {quote.author}</p>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="section-title">Aujourd'hui</h3>
          <Link to="/agenda" className="text-xs text-ink flex items-center">
            Agenda <ChevronRight size={14} />
          </Link>
        </div>
        {todayEvents.length === 0 ? (
          <div className="card text-center py-6">
            <p className="text-ink-dim text-sm">Aucun événement aujourd'hui.</p>
            <p className="text-ink-faint text-xs mt-1">Une journée libre à sculpter.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayEvents.map((e) => {
              const isNext = nextEvent?.id === e.id;
              const past = e.end <= nowHM;
              return (
                <div
                  key={e.id}
                  className={`card flex items-center gap-3 py-3 ${
                    isNext ? "border-gold-dim/60" : ""
                  } ${past ? "opacity-50" : ""}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_META[e.category].dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.title}</p>
                    <p className="text-xs text-ink-dim flex items-center gap-1">
                      <Clock size={12} /> {e.start} – {e.end}
                    </p>
                  </div>
                  {isNext && <span className="text-[10px] text-ink border border-gold-dim/50 rounded-full px-2 py-0.5">à suivre</span>}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h3 className="section-title mb-2">Accès rapide</h3>
        <div className="grid grid-cols-4 gap-2">
          <Link to="/agenda?new=1" className="card flex flex-col items-center gap-2 py-4 text-center px-1">
            <CalendarPlus size={22} className="text-ink" />
            <span className="text-xs text-ink-dim">Événement</span>
          </Link>
          <Link to="/planifier" className="card flex flex-col items-center gap-2 py-4 text-center px-1">
            <Wand2 size={22} className="text-ink" />
            <span className="text-xs text-ink-dim">Semaine</span>
          </Link>
          <Link to="/study" className="card flex flex-col items-center gap-2 py-4 text-center px-1">
            <Timer size={22} className="text-ink" />
            <span className="text-xs text-ink-dim">Pomodoro</span>
          </Link>
          <Link to="/motivation" className="card flex flex-col items-center gap-2 py-4 text-center px-1">
            <Sparkles size={22} className="text-ink" />
            <span className="text-xs text-ink-dim">Motivation</span>
          </Link>
        </div>
      </section>

      <section className="card flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-dim">Temps d'étude cette semaine</p>
          <p className="text-2xl text-ink mt-0.5">{formatMinutes(weekFocus)}</p>
        </div>
        <Link to="/study" className="btn-ghost text-xs">Étudier</Link>
      </section>
    </div>
  );
}
