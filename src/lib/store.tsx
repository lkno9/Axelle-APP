import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AgendaEvent, Hobby, PlannerSettings, Profile, Settings, StudySession, Task } from "./types";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`kairos.${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));
  useEffect(() => {
    localStorage.setItem(`kairos.${key}`, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface AppState {
  events: AgendaEvent[];
  setEvents: (fn: (prev: AgendaEvent[]) => AgendaEvent[]) => void;
  hobbies: Hobby[];
  setHobbies: (fn: (prev: Hobby[]) => Hobby[]) => void;
  sessions: StudySession[];
  setSessions: (fn: (prev: StudySession[]) => StudySession[]) => void;
  favorites: string[];
  setFavorites: (fn: (prev: string[]) => string[]) => void;
  tasks: Task[];
  setTasks: (fn: (prev: Task[]) => Task[]) => void;
  planner: PlannerSettings;
  setPlanner: (p: PlannerSettings) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  resetAll: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEventsRaw] = usePersisted<AgendaEvent[]>("events", []);
  const [hobbies, setHobbiesRaw] = usePersisted<Hobby[]>("hobbies", []);
  const [sessions, setSessionsRaw] = usePersisted<StudySession[]>("sessions", []);
  const [favorites, setFavoritesRaw] = usePersisted<string[]>("favorites", []);
  const [tasks, setTasksRaw] = usePersisted<Task[]>("tasks", []);
  const [planner, setPlanner] = usePersisted<PlannerSettings>("planner", {
    weekdayStart: "17:00",
    weekdayEnd: "22:00",
    weekendStart: "10:00",
    weekendEnd: "19:00",
    maxDailyMin: 240,
    blockMin: 50,
  });
  const [profile, setProfile] = usePersisted<Profile>("profile", {
    name: "",
    goal: "",
    emoji: "🌟",
  });
  const [settings, setSettings] = usePersisted<Settings>("settings", {
    showQuoteOnHome: true,
  });

  const resetAll = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("kairos."))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <Ctx.Provider
      value={{
        events,
        setEvents: (fn) => setEventsRaw((p) => fn(p)),
        hobbies,
        setHobbies: (fn) => setHobbiesRaw((p) => fn(p)),
        sessions,
        setSessions: (fn) => setSessionsRaw((p) => fn(p)),
        favorites,
        setFavorites: (fn) => setFavoritesRaw((p) => fn(p)),
        tasks,
        setTasks: (fn) => setTasksRaw((p) => fn(p)),
        planner,
        setPlanner,
        profile,
        setProfile,
        settings,
        setSettings,
        resetAll,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
