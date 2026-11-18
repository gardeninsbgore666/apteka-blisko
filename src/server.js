import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, '..');
const samplePath = path.join(root, 'data', 'sample_pharmacies.csv');
const livePath = path.join(projectRoot, 'data', 'pharmacies.csv');
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.csv': 'text/csv; charset=utf-8' };

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') { value += '"'; index += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(value); value = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(value); value = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else value += char;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const [headers, ...records] = rows;
  return records.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])));
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    if (pathname === '/api/pharmacies') {
      let dataPath = samplePath;
      try { await stat(livePath); dataPath = livePath; } catch { /* use sample in demo */ }
      const content = (await readFile(dataPath, 'utf8')).replace(/^\uFEFF/, '');
      const records = parseCsv(content);
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
      response.end(JSON.stringify({ source: dataPath === livePath ? 'live' : 'sample', records }));
      return;
    }
    const relative = pathname === '/' ? 'index.html' : decodeURIComponent(pathname.slice(1));
    const target = path.resolve(root, relative);
    if (!target.startsWith(`${root}${path.sep}`)) { response.writeHead(403); response.end('Forbidden'); return; }
    const body = await readFile(target);
    response.writeHead(200, { 'content-type': contentTypes[path.extname(target)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Nie znaleziono zasobu.');
  }
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '0.0.0.0', () => console.log(`Apteka Blisko działa pod http://localhost:${port}`));
