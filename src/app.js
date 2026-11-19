import { matchesFilters } from './search.js';

const cityInput = document.querySelector('#city');
const streetInput = document.querySelector('#street');
const nameInput = document.querySelector('#name');
const list = document.querySelector('#results-list');
const count = document.querySelector('#result-count');
const area = document.querySelector('#area-label');
const state = document.querySelector('#data-state');
let pharmacies = [];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function render() {
  const filters = { city: cityInput.value, street: streetInput.value, name: nameInput.value };
  const activeFilters = Object.values(filters).map((value) => value.trim()).filter(Boolean);
  const matches = pharmacies.filter((item) => matchesFilters(item, filters));
  matches.sort((left, right) => [left.city, left.street, left.name].join(' ').localeCompare([right.city, right.street, right.name].join(' '), 'pl'));
  count.textContent = `${matches.length.toLocaleString('pl-PL')} ${matches.length === 1 ? 'wynik' : 'wyników'}`;
  area.textContent = activeFilters.length ? `— ${activeFilters.join(' · ')}` : 'w Polsce';
  if (!matches.length) {
    list.innerHTML = '<div class="empty">Nie znaleźliśmy apteki dla tych kryteriów. Zmień miasto, ulicę lub nazwę.</div>';
    return;
  }
  list.innerHTML = matches.slice(0, 100).map((item) => {
    const name = item.name || 'Apteka (nazwa niepodana)';
    const postalCode = item.postal_code || 'kod pocztowy niepodany';
    const address = [item.street, postalCode, item.city].filter(Boolean).join(', ') || 'Brak adresu w rejestrze';
    const mapQuery = encodeURIComponent([name, address].join(' '));
    const operator = item.operator && item.operator.trim() !== name.trim()
      ? `<div class="location">Podmiot prowadzący: ${escapeHtml(item.operator)}</div>` : '';
    const type = item.type ? `<span class="type-tag">${escapeHtml(item.type)}</span>` : '';
    const phone = item.phone
      ? `<div class="location">☎ ${escapeHtml(item.phone)}</div>`
      : '<div class="location">Telefon niepodany w rejestrze</div>';
    return `<article class="card"><div><h3>${escapeHtml(name)} ${type}</h3><div class="address">${escapeHtml(address)}</div>${operator}${phone}</div><a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noreferrer">Pokaż na mapie ↗</a></article>`;
  }).join('');
}

for (const input of [cityInput, streetInput, nameInput]) {
  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') document.querySelector('#results-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (event.key === 'Escape' && input.value) {
      input.value = '';
      render();
    }
  });
}
document.querySelector('#clear').addEventListener('click', () => {
  cityInput.value = '';
  streetInput.value = '';
  nameInput.value = '';
  cityInput.focus();
  render();
});
document.querySelector('#show-all').addEventListener('click', () => {
  cityInput.value = '';
  streetInput.value = '';
  nameInput.value = '';
  render();
  document.querySelector('#results-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.querySelector('#year').textContent = new Date().getFullYear();

fetch('/api/pharmacies').then((response) => {
  if (!response.ok) throw new Error('Nie udało się pobrać danych');
  return response.json();
}).then((payload) => {
  pharmacies = payload.records || [];
  state.textContent = payload.source === 'live' ? 'Pełny rejestr aptek' : 'Próbka demonstracyjna';
  render();
}).catch(() => {
  state.textContent = 'Błąd wczytywania';
  count.textContent = 'Nie udało się wczytać danych';
  list.innerHTML = '<div class="empty">Uruchom aplikację przez serwer opisany w README. Nie otwieraj pliku HTML bezpośrednio z dysku.</div>';
});
