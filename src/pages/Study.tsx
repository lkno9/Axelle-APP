import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Square, Coffee } from "lucide-react";
import { useApp, uid } from "../lib/store";
import { todayKey, weekStart, toKey, addDays, formatMinutes, DAY_SHORT } from "../lib/dates";

const MODES = [
  { id: "25/5", focus: 25, pause: 5, label: "25 min / 5 min" },
  { id: "50/10", focus: 50, pause: 10, label: "50 min / 10 min" },
] as const;

const AMBIANCES = ["🌙 Nuit calme", "☕ Café cosy", "🌧 Pluie", "📚 Bibliothèque"];

type Phase = "idle" | "focus" | "break";

export default function Study() {
  const { sessions, setSessions } = useApp();
  const [modeId, setModeId] = useState<string>("25/5");
  const [customFocus, setCustomFocus] = useState(45);
  const [ambiance, setAmbiance] = useState(AMBIANCES[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const focusDoneRef = useRef(0); // seconds of focus completed this session

  const mode = MODES.find((m) => m.id === modeId);
  const focusMin = mode ? mode.focus : customFocus;
  const pauseMin = mode ? mode.pause : Math.max(5, Math.round(customFocus / 5));

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s > 1) {
          if (phase === "focus") focusDoneRef.current += 1;
          return s - 1;
        }
        // phase finished
        if (phase === "focus") {
          focusDoneRef.current += 1;
          setPhase("break");
          return pauseMin * 60;
        }
        setPhase("focus");
        return focusMin * 60;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase, focusMin, pauseMin]);

  function start() {
    focusDoneRef.current = 0;
    setPhase("focus");
    setSecondsLeft(focusMin * 60);
    setRunning(true);
  }

  function stop() {
    const min = Math.round(focusDoneRef.current / 60);
    if (min >= 1) {
      setSessions((prev) => [
        ...prev,
        { id: uid(), date: todayKey(), focusMin: min, mode: mode ? mode.id : `${customFocus} min` },
      ]);
    }
    setRunning(false);
    setPhase("idle");
    setSecondsLeft(0);
    focusDoneRef.current = 0;
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const total = (phase === "focus" ? focusMin : pauseMin) * 60;
  const progress = total ? 1 - secondsLeft / total : 0;

  // weekly stats
  const monday = weekStart(new Date());
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => toKey(addDays(monday, i))),
    [monday.getTime()]
  );
  const perDay = weekDays.map((k) =>
    sessions.filter((s) => s.date === k).reduce((sum, s) => sum + s.focusMin, 0)
  );
  const weekTotal = perDay.reduce((a, b) => a + b, 0);
  const maxDay = Math.max(...perDay, 1);

  const R = 88;
  const CIRC = 2 * Math.PI * R;

  return (
    <div className="space-y-5">
      {phase === "idle" ? (
        <>
          <section>
            <h3 className="section-title mb-2">Mode Pomodoro</h3>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModeId(m.id)}
                  className={`card py-3 text-center text-sm ${modeId === m.id ? "border-gold-dim/70 text-ink" : "text-ink-dim"}`}
                >
                  {m.label}
                </button>
              ))}
              <button
                onClick={() => setModeId("custom")}
                className={`card py-3 text-center text-sm ${modeId === "custom" ? "border-gold-dim/70 text-ink" : "text-ink-dim"}`}
              >
                Personnalisé
              </button>
            </div>
            {modeId === "custom" && (
              <div className="card mt-2 flex items-center gap-3">
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={customFocus}
                  onChange={(e) => setCustomFocus(Number(e.target.value))}
                  className="flex-1 accent-[#ffffff] border-none bg-transparent p-0"
                />
                <span className="text-sm text-ink w-24 text-right">
                  {customFocus} min / {pauseMin} min
                </span>
              </div>
            )}
          </section>

          <section>
            <h3 className="section-title mb-2">Ambiance</h3>
            <div className="flex gap-2 flex-wrap">
              {AMBIANCES.map((a) => (
                <button key={a} onClick={() => setAmbiance(a)} className={`chip ${ambiance === a ? "chip-on" : ""}`}>
                  {a}
                </button>
              ))}
            </div>
          </section>

          <button onClick={start} className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 text-base">
            <Play size={18} /> Lancer la session
          </button>
        </>
      ) : (
        <section className="flex flex-col items-center pt-4">
          <p className="text-sm text-ink-dim mb-1">{ambiance}</p>
          <p className={`text-xs uppercase tracking-[0.2em] mb-4 ${phase === "focus" ? "text-ink" : "text-ink-dim"}`}>
            {phase === "focus" ? "Concentration" : "Pause"}
          </p>
          <div className="relative w-56 h-56">
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
              <circle cx="100" cy="100" r={R} fill="none" stroke="#262626" strokeWidth="8" />
              <circle
                cx="100" cy="100" r={R} fill="none"
                stroke={phase === "focus" ? "#ffffff" : "#8a8a8a"}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl tabular-nums">{mm}:{ss}</span>
              <span className="text-xs text-ink-faint mt-1">
                {phase === "focus" ? `${focusMin} min de focus` : <span className="flex items-center gap-1"><Coffee size={12} /> {pauseMin} min de pause</span>}
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setRunning((r) => !r)} className="btn-gold flex items-center gap-2 px-6">
              {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Reprendre</>}
            </button>
            <button onClick={stop} className="btn-ghost flex items-center gap-2">
              <Square size={16} /> Terminer
            </button>
          </div>
        </section>
      )}

      <section className="card">
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-lg text-ink">Statistiques d'étude</h3>
          <span className="text-xs text-ink-dim">{formatMinutes(weekTotal)} cette semaine</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-24">
          {perDay.map((min, i) => {
            const d = addDays(monday, i);
            const isToday = toKey(d) === todayKey();
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end h-16">
                  <div
                    className={`w-full rounded-t ${isToday ? "bg-gold" : "bg-gold-dim/50"}`}
                    style={{ height: `${min ? Math.max(8, (min / maxDay) * 100) : 2}%` }}
                  />
                </div>
                <span className={`text-[10px] ${isToday ? "text-ink" : "text-ink-faint"}`}>
                  {DAY_SHORT[d.getDay()]}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
