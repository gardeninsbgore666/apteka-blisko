import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from '../scripts/download_data.js';

test('czyta rejestr rozdzielany kreską i usuwa duplikaty ID', () => {
  const input = [
    'identyfikator_apteki|nazwa_apteki|ulica|kod_pocztowy|miejscowość|telefon',
    '1|Apteka A|Długa 1|80-001|Gdańsk|123',
    '1|Apteka A|Długa 1|80-001|Gdańsk|123',
  ].join('\n');
  const result = normalize(input);
  assert.equal(result.length, 1);
  assert.equal(result[0].city, 'Gdańsk');
  assert.equal(result[0].name, 'Apteka A');
});

test('odrzuca nieznany schemat źródła', () => {
  assert.throws(() => normalize('foo|bar\na|b\n'), /Nie rozpoznano kolumn/);
});

test('oddziela nazwę apteki od podmiotu prowadzącego', () => {
  const input = [
    'identyfikator_apteki|nazwa_apteki|nazwa_podmiotu|ulica|miejscowosc',
    '7|Apteka od Serca|Farmacja od Serca Sp. z o.o.|Mostowa 10|Gdańsk',
  ].join('\n');
  const [record] = normalize(input);
  assert.equal(record.name, 'Apteka od Serca');
  assert.equal(record.operator, 'Farmacja od Serca Sp. z o.o.');
});
