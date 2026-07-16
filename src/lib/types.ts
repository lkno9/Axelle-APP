export type EventCategory = "etude" | "travail" | "sport" | "perso" | "sante";

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  category: EventCategory;
  note?: string;
}

export interface HobbyEntry {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  note?: string;
}

export interface Hobby {
  id: string;
  name: string;
  emoji: string;
  weeklyTargetMin: number;
  entries: HobbyEntry[];
}

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  focusMin: number;
  mode: string;
}

export interface Profile {
  name: string;
  goal: string;
  emoji: string;
}

export interface Settings {
  showQuoteOnHome: boolean;
}

export const CATEGORY_META: Record<EventCategory, { label: string; dot: string }> = {
  etude: { label: "Études", dot: "bg-lav" },
  travail: { label: "Travail", dot: "bg-blue" },
  sport: { label: "Sport", dot: "bg-emerald-400" },
  perso: { label: "Perso", dot: "bg-gold" },
  sante: { label: "Santé", dot: "bg-rose-400" },
};
