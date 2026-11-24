export const CITIES = [
  { id: 'mexico-city', name: 'Ciudad de México', timeZone: 'America/Mexico_City' },
  { id: 'madrid', name: 'Madrid', timeZone: 'Europe/Madrid' },
  { id: 'tokyo', name: 'Tokio', timeZone: 'Asia/Tokyo' },
  { id: 'new-york', name: 'Nueva York', timeZone: 'America/New_York' },
];

export function formatTime(date, timeZone) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export function formatDate(date, timeZone) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function getCityTimes(date = new Date()) {
  return CITIES.map((c) => ({
    ...c,
    time: formatTime(date, c.timeZone),
    date: formatDate(date, c.timeZone),
  }));
}
