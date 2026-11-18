import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesQuery } from '../src/search.js';

test('wyszukuje miejscowość i ulicę mimo przecinka oraz skrótu „ul.”', () => {
  const record = { name: 'Apteka', street: 'Mostowa 10', city: 'Gdańsk' };
  assert.equal(matchesQuery(record, 'Gdańsk, ul. Mostowa'), true);
});

test('ignoruje polskie znaki diakrytyczne', () => {
  const record = { name: 'Apteka', street: 'Mostowa 10', city: 'Gdańsk' };
  assert.equal(matchesQuery(record, 'gdansk mostowa'), true);
});
