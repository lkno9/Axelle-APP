import { AgendaEvent, EventCategory, PlannerSettings, Task } from "./types";
import { addDays, fromKey, toKey } from "./dates";

export interface PlannedBlock {
  taskId: string;
  title: string;
  date: string;
  start: string;
  end: string;
  category: EventCategory;
}

export interface PlanResult {
  blocks: PlannedBlock[];
  unplaced: { task: Task; missingMin: number }[];
}

const toMin = (hm: string) => Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3, 5));
const toHM = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const GAP = 10; // minutes de battement entre deux créneaux

/**
 * Répartit les tâches en séances de travail dans les créneaux libres,
 * au plus tôt, avec pour objectif de tout terminer la veille de chaque
 * échéance (une seconde passe utilise le jour J si nécessaire).
 */
export function generatePlan(
  tasks: Task[],
  events: AgendaEvent[],
  s: PlannerSettings,
  now = new Date()
): PlanResult {
  const todayKey = toKey(now);
  const active = tasks
    .filter((t) => !t.done && t.deadline >= todayKey)
    .sort((a, b) => a.deadline.localeCompare(b.deadline) || b.estimatedMin - a.estimatedMin);

  const blocks: PlannedBlock[] = [];
  const unplaced: PlanResult["unplaced"] = [];

  const occupied = new Map<string, { start: number; end: number }[]>();
  events.forEach((e) => {
    if (e.date < todayKey) return;
    const list = occupied.get(e.date) ?? [];
    list.push({ start: toMin(e.start), end: toMin(e.end) });
    occupied.set(e.date, list);
  });

  const plannedPerDay = new Map<string, number>();

  function dayWindow(key: string): { start: number; end: number } {
    const day = fromKey(key).getDay();
    const weekend = day === 0 || day === 6;
    let start = toMin(weekend ? s.weekendStart : s.weekdayStart);
    const end = toMin(weekend ? s.weekendEnd : s.weekdayEnd);
    if (key === todayKey) {
      const nowMin = now.getHours() * 60 + now.getMinutes() + GAP;
      start = Math.max(start, Math.ceil(nowMin / 5) * 5);
    }
    return { start, end };
  }

  function findSlot(key: string, len: number): { start: number; end: number } | null {
    const { start: ws, end: we } = dayWindow(key);
    const occ = [...(occupied.get(key) ?? [])].sort((a, b) => a.start - b.start);
    let cursor = ws;
    for (const o of occ) {
      if (o.end + GAP <= cursor) continue;
      if (cursor + len + GAP <= o.start) break;
      cursor = Math.max(cursor, o.end + GAP);
    }
    return cursor + len <= we ? { start: cursor, end: cursor + len } : null;
  }

  function commit(task: Task, key: string, slot: { start: number; end: number }) {
    const list = occupied.get(key) ?? [];
    list.push(slot);
    occupied.set(key, list);
    plannedPerDay.set(key, (plannedPerDay.get(key) ?? 0) + (slot.end - slot.start));
    blocks.push({
      taskId: task.id,
      title: task.title,
      date: key,
      start: toHM(slot.start),
      end: toHM(slot.end),
      category: task.category,
    });
  }

  for (const task of active) {
    let remaining = task.estimatedMin;

    // passe 1 : répartir équitablement jusqu'à la veille de l'échéance
    // passe 2 : compléter librement jusqu'à la veille si des créneaux manquaient
    // passe 3 : en dernier recours, utiliser aussi le jour de l'échéance
    for (const pass of [
      { buffer: 1, spread: true },
      { buffer: 1, spread: false },
      { buffer: 0, spread: false },
    ]) {
      if (remaining <= 0) break;
      const lastKey = toKey(addDays(fromKey(task.deadline), -pass.buffer));
      if (lastKey < todayKey) continue;

      const daysAvail =
        Math.round((fromKey(lastKey).getTime() - fromKey(todayKey).getTime()) / 86_400_000) + 1;
      const dailyCap = pass.spread
        ? Math.max(s.blockMin, Math.ceil(remaining / daysAvail))
        : Infinity;

      let day = fromKey(todayKey);
      while (toKey(day) <= lastKey && remaining > 0) {
        const key = toKey(day);
        let placedToday = 0;
        while (remaining > 0 && placedToday < dailyCap) {
          const room = s.maxDailyMin - (plannedPerDay.get(key) ?? 0);
          // dernière séance un peu plus longue plutôt qu'un reliquat < 15 min
          const wanted = remaining <= s.blockMin * 1.5 ? remaining : s.blockMin;
          const len = Math.min(wanted, room, dailyCap - placedToday);
          if (len < 15) break;
          const slot = findSlot(key, len);
          if (!slot) break;
          commit(task, key, slot);
          remaining -= len;
          placedToday += len;
        }
        day = addDays(day, 1);
      }
    }

    if (remaining > 0) unplaced.push({ task, missingMin: remaining });
  }

  blocks.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
  return { blocks, unplaced };
}
