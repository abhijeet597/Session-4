// test-filter.js — tests for filterHabits (js/filter.js)
// Run with: node --test tests/test-filter.js

const test = require('node:test');
const assert = require('node:assert');
const { filterHabits } = require('../js/filter.js');

// createdDate fixtures use 'YYYY-MM-DD' strings to match how habits.js
// actually stores them.
const habits = [
  { id: 1, name: 'Morning run', category: 'Health', createdDate: '2026-08-01' },
  { id: 2, name: 'Read 20 pages', category: 'Learning', createdDate: '2026-08-02' },
  { id: 3, name: 'Meditate', category: 'Mindfulness', createdDate: '2026-08-03' },
  { id: 4, name: 'Weekly review', category: 'Productivity', createdDate: '2026-08-05' },
  { id: 5, name: 'Stretch', category: 'Health', createdDate: '2026-08-10' },
];

function names(result) {
  return result.map((h) => h.name);
}

test('no filters returns all habits', () => {
  const result = filterHabits(habits, '', null, null);
  assert.deepStrictEqual(names(result), names(habits));
});

test('category filter alone returns only matching category', () => {
  const result = filterHabits(habits, 'Health', null, null);
  assert.deepStrictEqual(names(result), ['Morning run', 'Stretch']);
});

test('created-date range filter alone returns only habits in range', () => {
  const dateFrom = new Date('2026-08-02');
  const dateTo = new Date('2026-08-05');
  const result = filterHabits(habits, '', dateFrom, dateTo);
  assert.deepStrictEqual(names(result), ['Read 20 pages', 'Meditate', 'Weekly review']);
});

test('category AND date range combine (not OR)', () => {
  const dateFrom = new Date('2026-08-01');
  const dateTo = new Date('2026-08-05');
  const result = filterHabits(habits, 'Health', dateFrom, dateTo);
  // "Stretch" is Health but created 2026-08-10, outside the range — must be excluded.
  assert.deepStrictEqual(names(result), ['Morning run']);
});

test('filters that match nothing return an empty array', () => {
  const dateFrom = new Date('2026-08-01');
  const dateTo = new Date('2026-08-01');
  const result = filterHabits(habits, 'Learning', dateFrom, dateTo);
  assert.deepStrictEqual(result, []);
});
