const query = document.querySelector('#query');
const list = document.querySelector('#results-list');
const count = document.querySelector('#result-count');
const area = document.querySelector('#area-label');
const state = document.querySelector('#data-state');
let pharmacies = [];

function fold(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pl').trim();
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function render() {
  const term = fold(query.value);
  const matches = pharmacies.filter((item) => fold(Object.values(item).join(' ')).includes(term));
  count.textContent = `${matches.length.toLocaleString('pl-PL')} ${matches.length === 1 ? 'wynik' : 'wyników'}`;
  area.textContent = term ? `dla „${query.value.trim()}”` : 'w Polsce';
  if (!matches.length) {
    list.innerHTML = '<div class="empty">Nie znaleźliśmy apteki. Sprawdź pisownię albo wpisz samą nazwę miejscowości.</div>';
    return;
  }
  list.innerHTML = matches.slice(0, 100).map((item) => {
    const name = item.name || 'Apteka';
    const address = [item.street, item.postal_code, item.city].filter(Boolean).join(', ') || 'Brak adresu w rejestrze';
    const mapQuery = encodeURIComponent([name, address].join(' '));
    return `<article class="card"><div><h3>${escapeHtml(name)}</h3><div class="address">${escapeHtml(address)}</div>${item.phone ? `<div class="location">☎ ${escapeHtml(item.phone)}</div>` : ''}</div><a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${mapQuery}" target="_blank" rel="noreferrer">Pokaż na mapie ↗</a></article>`;
  }).join('');
}

query.addEventListener('input', render);
document.querySelector('#clear').addEventListener('click', () => { query.value = ''; query.focus(); render(); });
document.querySelector('#show-all').addEventListener('click', () => { query.value = ''; render(); });
document.querySelector('#year').textContent = new Date().getFullYear();

fetch('/api/pharmacies').then((response) => {
  if (!response.ok) throw new Error('Nie udało się pobrać danych');
  return response.json();
}).then((payload) => {
  pharmacies = payload.records || [];
  state.textContent = payload.source === 'live' ? 'Aktualny lokalny rejestr' : 'Próbka demonstracyjna';
  render();
}).catch(() => {
  state.textContent = 'Błąd wczytywania';
  count.textContent = 'Nie udało się wczytać danych';
  list.innerHTML = '<div class="empty">Uruchom aplikację przez serwer opisany w README. Nie otwieraj pliku HTML bezpośrednio z dysku.</div>';
});
