import { useState } from "react";
import { useApp } from "../lib/store";

export default function Parametres() {
  const { settings, setSettings, resetAll } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-4">
      <section className="card space-y-4">
        <h3 className="font-serif text-lg text-gold-soft">Préférences</h3>
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm">Citation du jour sur l'accueil</span>
          <button
            onClick={() => setSettings({ ...settings, showQuoteOnHome: !settings.showQuoteOnHome })}
            className={`w-11 h-6 rounded-full transition-colors relative ${settings.showQuoteOnHome ? "bg-gold" : "bg-night-line"}`}
            role="switch"
            aria-checked={settings.showQuoteOnHome}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-night-soft transition-all ${settings.showQuoteOnHome ? "left-[22px]" : "left-0.5"}`}
            />
          </button>
        </label>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">Langue</span>
          <span className="text-sm text-ink-dim">Français 🇫🇷</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm">Apparence</span>
          <span className="text-sm text-ink-dim">Nuit dorée ✦</span>
        </div>
      </section>

      <section className="card space-y-3">
        <h3 className="font-serif text-lg text-gold-soft">Données</h3>
        <p className="text-xs text-ink-dim leading-relaxed">
          Tes données sont stockées uniquement sur cet appareil. La synchronisation
          entre appareils (avec un compte) arrivera dans une prochaine version.
        </p>
        {confirmReset ? (
          <div className="space-y-2">
            <p className="text-sm text-rose-300">Tout effacer ? Cette action est définitive.</p>
            <div className="flex gap-2">
              <button onClick={resetAll} className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold bg-rose-400 text-night">
                Oui, tout effacer
              </button>
              <button onClick={() => setConfirmReset(false)} className="btn-ghost flex-1">
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="btn-ghost w-full text-rose-300 border-rose-300/30">
            Réinitialiser toutes les données
          </button>
        )}
      </section>

      <section className="card">
        <h3 className="font-serif text-lg text-gold-soft mb-1">À propos</h3>
        <p className="text-xs text-ink-dim leading-relaxed">
          KAIROS v0.1 — « Le bon moment, c'est maintenant. »<br />
          Organize today, elevate tomorrow.
        </p>
      </section>
    </div>
  );
}
