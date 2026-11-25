export const CITIES = [
  { id: 'mexico-city', name: 'Ciudad de México', timeZone: 'America/Mexico_City' },
  { id: 'madrid', name: 'Madrid', timeZone: 'Europe/Madrid' },
  { id: 'tokyo', name: 'Tokio', timeZone: 'Asia/Tokyo' },
  { id: 'new-york', name: 'Nueva York', timeZone: 'America/New_York' },
];

export const DEFAULT_IDS = CITIES.map((c) => c.id);

const EXTRA = [
  ['los-angeles', 'Los Ángeles', 'America/Los_Angeles'],
  ['chicago', 'Chicago', 'America/Chicago'],
  ['toronto', 'Toronto', 'America/Toronto'],
  ['bogota', 'Bogotá', 'America/Bogota'],
  ['lima', 'Lima', 'America/Lima'],
  ['santiago', 'Santiago', 'America/Santiago'],
  ['buenos-aires', 'Buenos Aires', 'America/Argentina/Buenos_Aires'],
  ['sao-paulo', 'São Paulo', 'America/Sao_Paulo'],
  ['londres', 'Londres', 'Europe/London'],
  ['paris', 'París', 'Europe/Paris'],
  ['berlin', 'Berlín', 'Europe/Berlin'],
  ['roma', 'Roma', 'Europe/Rome'],
  ['moscu', 'Moscú', 'Europe/Moscow'],
  ['estambul', 'Estambul', 'Europe/Istanbul'],
  ['el-cairo', 'El Cairo', 'Africa/Cairo'],
  ['lagos', 'Lagos', 'Africa/Lagos'],
  ['johannesburgo', 'Johannesburgo', 'Africa/Johannesburg'],
  ['dubai', 'Dubái', 'Asia/Dubai'],
  ['mumbai', 'Bombay', 'Asia/Kolkata'],
  ['bangkok', 'Bangkok', 'Asia/Bangkok'],
  ['singapur', 'Singapur', 'Asia/Singapore'],
  ['hong-kong', 'Hong Kong', 'Asia/Hong_Kong'],
  ['shanghai', 'Shanghái', 'Asia/Shanghai'],
  ['seul', 'Seúl', 'Asia/Seoul'],
  ['sidney', 'Sídney', 'Australia/Sydney'],
  ['auckland', 'Auckland', 'Pacific/Auckland'],
].map(([id, name, timeZone]) => ({ id, name, timeZone }));

export const CATALOG = [...CITIES, ...EXTRA];

export function parseSelection(raw) {
  try {
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return [...DEFAULT_IDS];
    const valid = [...new Set(ids)].filter((id) => CATALOG.some((c) => c.id === id));
    return valid;
  } catch {
    return [...DEFAULT_IDS];
  }
}

export function citiesFromIds(ids) {
  return ids.map((id) => CATALOG.find((c) => c.id === id)).filter(Boolean);
}

// 0 = medianoche (oscuro), 1 = mediodía (brillante)
export function daylight(date, timeZone) {
  const h = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(date)
      .reduce((a, p) => (p.type === 'hour' ? a + Number(p.value) : p.type === 'minute' ? a + Number(p.value) / 60 : a), 0),
  );
  return (1 - Math.cos(((h - 0) / 24) * 2 * Math.PI)) / 2;
}

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

export function getCityTimes(date = new Date(), cities = CITIES) {
  return cities.map((c) => ({
    ...c,
    time: formatTime(date, c.timeZone),
    date: formatDate(date, c.timeZone),
    daylight: daylight(date, c.timeZone),
  }));
}
