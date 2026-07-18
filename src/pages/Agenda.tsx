import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, ChevronLeft, ChevronRight, Trash2, Pencil, Wand2 } from "lucide-react";
import Modal from "../components/Modal";
import { useApp, uid } from "../lib/store";
import { AgendaEvent, EventCategory, CATEGORY_META } from "../lib/types";
import {
  weekStart, addDays, toKey, todayKey, DAY_SHORT, DAY_NAMES, MONTH_NAMES, fromKey,
} from "../lib/dates";

const EMPTY_FORM = { title: "", start: "09:00", end: "10:00", category: "etude" as EventCategory, note: "" };

export default function Agenda() {
  const { events, setEvents } = useApp();
  const [params, setParams] = useSearchParams();
  const [anchor, setAnchor] = useState(() => new Date());
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [editing, setEditing] = useState<AgendaEvent | null>(null);
  const [open, setOpen] = useState(() => params.get("new") === "1");
  const [form, setForm] = useState(EMPTY_FORM);

  const monday = weekStart(anchor);
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(monday, i)),
    [monday.getTime()]
  );

  const dayEvents = events
    .filter((e) => e.date === selectedKey)
    .sort((a, b) => a.start.localeCompare(b.start));

  const selected = fromKey(selectedKey);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(e: AgendaEvent) {
    setEditing(e);
    setForm({ title: e.title, start: e.start, end: e.end, category: e.category, note: e.note ?? "" });
    setOpen(true);
  }

  function close() {
    setOpen(false);
    if (params.get("new")) setParams({}, { replace: true });
  }

  function save() {
    if (!form.title.trim()) return;
    if (editing) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...form, title: form.title.trim() } : e))
      );
    } else {
      setEvents((prev) => [
        ...prev,
        { id: uid(), date: selectedKey, ...form, title: form.title.trim() },
      ]);
    }
    close();
  }

  function remove(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const countByKey = useMemo(() => {
    const m = new Map<string, number>();
    events.forEach((e) => m.set(e.date, (m.get(e.date) ?? 0) + 1));
    return m;
  }, [events]);

  return (
    <div className="space-y-5">
      <Link to="/planifier" className="btn-ghost w-full flex items-center justify-center gap-2 text-gold-soft border-gold-dim/40">
        <Wand2 size={16} /> Organiser ma semaine
      </Link>

      <div className="flex items-center justify-between">
        <button className="p-2 text-ink-dim" onClick={() => setAnchor(addDays(monday, -7))} aria-label="Semaine précédente">
          <ChevronLeft size={20} />
        </button>
        <p className="text-sm text-ink-dim capitalize">
          {MONTH_NAMES[monday.getMonth()]} {monday.getFullYear()}
        </p>
        <button className="p-2 text-ink-dim" onClick={() => setAnchor(addDays(monday, 7))} aria-label="Semaine suivante">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const key = toKey(d);
          const isSel = key === selectedKey;
          const isToday = key === todayKey();
          return (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`rounded-xl py-2 flex flex-col items-center gap-0.5 border transition-colors ${
                isSel
                  ? "bg-gold text-night border-gold font-semibold"
                  : isToday
                    ? "border-gold-dim/60 text-gold-soft"
                    : "border-night-line text-ink-dim"
              }`}
            >
              <span className="text-[10px] uppercase">{DAY_SHORT[d.getDay()]}</span>
              <span className="text-sm">{d.getDate()}</span>
              <span className={`w-1 h-1 rounded-full ${countByKey.get(key) ? (isSel ? "bg-night" : "bg-gold") : "bg-transparent"}`} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="section-title capitalize">
          {DAY_NAMES[selected.getDay()]} {selected.getDate()}
        </h3>
        <button onClick={openNew} className="btn-gold flex items-center gap-1.5">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {dayEvents.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-ink-dim text-sm">Rien de prévu ce jour.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {dayEvents.map((e) => (
            <div key={e.id} className="card py-3 flex items-start gap-3">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${CATEGORY_META[e.category].dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{e.title}</p>
                <p className="text-xs text-ink-dim">
                  {e.start} – {e.end} · {CATEGORY_META[e.category].label}
                </p>
                {e.note && <p className="text-xs text-ink-faint mt-1">{e.note}</p>}
              </div>
              <button onClick={() => openEdit(e)} className="p-1.5 text-ink-dim" aria-label="Modifier">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(e.id)} className="p-1.5 text-ink-faint" aria-label="Supprimer">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal title={editing ? "Modifier l'événement" : "Nouvel événement"} open={open} onClose={close}>
        <div className="space-y-3">
          <input
            placeholder="Titre (ex : Réviser les maths)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-ink-dim space-y-1">
              <span>Début</span>
              <input type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            </label>
            <label className="text-xs text-ink-dim space-y-1">
              <span>Fin</span>
              <input type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            </label>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(CATEGORY_META) as EventCategory[]).map((c) => (
              <button
                key={c}
                onClick={() => setForm({ ...form, category: c })}
                className={`chip ${form.category === c ? "chip-on" : ""}`}
              >
                {CATEGORY_META[c].label}
              </button>
            ))}
          </div>
          <textarea
            placeholder="Note (optionnel)"
            rows={2}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <button onClick={save} className="btn-gold w-full" disabled={!form.title.trim()}>
            {editing ? "Enregistrer" : "Ajouter à l'agenda"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
