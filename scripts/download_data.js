import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const API_URL = 'https://api.dane.gov.pl/1.4/resources/56869';
const CURRENT_CSV_URL = 'https://rejestry.ezdrowie.gov.pl/api/ra/filegenerator/getcsv';
const LEGACY_CSV_URL = 'https://rejestry.ezdrowie.gov.pl/api/filegenerator/getcsv';
export const FIELDS = ['name', 'street', 'postal_code', 'city', 'phone'];
const aliases = {
  name: ['nazwa_apteki', 'nazwa', 'nazwa_podmiotu', 'nazwapodmiotu'],
  street: ['ulica', 'adres', 'adres_apteki', 'adres_podmiotu'],
  postal_code: ['kod_pocztowy', 'kodpocztowy', 'poczta_kod'],
  city: ['miejscowosc', 'miasto', 'miejscowosc_apteki'],
  phone: ['telefon', 'telefon_apteki', 'numer_telefonu'],
  id: ['identyfikator_apteki', 'id_apteki', 'id'],
};

function key(value) {
  return value.replace(/^\uFEFF/, '').toLowerCase().replaceAll('ł', 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

export function parseDelimited(text, delimiter = '|') {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) { row.push(value); value = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(value); value = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else value += char;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}

export function normalize(source) {
  const [headers, ...rows] = parseDelimited(source.replace(/^\uFEFF/, ''));
  if (!headers?.length) throw new Error('Pobrany plik nie zawiera nagłówków CSV.');
  const columns = new Map(headers.map((name, index) => [key(name), index]));
  const selected = {};
  for (const [field, options] of Object.entries(aliases)) {
    const match = options.map(key).find((option) => columns.has(option));
    if (match) selected[field] = columns.get(match);
  }
  if (!['name', 'street', 'city'].some((field) => selected[field] !== undefined)) {
    throw new Error('Nie rozpoznano kolumn rejestru; format źródła mógł ulec zmianie.');
  }
  const seen = new Set();
  const result = [];
  for (const row of rows) {
    const record = Object.fromEntries(FIELDS.map((field) => [field, (row[selected[field]] || '').trim()]));
    if (!Object.values(record).some(Boolean)) continue;
    const identity = (row[selected.id] || '').trim();
    const fingerprint = identity || Object.values(record).join('|').toLocaleLowerCase('pl');
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    result.push(record);
  }
  return result;
}

function csvCell(value) { return `"${String(value).replaceAll('"', '""')}"`; }

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const destination = path.join(root, 'data', 'pharmacies.csv');
  const requestHeaders = { 'user-agent': 'AptekaBlisko/1.0 (open data project)' };
  const downloadUrls = [];
  const errors = [];
  try {
    try {
      const metadataResponse = await fetch(API_URL, {
        signal: AbortSignal.timeout(30_000),
        headers: { ...requestHeaders, accept: 'application/vnd.api+json' },
      });
      if (!metadataResponse.ok) throw new Error(`HTTP ${metadataResponse.status}`);
      const metadata = await metadataResponse.json();
      const attributes = metadata.data?.attributes || {};
      for (const candidate of [attributes.download_url, attributes.downloadUrl, attributes.download_link, attributes.file_url, attributes.link, attributes.url]) {
        if (typeof candidate === 'string' && candidate.trim()) downloadUrls.push(new URL(candidate, API_URL).href);
      }
      const links = metadata.data?.links || {};
      for (const candidate of [links.download, links.related, links.self]) {
        if (typeof candidate === 'string' && candidate.trim()) downloadUrls.push(new URL(candidate, API_URL).href);
        else if (candidate && typeof candidate.href === 'string') downloadUrls.push(new URL(candidate.href, API_URL).href);
      }
      if (downloadUrls.length === 0) errors.push('API dane.gov.pl nie zwróciło rozpoznanego linku do pliku.');
    } catch (error) {
      errors.push(`Metadane dane.gov.pl: ${error.message}`);
    }

    downloadUrls.push(CURRENT_CSV_URL, LEGACY_CSV_URL);
    for (const url of [...new Set(downloadUrls)]) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(90_000), headers: requestHeaders });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const records = normalize(await response.text());
        if (records.length === 0) throw new Error('plik nie zawiera rozpoznanych rekordów aptek');
        await mkdir(path.dirname(destination), { recursive: true });
        const output = [FIELDS.join(','), ...records.map((record) => FIELDS.map((field) => csvCell(record[field])).join(','))].join('\n');
        await writeFile(destination, `${output}\n`, 'utf8');
        console.log(`Źródło: ${url}`);
        console.log(`Zapisano ${records.length.toLocaleString('pl-PL')} rekordów do data/pharmacies.csv`);
        return;
      } catch (error) {
        errors.push(`${url}: ${error.message}`);
      }
    }
    throw new Error(errors.join(' | ') || 'Nie znaleziono działającego źródła rejestru.');
  } catch (error) {
    console.error(`Nie udało się przygotować rejestru: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
