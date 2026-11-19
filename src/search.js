const ignoredStreetWords = new Set(['ul', 'ulica', 'al', 'aleja', 'pl', 'plac', 'os', 'osiedle']);

function fold(value) {
  return String(value ?? '')
    .toLowerCase()
    .replaceAll('ł', 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function matchesQuery(record, query) {
  const terms = fold(query).split(/[^a-z0-9]+/).filter((term) => term && !ignoredStreetWords.has(term));
  if (terms.length === 0) return true;
  const searchable = fold(Object.values(record).join(' '));
  return terms.every((term) => searchable.includes(term));
}

export function matchesFilters(record, filters) {
  const cityTerms = fold(filters.city).split(/[^a-z0-9]+/).filter(Boolean);
  const streetTerms = fold(filters.street).split(/[^a-z0-9]+/).filter((term) => term && !ignoredStreetWords.has(term));
  const nameTerms = fold(filters.name).split(/[^a-z0-9]+/).filter(Boolean);
  const city = fold(record.city);
  const street = fold(record.street);
  const name = fold(record.name);
  return cityTerms.every((term) => city.includes(term))
    && streetTerms.every((term) => street.includes(term))
    && nameTerms.every((term) => name.includes(term));
}
