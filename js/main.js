import { CATALOG, DEFAULT_IDS, getCityTimes, citiesFromIds, parseSelection } from '../src/time.js';

const KEY = 'reloj-mundial:seleccion';
const $ = (id) => document.getElementById(id);
const heatmap = $('heatmap');
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw === null ? [...DEFAULT_IDS] : parseSelection(raw);
  } catch {
    return [...DEFAULT_IDS];
  }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(selected)); } catch { /* sin almacenamiento */ }
}

let selected = load();

function layout() {
  const n = selected.length || 1;
  const w = heatmap.clientWidth || 1, h = Math.max(heatmap.clientHeight, 1);
  let cols = 1, best = Infinity;
  for (let c = 1; c <= n; c++) {
    const r = Math.ceil(n / c);
    const empty = c * r - n;
    const ratio = (w / c) / (h / r);
    const score = Math.abs(Math.log(ratio / 1.6)) + empty * 0.3;
    if (score < best) { best = score; cols = c; }
  }
  heatmap.style.setProperty('--cols', cols);
  heatmap.style.setProperty('--rows', Math.ceil(n / cols));
}

function buildTiles() {
  heatmap.replaceChildren();
  for (const c of citiesFromIds(selected)) {
    const t = document.createElement('article');
    t.className = 'tile';
    t.dataset.city = c.id;
    const h = document.createElement('h2'); h.textContent = c.name;
    const tm = document.createElement('time'); tm.className = 'clock'; tm.textContent = '--:--:--';
    const d = document.createElement('p'); d.className = 'date';
    const x = document.createElement('button');
    x.className = 'remove'; x.type = 'button'; x.textContent = '✕';
    x.setAttribute('aria-label', `Quitar ${c.name}`);
    x.addEventListener('click', () => toggle(c.id));
    t.append(h, tm, d, x);
    heatmap.append(t);
  }
  $('empty').hidden = selected.length > 0;
  $('count').textContent = selected.length;
  layout();
  render();
}

function render() {
  const times = getCityTimes(new Date(), citiesFromIds(selected));
  for (const c of times) {
    const tile = heatmap.querySelector(`[data-city="${c.id}"]`);
    if (!tile) continue;
    tile.style.setProperty('--d', c.daylight.toFixed(3));
    tile.querySelector('.clock').textContent = c.time;
    tile.querySelector('.date').textContent = c.date;
  }
}

function toggle(id) {
  selected = selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id];
  save();
  buildTiles();
  renderList();
}

function renderList() {
  const q = norm($('search').value.trim());
  const ul = $('list');
  ul.replaceChildren();
  for (const c of CATALOG.filter((c) => norm(c.name).includes(q))) {
    const on = selected.includes(c.id);
    const li = document.createElement('li');
    const info = document.createElement('div');
    info.textContent = c.name;
    const sm = document.createElement('small'); sm.textContent = c.timeZone;
    info.append(sm);
    const b = document.createElement('button');
    b.type = 'button'; b.className = `btn ${on ? 'on' : 'add'}`;
    b.textContent = on ? 'Quitar' : 'Añadir';
    b.addEventListener('click', () => toggle(c.id));
    li.append(info, b);
    ul.append(li);
  }
}

function setPanel(open) {
  $('panel').hidden = !open;
  $('open-panel').setAttribute('aria-expanded', String(open));
  if (open) { renderList(); $('search').focus(); }
}

$('open-panel').addEventListener('click', () => setPanel($('panel').hidden));
$('close-panel').addEventListener('click', () => setPanel(false));
$('search').addEventListener('input', renderList);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setPanel(false); });
window.addEventListener('resize', layout);

buildTiles();
setInterval(render, 1000);
