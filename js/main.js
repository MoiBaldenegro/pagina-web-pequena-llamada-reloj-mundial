import { getCityTimes } from '../src/time.js';

function render() {
  for (const c of getCityTimes(new Date())) {
    const card = document.querySelector(`[data-city="${c.id}"]`);
    if (!card) continue;
    card.querySelector('.clock').textContent = c.time;
    card.querySelector('.date').textContent = c.date;
  }
}

render();
setInterval(render, 1000);
