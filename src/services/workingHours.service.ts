import { DateTime, Duration } from "luxon";

import HolidaysProvider from "#utils/holidays.js";
import { TimeDelta } from "#types/types.js";

const TZ = "America/Bogota"; // COL Timezone (UTC -5)

/**
 * Working hours in local time
 * Defines the two working sessions in a work day.
 */
const MORNING_START = { hour: 8, minute: 0 } as const;
const MORNING_END = { hour: 12, minute: 0 } as const;
const AFTERNOON_START = { hour: 13, minute: 0 } as const;
const AFTERNOON_END = { hour: 17, minute: 0 } as const;

/**
 * An instance of the `HolidaysProvider` class
 * to manage and retrieve information about holidays.
 */
const holidaysProvider = new HolidaysProvider();

/**
 * Determines if a given date falls on a weekend.
 *
 * @param dt - The date to check, represented as a DateTime object.
 * @returns `true` if the date is a Saturday or Sunday, otherwise `false`.
 */
function isWeekend(dt: DateTime): boolean {
  return dt.weekday === 6 || dt.weekday === 7;
}

/**
 * Determines if a given DateTime object falls within the morning time range.
 *
 * @param dt - The DateTime object to check.
 * @returns `true` if the provided DateTime is within the morning range, 
 *          `false` otherwise.
 */
function inMorning(dt: DateTime): boolean {
  return (dt.hour >= MORNING_START.hour && dt.hour < MORNING_END.hour) ||
    (dt.hour === MORNING_END.hour && dt.minute === MORNING_END.minute);
}

/**
 * Determines whether a given DateTime falls within the afternoon time range.
 *
 * @param dt - The DateTime object to evaluate.
 * @returns `true` if the provided DateTime is in the afternoon range, otherwise `false`.
 */
function inAfternoon(dt: DateTime): boolean {
  return (dt.hour >= AFTERNOON_START.hour && dt.hour < AFTERNOON_END.hour) ||
    (dt.hour === AFTERNOON_END.hour && dt.minute <= AFTERNOON_END.minute);
}

/**
 * Determines whether a given DateTime object falls within working hours.
 *
 * Checks if the provided DateTime is within working hours
 * @param dt - The DateTime object to check.
 * @returns `true` if the DateTime is during working hours, otherwise `false`.
 */
function isDuringWorkHours(dt: DateTime): boolean {
  return inMorning(dt) || inAfternoon(dt);
}

/**
 * Determines whether a given DateTime object is after a specified time.
 *
 * @param dt - The DateTime object to compare.
 * @returns `true` if the DateTime is after the specified hour and minute, otherwise `false`.
 */
function after(dt: DateTime, h: number, m: number): boolean {
  return dt.hour > h || (dt.hour === h && dt.minute > m);
}

/**
 * Sets the time of a given DateTime object to the specified hour and minute, 
 * while setting seconds and milliseconds to zero.
 *
 * @param dt - The DateTime object to modify.
 * @param h - The hour to set (0-23).
 * @param m - The minute to set (0-59). Defaults to 0.
 * @returns A new DateTime object with the updated time.
 */
function setTime(dt: DateTime, h: number, m: number = 0): DateTime {
  return dt.set({ hour: h, minute: m, second: 0, millisecond: 0 });
}


/**
 * Determines whether a given date is a working day.
 *
 * A working day is defined as a day that is not a weekend and not a holiday.
 *
 * @param dt - The date to check, a DateTime object.
 * @returns A promise that resolves to `true` if the date is a working day, or `false` otherwise.
 */
async function isWorkingDay(dt: DateTime): Promise<boolean> {
  if (isWeekend(dt)) return false;
  if (await holidaysProvider.isHoliday(dt)) return false;
  return true;
}


/**
 * Adjusts the given date to the nearest working day in the specified direction.
 *
 * @param dt - The initial date as a DateTime object.
 * @param dir - The direction to adjust the date. Use "next" to find the next working day or "last" to find the previous working day.
 * @returns A promise that resolves to the adjusted DateTime object.
 */
async function adjustWorkingDay(dt: DateTime, dir: "next" | "last"): Promise<DateTime> {
  
  switch (dir) {
    case "next":
      while (!(await isWorkingDay(dt))) {
        dt = dt.plus({ days: 1 });
      }
      break;
    case "last":
      while (!(await isWorkingDay(dt))) {
        dt = dt.minus({ days: 1 });
        dt = setTime(dt, AFTERNOON_END.hour, AFTERNOON_END.minute);
      }
      break;
  }
  return dt
}


/**
 * Calculates the last working moment based on the given datetime.
 * 
 * @param dt - The input datetime
 * @returns A promise that resolves to the last working moment as a `DateTime` object.
 */
async function lastWorkingMoment(dt: DateTime): Promise<DateTime> {
  // If not a working day, jump to last working day at Afternoon End
  if (!(await isWorkingDay(dt))) {
    const day = await adjustWorkingDay(dt, "last");
    return day;
  }

  // In working sessions -> stay there
  if (isDuringWorkHours(dt)) return dt;

  // If during lunch, move to Afternoon Start
  // remark: The during afternoon start moment does not get here, as it is catch in the isDuringWorkHours conditional
  if (after(dt, MORNING_END.hour, MORNING_END.minute) && !after(dt, AFTERNOON_START.hour, AFTERNOON_START.minute)) {
    return setTime(dt, AFTERNOON_START.hour, AFTERNOON_START.minute);
  }

  // If before work start -> Afternoon End on last day
  if (!after(dt, MORNING_START.hour, MORNING_START.minute)) {
    return adjustWorkingDay(dt, "last");
  }

  // If after Afternoon End -> Afternoon End on same Day
  if (after(dt, AFTERNOON_END.hour, AFTERNOON_END.minute)) {
    return setTime(dt, AFTERNOON_END.hour, AFTERNOON_END.minute);
  }

  return dt;
}

/**
 * Calculates the number of minutes remaining until the end of the current working session.
 *
 * @param current - The current DateTime object.
 * @returns The number of minutes until the end of the current working session.
 */
function minutesUntilSessionEnd(current: DateTime): number {
  if (inMorning(current)) {
    const sessionEnd = setTime(current, MORNING_END.hour, MORNING_END.minute);
    return sessionEnd.diff(current, "minutes").minutes;
  } else if (inAfternoon(current)) {
    const sessionEnd = setTime(current, AFTERNOON_END.hour, AFTERNOON_END.minute);
    return sessionEnd.diff(current, "minutes").minutes;
  }
  return 0; // If not in a working session, return 0
}

/**
 * Advances the given DateTime object to the start of the next working session.
 *
 * If the current time is in the morning session, it moves to the afternoon start.
 * If the current time is in the afternoon session or after work hours, it moves to the next working day's morning start.
 *
 * @param current - The current DateTime object.
 * @returns A promise that resolves to the DateTime object adjusted to the next working session start.
 */
async function advanceToNextSessionStart(current: DateTime): Promise<DateTime> {
  if (inMorning(current)) {
    // Move to the start of the afternoon session
    return setTime(current, AFTERNOON_START.hour, AFTERNOON_START.minute);
  } else if (inAfternoon(current) || after(current, AFTERNOON_END.hour, AFTERNOON_END.minute)) {
    // Move to the next working day's morning start
    let nextDay = current.plus({ days: 1 }).startOf("day");
    while (!(await isWorkingDay(nextDay))) {
      nextDay = nextDay.plus({ days: 1 });
    }
    return setTime(nextDay, MORNING_START.hour, MORNING_START.minute);
  }
  // If before work starts, move to today's morning start
  return setTime(current, MORNING_START.hour, MORNING_START.minute);
}

/**
 * Adds a specified number of working hours to a given init DateTime, 
 * taking into account working session boundaries and breaks.
 *
 * @param initLocal - The initial DateTime from which to start adding working hours.
 * @param hours - The number of working hours to add. If 0, the initial DateTime is returned.
 * @returns A Promise that resolves to the resulting DateTime after adding the specified working hours.
 *
 * @remarks
 * - This function respects working session limits and will skip non-working periods.
 * - The `lastWorkingMoment` function is used to ensure the starting point is within a valid working session.
 * - The `advanceToNextSessionStart` function is used to move to the next working session when necessary.
 * - The `minutesUntilSessionEnd` function determines how much time remains in the current session.
 */
async function addWorkingHours(initLocal: DateTime, hours: number): Promise<DateTime> {
  if (hours === 0) return initLocal;
  let current = await lastWorkingMoment(initLocal);

  let minutesToAdd = hours * 60;
  while (minutesToAdd > 0) {
    const remaining = minutesUntilSessionEnd(current);
    if (minutesToAdd <= remaining) {
      return current.plus({ minutes: minutesToAdd });
    }
    // consume remaining and jump to next session start
    minutesToAdd -= remaining;
    current = await advanceToNextSessionStart(current);
  }
  return current;
}

/**
 * Adds a specified number of working days to a given init datetime.
 * 
 * This function calculates the resulting date and time by skipping non-working days
 * and preserving the time of day within a working session. It ensures that the 
 * resulting date and time fall within a valid working period.
 * 
 * @param initLocal - The starting date and time as a `DateTime` object.
 * @param days - The number of working days to add. If `0`, the function returns the starting date.
 * @returns A `Promise` that resolves to the resulting `DateTime` after adding the specified number of working days.
 */
async function addWorkingDays(initLocal: DateTime, days: number): Promise<DateTime> {
  if (days === 0) return initLocal;
  let current = await lastWorkingMoment(initLocal);
  let remaining = days;
  while (remaining > 0) {
    // move one working day
    let dt = current.plus({ days: 1 })
    while (!(await isWorkingDay(dt))) {
      dt = dt.plus({ days: 1 });
    }
    current = dt;
    remaining -= 1;
  }
  return current;
}

/**
 * Adds a specified amount of working time (days and hours) to a given init datetime.
 * 
 * @param initDTLocal - The starting datetime as a `DateTime` object. This should be in the local time zone.
 * @param add - An object containing the amount of time to add, with optional `days` and `hours` properties.
 *              - `days`: The number of working days to add (default is 0 if not provided).
 *              - `hours`: The number of working hours to add (default is 0 if not provided).
 * 
 * @returns A `Promise` that resolves to a `DateTime` object representing the resulting date and time in UTC.
 */
export async function addWorkingTime(initDTLocal: DateTime, add: TimeDelta): Promise<DateTime> {
  const days = add.days ?? 0;
  const hours = add.hours ?? 0;
  // Add days first, then hours
  const afterDays = await addWorkingDays(initDTLocal, days);
  const afterHours = await addWorkingHours(afterDays, hours);
  // Returns in UTC
  return afterHours.setZone("utc");
}

export default {
  addWorkingTime,
};
