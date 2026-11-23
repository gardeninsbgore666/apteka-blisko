import { matchesFilters } from './search.js';

const cityInput = document.querySelector('#city');
const streetInput = document.querySelector('#street');
const nameInput = document.querySelector('#name');
const resultList = document.querySelector('#results-list');
const resultCount = document.querySelector('#result-count');
const areaLabel = document.querySelector('#area-label');
const dataState = document.querySelector('#data-state');
const showMoreButton = document.querySelector('#show-more');
const pageSize = 12;
let pharmacies = [];
let visibleCount = pageSize;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function render() {
  const filters = { city: cityInput.value, street: streetInput.value, name: nameInput.value };
  const activeFilters = Object.values(filters).map((value) => value.trim()).filter(Boolean);
  const matches = pharmacies.filter((item) => matchesFilters(item, filters));
  matches.sort((left, right) => [left.city, left.street, left.name].join(' ').localeCompare([right.city, right.street, right.name].join(' '), 'pl'));
  resultCount.textContent = `${matches.length.toLocaleString('pl-PL')} ${matches.length === 1 ? 'apteka' : matches.length > 1 && matches.length < 5 ? 'apteki' : 'aptek'}`;
  areaLabel.textContent = activeFilters.length ? `— ${activeFilters.join(' · ')}` : 'w Polsce';

  if (!matches.length) {
    resultList.innerHTML = '<div class="empty-state"><strong>Nie znaleźliśmy apteki.</strong>Spróbuj skrócić nazwę lub zmienić kryteria wyszukiwania.</div>';
    showMoreButton.hidden = true;
    return;
  }

  resultList.innerHTML = matches.slice(0, visibleCount).map((item) => {
    const name = item.name || 'Apteka (nazwa niepodana)';
    const postal = item.postal_code || 'kod pocztowy niepodany';
    const address = [item.street, postal, item.city].filter(Boolean).join(', ') || 'Brak adresu w rejestrze';
    const mapQuery = encodeURIComponent([name, address].join(' '));
    const operator = item.operator && item.operator.trim() !== name.trim()
      ? `<div class="pharmacy-extra">Podmiot prowadzący: ${escapeHtml(item.operator)}</div>` : '';
    const phone = item.phone
      ? `<div class="pharmacy-extra">☎ ${escapeHtml(item.phone)}</div>`
      : '<div class="pharmacy-extra">Telefon niepodany w rejestrze</div>';
    const type = item.type ? `<span class="type-tag">${escapeHtml(item.type)}</span>` : '';
    return `<article class="pharmacy-card"><div class="pharmacy-info"><h3 class="pharmacy-name">${escapeHtml(name)} ${type}</h3><div class="pharmacy-address">${escapeHtml(address)}</div>${operator}${phone}</div><a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noreferrer">Mapa <span aria-hidden="true">↗</span></a></article>`;
  }).join('');
  showMoreButton.hidden = visibleCount >= matches.length;
}

for (const input of [cityInput, streetInput, nameInput]) {
  input.addEventListener('input', () => { visibleCount = pageSize; render(); });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') document.querySelector('#results-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (event.key === 'Escape' && input.value) { input.value = ''; visibleCount = pageSize; render(); }
  });
}

document.querySelector('#clear').addEventListener('click', () => {
  cityInput.value = '';
  streetInput.value = '';
  nameInput.value = '';
  visibleCount = pageSize;
  render();
  cityInput.focus();
});

showMoreButton.addEventListener('click', () => { visibleCount += pageSize; render(); });
document.querySelector('#year').textContent = new Date().getFullYear();

fetch('/api/pharmacies').then((response) => {
  if (!response.ok) throw new Error('Dane są chwilowo niedostępne');
  return response.json();
}).then((payload) => {
  pharmacies = payload.records || [];
  dataState.textContent = payload.source === 'live' ? 'Pełny rejestr aptek' : 'Próbka demonstracyjna';
  render();
}).catch(() => {
  dataState.textContent = 'Nie udało się połączyć';
  resultCount.textContent = 'Brak danych';
  resultList.innerHTML = '<div class="empty-state"><strong>Rejestr nie jest teraz dostępny.</strong>Odśwież stronę za chwilę lub uruchom projekt przez serwer z README.</div>';
});
