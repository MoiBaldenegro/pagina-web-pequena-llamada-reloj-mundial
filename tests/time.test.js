import { describe, it, expect } from 'vitest';
import { CITIES, formatTime, formatDate, getCityTimes } from '../src/time.js';

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
