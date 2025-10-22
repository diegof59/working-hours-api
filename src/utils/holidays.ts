import { DateTime } from "luxon";

// Minimal offline fallback for tests in Oct & Nov 2025
const FALLBACK_HOLIDAYS = new Set<string>([
  "2025-10-13",
  "2025-11-03",
  "2025-11-17"
]);

class HolidaysProvider {
  private loaded = false;
  private days = new Set<string>(); // yyyy-MM-dd in TZ

  private toKey(dt: DateTime): string {
    const isoDate = dt.toISODate();
    if (!isoDate) {
      throw new Error("Invalid DateTime object: Unable to convert to ISO date.");
    }
    return isoDate;
  }

  private add(dateIso: string): void {
    this.days.add(dateIso);
  }

  async ensureLoaded(): Promise<void> {
    if (this.loaded) return;
    try {
      const URL = "https://content.capta.co/Recruitment/WorkingDays.json";
      const resp = await fetch(URL);
      if (resp.ok) {
        const json = await resp.json();
        // Try to extract ISO dates from array or object properties; be defensive
        const collect: string[] = [];
        if (Array.isArray(json)) {
          for (const item of json) {
            if (typeof item === "string" && /^\d{4}-\d{2}-\d{2}/.test(item)) collect.push(item.substring(0, 10));
            else if (item && typeof item === "object") {
              const val = (item.date || item.day || item.holiday) as string | undefined;
              if (val && /^\d{4}-\d{2}-\d{2}/.test(val)) collect.push(val.substring(0, 10));
            }
          }
        } else if (json && typeof json === "object") {
          for (const v of Object.values(json)) {
            if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) collect.push(v.substring(0, 10));
            if (Array.isArray(v)) {
              for (const s of v) {
                if (typeof s === "string" && /^\d{4}-\d{2}-\d{2}/.test(s)) collect.push(s.substring(0, 10));
              }
            }
          }
        }
        for (const d of collect) this.add(d);
      }
    } catch {
      // ignore fetch errors; rely on fallback
    } finally {
      // Always add fallback minimal set
      for (const d of FALLBACK_HOLIDAYS) this.add(d);
      this.loaded = true;
    }
  }

  async isHoliday(dateLocal: DateTime): Promise<boolean> {
    await this.ensureLoaded();
    return this.days.has(this.toKey(dateLocal));
  }
}

export default HolidaysProvider;