import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesFilters, matchesQuery } from '../src/search.js';

test('wyszukuje miejscowość i ulicę mimo przecinka oraz skrótu „ul.”', () => {
  const record = { name: 'Apteka', street: 'Mostowa 10', city: 'Gdańsk' };
  assert.equal(matchesQuery(record, 'Gdańsk, ul. Mostowa'), true);
});

test('ignoruje polskie znaki diakrytyczne', () => {
  const record = { name: 'Apteka', street: 'Mostowa 10', city: 'Gdańsk' };
  assert.equal(matchesQuery(record, 'gdansk mostowa'), true);
});

test('filtruje osobno po mieście i ulicy', () => {
  const record = { name: 'Apteka od Serca', street: 'Mostowa 10', city: 'Gdańsk' };
  assert.equal(matchesFilters(record, { city: 'Gdansk', street: 'ul. Mostowa', name: '' }), true);
  assert.equal(matchesFilters(record, { city: 'Gdańsk', street: 'Długa', name: '' }), false);
});
