import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const files = ['src/server.js', 'src/app.js', 'scripts/download_data.js', 'scripts/lint.js', 'tests/download_data.test.js'];
let failed = false;
for (const file of files) {
  const source = await readFile(file, 'utf8');
  if (source.split(/\r?\n/).some((line) => /\s+$/.test(line))) {
    console.error(`${file}: końcowe białe znaki`);
    failed = true;
  }
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`${file}: ${result.stderr.trim()}`);
    failed = true;
  }
}
if (failed) process.exitCode = 1;
else console.log(`Kontrola kodu przeszła dla ${files.length} plików JavaScript.`);
