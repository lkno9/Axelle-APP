import { useState } from "react";
import { Plus, Trash2, NotebookPen } from "lucide-react";
import Modal from "../components/Modal";
import { useApp, uid } from "../lib/store";
import { Hobby } from "../lib/types";
import { todayKey, weekStart, toKey, addDays, formatMinutes, fromKey } from "../lib/dates";

const EMOJIS = ["🎸", "🎨", "📖", "🏃", "🧘", "🎮", "🍳", "🌱", "📷", "♟️", "🏊", "✍️"];

export default function Hobbies() {
  const { hobbies, setHobbies } = useApp();
  const [newOpen, setNewOpen] = useState(false);
  const [logHobby, setLogHobby] = useState<Hobby | null>(null);
  const [journalHobby, setJournalHobby] = useState<Hobby | null>(null);
  const [form, setForm] = useState({ name: "", emoji: "🎸", weeklyTargetMin: 120 });
  const [log, setLog] = useState({ minutes: 30, note: "" });

  const monday = weekStart(new Date());
  const weekKeys = Array.from({ length: 7 }, (_, i) => toKey(addDays(monday, i)));

  function weekMinutes(h: Hobby): number {
    return h.entries.filter((e) => weekKeys.includes(e.date)).reduce((s, e) => s + e.minutes, 0);
  }

  function addHobby() {
    if (!form.name.trim()) return;
    setHobbies((prev) => [
      ...prev,
      { id: uid(), name: form.name.trim(), emoji: form.emoji, weeklyTargetMin: form.weeklyTargetMin, entries: [] },
    ]);
    setForm({ name: "", emoji: "🎸", weeklyTargetMin: 120 });
    setNewOpen(false);
  }

  function removeHobby(id: string) {
    setHobbies((prev) => prev.filter((h) => h.id !== id));
  }

  function addEntry() {
    if (!logHobby || log.minutes <= 0) return;
    setHobbies((prev) =>
      prev.map((h) =>
        h.id === logHobby.id
          ? { ...h, entries: [...h.entries, { id: uid(), date: todayKey(), minutes: log.minutes, note: log.note.trim() || undefined }] }
          : h
      )
    );
    setLog({ minutes: 30, note: "" });
    setLogHobby(null);
  }

  const journalCurrent = journalHobby ? hobbies.find((h) => h.id === journalHobby.id) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-dim">Cultive ce qui te fait du bien.</p>
        <button onClick={() => setNewOpen(true)} className="btn-gold flex items-center gap-1.5">
          <Plus size={16} /> Activité
        </button>
      </div>

      {hobbies.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-3xl mb-2">🌱</p>
          <p className="text-ink-dim text-sm">Aucune activité pour l'instant.</p>
          <p className="text-ink-faint text-xs mt-1">Ajoute un hobby et fixe-toi un objectif hebdomadaire.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hobbies.map((h) => {
            const done = weekMinutes(h);
            const pct = Math.min(100, Math.round((done / Math.max(h.weeklyTargetMin, 1)) * 100));
            return (
              <div key={h.id} className="card">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{h.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{h.name}</p>
                    <p className="text-xs text-ink-dim">
                      {formatMinutes(done)} / {formatMinutes(h.weeklyTargetMin)} cette semaine
                    </p>
                  </div>
                  <button onClick={() => setJournalHobby(h)} className="p-1.5 text-ink-dim" aria-label="Journal">
                    <NotebookPen size={17} />
                  </button>
                  <button onClick={() => removeHobby(h.id)} className="p-1.5 text-ink-faint" aria-label="Supprimer">
                    <Trash2 size={17} />
                  </button>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-night-line overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 100 ? "bg-ink" : "bg-gold"}`} style={{ width: `${pct}%` }} />
                </div>
                <button onClick={() => { setLogHobby(h); setLog({ minutes: 30, note: "" }); }} className="btn-ghost w-full mt-3 text-xs">
                  + Ajouter une entrée
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal title="Nouvelle activité" open={newOpen} onClose={() => setNewOpen(false)}>
        <div className="space-y-3">
          <input
            placeholder="Nom (ex : Guitare)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {EMOJIS.map((em) => (
              <button
                key={em}
                onClick={() => setForm({ ...form, emoji: em })}
                className={`text-xl p-1.5 rounded-lg border ${form.emoji === em ? "border-gold-dim bg-gold/10" : "border-night-line"}`}
              >
                {em}
              </button>
            ))}
          </div>
          <label className="text-xs text-ink-dim block space-y-1">
            <span>Objectif hebdomadaire : {formatMinutes(form.weeklyTargetMin)}</span>
            <input
              type="range" min={30} max={600} step={30}
              value={form.weeklyTargetMin}
              onChange={(e) => setForm({ ...form, weeklyTargetMin: Number(e.target.value) })}
              className="accent-[#ffffff] border-none bg-transparent p-0"
            />
          </label>
          <button onClick={addHobby} className="btn-gold w-full" disabled={!form.name.trim()}>
            Créer l'activité
          </button>
        </div>
      </Modal>

      <Modal title={logHobby ? `${logHobby.emoji} ${logHobby.name}` : ""} open={!!logHobby} onClose={() => setLogHobby(null)}>
        <div className="space-y-3">
          <label className="text-xs text-ink-dim block space-y-1">
            <span>Temps passé aujourd'hui : {formatMinutes(log.minutes)}</span>
            <input
              type="range" min={5} max={240} step={5}
              value={log.minutes}
              onChange={(e) => setLog({ ...log, minutes: Number(e.target.value) })}
              className="accent-[#ffffff] border-none bg-transparent p-0"
            />
          </label>
          <textarea
            placeholder="Note de progression (optionnel)"
            rows={2}
            value={log.note}
            onChange={(e) => setLog({ ...log, note: e.target.value })}
          />
          <button onClick={addEntry} className="btn-gold w-full">Enregistrer</button>
        </div>
      </Modal>

      <Modal
        title={journalCurrent ? `Journal — ${journalCurrent.name}` : ""}
        open={!!journalCurrent}
        onClose={() => setJournalHobby(null)}
      >
        {journalCurrent && journalCurrent.entries.length === 0 ? (
          <p className="text-sm text-ink-dim text-center py-4">Aucune entrée pour l'instant.</p>
        ) : (
          <div className="space-y-2">
            {journalCurrent &&
              [...journalCurrent.entries].reverse().map((e) => {
                const d = fromKey(e.date);
                return (
                  <div key={e.id} className="border border-night-line rounded-xl p-3">
                    <div className="flex justify-between text-xs text-ink-dim">
                      <span>{d.getDate()}/{d.getMonth() + 1}/{d.getFullYear()}</span>
                      <span className="text-ink">{formatMinutes(e.minutes)}</span>
                    </div>
                    {e.note && <p className="text-sm mt-1">{e.note}</p>}
                  </div>
                );
              })}
          </div>
        )}
      </Modal>
    </div>
  );
}
