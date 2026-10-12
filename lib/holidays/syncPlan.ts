import {
  holidayDescription,
  holidayKey,
  holidayTitle,
  type OfficialHoliday,
} from "@/lib/holidays/official";

export type ManagedHolidayEvent = {
  id: string;
  key: string;
  date: string;
  summary: string;
  description: string;
  source?: string;
};

export type HolidaySyncPlan = {
  insert: OfficialHoliday[];
  update: Array<{ id: string; holiday: OfficialHoliday }>;
  remove: ManagedHolidayEvent[];
  unchanged: number;
};

function sameCalendarDay(event: ManagedHolidayEvent, holiday: OfficialHoliday) {
  return event.date === holiday.date && normalize(event.summary) === normalize(holidayTitle(holiday));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function changed(event: ManagedHolidayEvent, holiday: OfficialHoliday) {
  return event.date !== holiday.date
    || event.summary !== holidayTitle(holiday)
    || event.description !== holidayDescription(holiday)
    || event.source !== holiday.source;
}

/**
 * Diff official holidays against events this sync created.
 * Events without a My Vibe key are left alone unless they are the same
 * holiday on the same day, in which case they are adopted instead of duplicated.
 * An empty desired list never deletes existing events.
 */
export function planHolidaySync(
  desired: OfficialHoliday[],
  existing: ManagedHolidayEvent[],
): HolidaySyncPlan {
  const plan: HolidaySyncPlan = { insert: [], update: [], remove: [], unchanged: 0 };
  if (!desired.length) return plan;

  const desiredKeys = new Set(desired.map((holiday) => holidayKey(holiday)));
  const byKey = new Map<string, ManagedHolidayEvent[]>();
  for (const event of existing) {
    if (!event.key) continue;
    const group = byKey.get(event.key) ?? [];
    group.push(event);
    byKey.set(event.key, group);
  }
  const consumed = new Set<string>();

  for (const holiday of desired) {
    const key = holidayKey(holiday);
    const matches = byKey.get(key) ?? [];
    const primary = matches[0];
    if (primary) {
      consumed.add(primary.id);
      if (changed(primary, holiday)) plan.update.push({ id: primary.id, holiday });
      else plan.unchanged += 1;
      for (const extra of matches.slice(1)) {
        consumed.add(extra.id);
        plan.remove.push(extra);
      }
      for (const event of existing) {
        if (event.key || consumed.has(event.id) || !sameCalendarDay(event, holiday)) continue;
        consumed.add(event.id);
        plan.remove.push(event);
      }
      continue;
    }

    const adopted = existing.find((event) => !event.key && !consumed.has(event.id) && sameCalendarDay(event, holiday));
    if (adopted) {
      consumed.add(adopted.id);
      plan.update.push({ id: adopted.id, holiday });
      for (const event of existing) {
        if (consumed.has(event.id) || !sameCalendarDay(event, holiday)) continue;
        consumed.add(event.id);
        plan.remove.push(event);
      }
      continue;
    }
    plan.insert.push(holiday);
  }

  for (const event of existing) {
    if (!event.key || consumed.has(event.id)) continue;
    if (!desiredKeys.has(event.key)) plan.remove.push(event);
  }

  return plan;
}
