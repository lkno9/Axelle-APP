import { useState } from "react";
import { useApp } from "../lib/store";
import { formatMinutes } from "../lib/dates";

const AVATARS = ["🌟", "🌙", "🔥", "🌊", "🦁", "🌱", "⚡", "🗻"];

export default function Profil() {
  const { profile, setProfile, events, sessions, hobbies, favorites } = useApp();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  const totalFocus = sessions.reduce((s, x) => s + x.focusMin, 0);

  function save() {
    setProfile({ ...draft, name: draft.name.trim(), goal: draft.goal.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div className="card text-center py-6">
        <span className="text-5xl">{draft.emoji}</span>
        <h2 className="text-2xl mt-2">{profile.name || "Voyageur du temps"}</h2>
        {profile.goal && <p className="text-sm text-ink-dim italic mt-1">« {profile.goal} »</p>}
      </div>

      <section className="grid grid-cols-2 gap-3">
        <div className="card text-center py-4">
          <p className="text-2xl text-ink">{formatMinutes(totalFocus)}</p>
          <p className="text-xs text-ink-dim mt-1">de concentration au total</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl text-ink">{events.length}</p>
          <p className="text-xs text-ink-dim mt-1">événements planifiés</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl text-ink">{hobbies.length}</p>
          <p className="text-xs text-ink-dim mt-1">activités cultivées</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-2xl text-ink">{favorites.length}</p>
          <p className="text-xs text-ink-dim mt-1">citations favorites</p>
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="text-lg text-ink">Modifier le profil</h3>
        <input
          placeholder="Ton prénom"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <input
          placeholder="Ton objectif du moment (ex : Réussir mes examens)"
          value={draft.goal}
          onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
        />
        <div className="flex gap-2 flex-wrap">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setDraft({ ...draft, emoji: a })}
              className={`text-xl p-1.5 rounded-lg border ${draft.emoji === a ? "border-gold-dim bg-gold/10" : "border-night-line"}`}
            >
              {a}
            </button>
          ))}
        </div>
        <button onClick={save} className="btn-gold w-full">
          {saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </section>
    </div>
  );
}
