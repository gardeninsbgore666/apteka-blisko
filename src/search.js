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
