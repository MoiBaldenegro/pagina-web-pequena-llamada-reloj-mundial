import { describe, it, expect } from 'vitest';
import { CITIES, CATALOG, DEFAULT_IDS, parseSelection, citiesFromIds, daylight, formatTime, formatDate, getCityTimes } from '../src/time.js';

const winter = new Date('2024-01-15T12:00:00Z');
const summer = new Date('2024-07-15T12:00:00Z');
const late = new Date('2024-01-15T20:00:00Z');

describe('CITIES', () => {
  it('tiene las 4 ciudades en orden fijo', () => {
    expect(CITIES.map((c) => c.name)).toEqual(['Ciudad de México', 'Madrid', 'Tokio', 'Nueva York']);
    expect(CITIES.map((c) => c.timeZone)).toEqual([
      'America/Mexico_City', 'Europe/Madrid', 'Asia/Tokyo', 'America/New_York',
    ]);
  });
});

describe('formatTime', () => {
  it('invierno', () => {
    expect(formatTime(winter, 'America/Mexico_City')).toBe('06:00:00');
    expect(formatTime(winter, 'Europe/Madrid')).toBe('13:00:00');
    expect(formatTime(winter, 'Asia/Tokyo')).toBe('21:00:00');
    expect(formatTime(winter, 'America/New_York')).toBe('07:00:00');
  });
  it('verano (horario de verano)', () => {
    expect(formatTime(summer, 'America/Mexico_City')).toBe('06:00:00');
    expect(formatTime(summer, 'Europe/Madrid')).toBe('14:00:00');
    expect(formatTime(summer, 'Asia/Tokyo')).toBe('21:00:00');
    expect(formatTime(summer, 'America/New_York')).toBe('08:00:00');
  });
  it('usa 24 h con medianoche como 00', () => {
    expect(formatTime(new Date('2024-01-15T15:00:00Z'), 'Asia/Tokyo')).toBe('00:00:00');
  });
});

describe('formatDate', () => {
  it('fecha corta es-ES', () => {
    expect(formatDate(winter, 'Asia/Tokyo')).toBe('lun, 15 ene');
  });
  it('cambio de día', () => {
    expect(formatDate(late, 'Asia/Tokyo')).toBe('mar, 16 ene');
    expect(formatDate(late, 'America/New_York')).toBe('lun, 15 ene');
  });
});

describe('getCityTimes', () => {
  it('devuelve hora y fecha por ciudad en orden', () => {
    const r = getCityTimes(winter);
    expect(r.map((c) => c.id)).toEqual(['mexico-city', 'madrid', 'tokyo', 'new-york']);
    expect(r.map((c) => c.time)).toEqual(['06:00:00', '13:00:00', '21:00:00', '07:00:00']);
    expect(r[2]).toMatchObject({ name: 'Tokio', timeZone: 'Asia/Tokyo', date: 'lun, 15 ene' });
  });
  it('sin argumento usa la fecha actual', () => {
    expect(getCityTimes()).toHaveLength(4);
  });
});

describe('selección y catálogo', () => {
  it('el catálogo incluye las 4 por defecto primero y sin ids repetidos', () => {
    expect(CATALOG.slice(0, 4)).toEqual(CITIES);
    expect(new Set(CATALOG.map((c) => c.id)).size).toBe(CATALOG.length);
    expect(CATALOG.length).toBeGreaterThan(20);
  });
  it('parseSelection lee, filtra y cae al valor por defecto', () => {
    expect(parseSelection('["tokyo","x","tokyo","madrid"]')).toEqual(['tokyo', 'madrid']);
    expect(parseSelection('[]')).toEqual([]);
    expect(parseSelection('basura')).toEqual(DEFAULT_IDS);
    expect(parseSelection(null)).toEqual(DEFAULT_IDS);
  });
  it('citiesFromIds y getCityTimes con selección propia', () => {
    const r = getCityTimes(winter, citiesFromIds(['londres', 'tokyo']));
    expect(r.map((c) => c.time)).toEqual(['12:00:00', '21:00:00']);
  });
  it('daylight: mediodía brillante, medianoche oscuro', () => {
    expect(daylight(new Date('2024-01-15T12:00:00Z'), 'UTC')).toBeCloseTo(1);
    expect(daylight(new Date('2024-01-15T00:00:00Z'), 'UTC')).toBeCloseTo(0);
  });
});

import { formatOffset, matchesQuery, CATALOG as CAT } from '../src/time.js';
describe('zonas horarias', () => {
  const jan = new Date('2024-01-15T12:00:00Z');
  const by = (id) => CAT.find((c) => c.id === id);
  it('formatea desfases UTC', () => {
    expect(formatOffset(jan, 'America/Mexico_City')).toBe('UTC-6');
    expect(formatOffset(jan, 'Asia/Kolkata')).toBe('UTC+5:30');
    expect(formatOffset(jan, 'Europe/London')).toBe('UTC');
  });
  it('busca por notación UTC', () => {
    expect(matchesQuery(by('tokyo'), 'UTC+9', jan)).toBe(true);
    expect(matchesQuery(by('tokyo'), 'gmt+09:00', jan)).toBe(true);
    expect(matchesQuery(by('tokyo'), '+9', jan)).toBe(true);
    expect(matchesQuery(by('tokyo'), 'utc-6', jan)).toBe(false);
    expect(matchesQuery(by('mumbai'), 'utc+5:30', jan)).toBe(true);
    expect(matchesQuery(by('mexico-city'), 'utc -6', jan)).toBe(true);
    expect(matchesQuery(by('madrid'), 'asia', jan)).toBe(false);
    expect(matchesQuery(by('tokyo'), 'asia/tokyo', jan)).toBe(true);
  });
});
