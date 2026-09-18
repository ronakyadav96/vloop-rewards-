export const CLAIM_WAIT_MS = 24 * 60 * 60 * 1000;
export const MISSED_WINDOW_MS = 48 * 60 * 60 * 1000;

export function addMilliseconds(date, milliseconds) {
  return new Date(date.getTime() + milliseconds);
}

export function getDateKey(date, timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
