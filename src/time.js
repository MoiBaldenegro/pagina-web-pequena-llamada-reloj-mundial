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
    offset: formatOffset(date, c.timeZone),
    abbr: zoneAbbr(date, c.timeZone),
  }));
}

// Desfase UTC en minutos para una zona en un instante dado.
export function offsetMinutes(date, timeZone) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
    .formatToParts(date).find((x) => x.type === 'timeZoneName')?.value ?? 'GMT';
  const m = /([+-])(\d{1,2}):?(\d{2})?/.exec(p);
  if (!m) return 0;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] || 0));
}

// "UTC-6", "UTC+5:30", "UTC"
export function formatOffset(date, timeZone) {
  const min = offsetMinutes(date, timeZone);
  if (min === 0) return 'UTC';
  const a = Math.abs(min);
  const mm = a % 60;
  return `UTC${min < 0 ? '-' : '+'}${Math.floor(a / 60)}${mm ? ':' + String(mm).padStart(2, '0') : ''}`;
}

// Abreviatura de zona ("CST", "GMT+9"…)
export function zoneAbbr(date, timeZone) {
  return new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
    .formatToParts(date).find((x) => x.type === 'timeZoneName')?.value ?? '';
}

// Texto buscable: nombre, id IANA, UTC+X, GMT+X, +X, +HH:MM y abreviatura.
export function searchText(city, date = new Date()) {
  const min = offsetMinutes(date, city.timeZone);
  const a = Math.abs(min), s = min < 0 ? '-' : '+';
  const h = Math.floor(a / 60), mm = String(a % 60).padStart(2, '0');
  const forms = min === 0
    ? ['utc', 'gmt', 'z', '+0', '-0', '+00:00']
    : [`utc${s}${h}`, `gmt${s}${h}`, `${s}${h}`, `utc${s}${String(h).padStart(2, '0')}:${mm}`, `gmt${s}${String(h).padStart(2, "0")}:${mm}`, `${s}${String(h).padStart(2, '0')}:${mm}`, `${s}${String(h).padStart(2, '0')}${mm}`,
       ...(a % 60 ? [`utc${s}${h}:${mm}`, `gmt${s}${h}:${mm}`, `${s}${h}:${mm}`] : [])];
  return [city.name, city.timeZone, city.timeZone.replace(/_/g, ' '), zoneAbbr(date, city.timeZone), ...forms]
    .join(' ').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function matchesQuery(city, query, date = new Date()) {
  const q = query.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
  if (!q) return true;
  const hay = searchText(city, date);
  return hay.includes(q) || hay.includes(q.replace(/ /g, ''));
}
