import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, Wand2, CheckCircle2, Circle, AlertTriangle, CalendarCheck } from "lucide-react";
import Modal from "../components/Modal";
import { useApp, uid } from "../lib/store";
import { EventCategory, CATEGORY_META, Task } from "../lib/types";
import { generatePlan, PlanResult } from "../lib/planner";
import { todayKey, toKey, addDays, fromKey, formatMinutes, DAY_NAMES, MONTH_NAMES } from "../lib/dates";

export default function Planifier() {
  const { tasks, setTasks, events, setEvents, planner, setPlanner } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    deadline: toKey(addDays(new Date(), 7)),
    estimatedMin: 120,
    category: "etude" as EventCategory,
  });
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [added, setAdded] = useState(false);

  const today = todayKey();
  const activeTasks = useMemo(
    () => tasks.filter((t) => t.deadline >= today).sort((a, b) => a.deadline.localeCompare(b.deadline)),
    [tasks, today]
  );

  function addTask() {
    if (!form.title.trim() || !form.deadline) return;
    setTasks((prev) => [
      ...prev,
      { id: uid(), title: form.title.trim(), deadline: form.deadline, estimatedMin: form.estimatedMin, category: form.category, done: false },
    ]);
    setForm({ ...form, title: "" });
    setOpen(false);
    setPlan(null);
  }

  function toggleDone(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    setPlan(null);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setEvents((prev) => prev.filter((e) => !(e.taskId === id && e.date >= today)));
    setPlan(null);
  }

  function generate() {
    const activeIds = new Set(tasks.filter((t) => !t.done).map((t) => t.id));
    // on ignore les anciennes séances planifiées : elles seront remplacées
    const fixedEvents = events.filter((e) => !(e.taskId && activeIds.has(e.taskId) && e.date >= today));
    setPlan(generatePlan(tasks, fixedEvents, planner));
    setAdded(false);
  }

  function addToAgenda() {
    if (!plan) return;
    const plannedIds = new Set(plan.blocks.map((b) => b.taskId));
    setEvents((prev) => [
      ...prev.filter((e) => !(e.taskId && plannedIds.has(e.taskId) && e.date >= today)),
      ...plan.blocks.map((b) => ({
        id: uid(),
        title: b.title,
        date: b.date,
        start: b.start,
        end: b.end,
        category: b.category,
        note: "Séance planifiée ✨",
        taskId: b.taskId,
      })),
    ]);
    setAdded(true);
  }

  const byDay = useMemo(() => {
    if (!plan) return [];
    const map = new Map<string, typeof plan.blocks>();
    plan.blocks.forEach((b) => {
      map.set(b.date, [...(map.get(b.date) ?? []), b]);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [plan]);

  function deadlineLabel(t: Task): string {
    const d = fromKey(t.deadline);
    const days = Math.round((d.getTime() - fromKey(today).getTime()) / 86_400_000);
    const when = days === 0 ? "aujourd'hui" : days === 1 ? "demain" : `J-${days}`;
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} · ${when}`;
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-dim">
        Donne tes échéances et ce qu'il te reste à faire : KAIROS répartit des séances
        de travail dans tes créneaux libres pour que tout soit prêt <span className="text-ink">la veille</span>.
      </p>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="section-title">Échéances & tâches</h3>
          <button onClick={() => setOpen(true)} className="btn-gold flex items-center gap-1.5">
            <Plus size={16} /> Tâche
          </button>
        </div>
        {activeTasks.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-ink-dim text-sm">Aucune tâche à venir.</p>
            <p className="text-ink-faint text-xs mt-1">Ex : « Contrôle de maths — 3 h de révisions pour le 24 ».</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activeTasks.map((t) => (
              <div key={t.id} className={`card py-3 flex items-center gap-3 ${t.done ? "opacity-50" : ""}`}>
                <button onClick={() => toggleDone(t.id)} className={t.done ? "text-ink" : "text-ink-faint"} aria-label="Fait">
                  {t.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_META[t.category].dot}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${t.done ? "line-through" : ""}`}>{t.title}</p>
                  <p className="text-xs text-ink-dim">
                    {formatMinutes(t.estimatedMin)} de travail · échéance {deadlineLabel(t)}
                  </p>
                </div>
                <button onClick={() => removeTask(t.id)} className="p-1.5 text-ink-faint" aria-label="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg text-ink">Mes disponibilités</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-ink-dim space-y-1">
            <span>Semaine — de</span>
            <input type="time" value={planner.weekdayStart} onChange={(e) => setPlanner({ ...planner, weekdayStart: e.target.value })} />
          </label>
          <label className="text-xs text-ink-dim space-y-1">
            <span>à</span>
            <input type="time" value={planner.weekdayEnd} onChange={(e) => setPlanner({ ...planner, weekdayEnd: e.target.value })} />
          </label>
          <label className="text-xs text-ink-dim space-y-1">
            <span>Week-end — de</span>
            <input type="time" value={planner.weekendStart} onChange={(e) => setPlanner({ ...planner, weekendStart: e.target.value })} />
          </label>
          <label className="text-xs text-ink-dim space-y-1">
            <span>à</span>
            <input type="time" value={planner.weekendEnd} onChange={(e) => setPlanner({ ...planner, weekendEnd: e.target.value })} />
          </label>
        </div>
        <label className="text-xs text-ink-dim block space-y-1">
          <span>Maximum par jour : {formatMinutes(planner.maxDailyMin)}</span>
          <input
            type="range" min={60} max={480} step={30}
            value={planner.maxDailyMin}
            onChange={(e) => setPlanner({ ...planner, maxDailyMin: Number(e.target.value) })}
            className="accent-[#ffffff] border-none bg-transparent p-0"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-dim">Durée d'une séance :</span>
          {[25, 50].map((b) => (
            <button key={b} onClick={() => setPlanner({ ...planner, blockMin: b })} className={`chip ${planner.blockMin === b ? "chip-on" : ""}`}>
              {b} min
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={generate}
        disabled={activeTasks.filter((t) => !t.done).length === 0}
        className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 text-base disabled:opacity-40"
      >
        <Wand2 size={18} /> Organiser ma semaine
      </button>

      {plan && (
        <section className="space-y-3">
          {plan.unplaced.length > 0 && (
            <div className="card border-ink/40 flex gap-3">
              <AlertTriangle size={18} className="text-ink shrink-0 mt-0.5" />
              <div className="text-xs text-ink-dim space-y-1">
                {plan.unplaced.map(({ task, missingMin }) => (
                  <p key={task.id}>
                    Il manque <span className="text-ink">{formatMinutes(missingMin)}</span> pour
                    « {task.title} » avant son échéance — élargis tes disponibilités ou réduis l'estimation.
                  </p>
                ))}
              </div>
            </div>
          )}

          {plan.blocks.length === 0 ? (
            <div className="card text-center py-6">
              <p className="text-ink-dim text-sm">Aucun créneau à proposer.</p>
            </div>
          ) : (
            <>
              <h3 className="section-title">Proposition</h3>
              {byDay.map(([date, dayBlocks]) => {
                const d = fromKey(date);
                return (
                  <div key={date} className="card py-3">
                    <p className="text-xs text-ink capitalize mb-2">
                      {DAY_NAMES[d.getDay()]} {d.getDate()} {MONTH_NAMES[d.getMonth()]}
                      {date === today ? " — aujourd'hui" : ""}
                    </p>
                    <div className="space-y-1.5">
                      {dayBlocks.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_META[b.category].dot}`} />
                          <span className="text-ink-dim text-xs tabular-nums">{b.start}–{b.end}</span>
                          <span className="truncate">{b.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {added ? (
                <Link to="/agenda" className="btn-ghost w-full flex items-center justify-center gap-2 text-ink border-night-line">
                  <CalendarCheck size={17} /> Ajouté ! Voir l'agenda
                </Link>
              ) : (
                <button onClick={addToAgenda} className="btn-gold w-full flex items-center justify-center gap-2">
                  <CalendarCheck size={17} /> Ajouter ces {plan.blocks.length} séances à l'agenda
                </button>
              )}
            </>
          )}
        </section>
      )}

      <Modal title="Nouvelle tâche" open={open} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <input
            placeholder="Titre (ex : Réviser le contrôle d'histoire)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <label className="text-xs text-ink-dim block space-y-1">
            <span>Échéance (date limite)</span>
            <input
              type="date"
              min={today}
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </label>
          <label className="text-xs text-ink-dim block space-y-1">
            <span>Travail estimé : {formatMinutes(form.estimatedMin)}</span>
            <input
              type="range" min={30} max={600} step={30}
              value={form.estimatedMin}
              onChange={(e) => setForm({ ...form, estimatedMin: Number(e.target.value) })}
              className="accent-[#ffffff] border-none bg-transparent p-0"
            />
          </label>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(CATEGORY_META) as EventCategory[]).map((c) => (
              <button key={c} onClick={() => setForm({ ...form, category: c })} className={`chip ${form.category === c ? "chip-on" : ""}`}>
                {CATEGORY_META[c].label}
              </button>
            ))}
          </div>
          <button onClick={addTask} className="btn-gold w-full" disabled={!form.title.trim()}>
            Ajouter la tâche
          </button>
        </div>
      </Modal>
    </div>
  );
}
