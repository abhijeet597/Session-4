// test-filter.js — tests for filterHabits (js/filter.js)
// Run with: node tests/test-filter.js

const assert = require('assert');
const { filterHabits } = require('../js/filter.js');

// filterHabits compares habit.createdDate with .getTime(), so fixtures use
// real Date objects here (see js/habits.js, which currently stores
// createdDate as a string — that mismatch is a known separate bug).
const habits = [
  { id: 1, name: 'Morning run', category: 'Health', createdDate: new Date('2026-08-01') },
  { id: 2, name: 'Read 20 pages', category: 'Learning', createdDate: new Date('2026-08-02') },
  { id: 3, name: 'Meditate', category: 'Mindfulness', createdDate: new Date('2026-08-03') },
  { id: 4, name: 'Weekly review', category: 'Productivity', createdDate: new Date('2026-08-05') },
  { id: 5, name: 'Stretch', category: 'Health', createdDate: new Date('2026-08-10') },
];

function names(result) {
  return result.map((h) => h.name);
}

function test(description, fn) {
  try {
    fn();
    console.log(`PASS: ${description}`);
  } catch (err) {
    console.error(`FAIL: ${description}`);
    console.error(err);
    process.exitCode = 1;
  }
}

test('no filters returns everything', () => {
  const result = filterHabits(habits, '', null, null);
  assert.deepStrictEqual(names(result), names(habits));
});

test('category alone filters to matching habits', () => {
  const result = filterHabits(habits, 'Health', null, null);
  assert.deepStrictEqual(names(result), ['Morning run', 'Stretch']);
});

test('created-date range alone filters by createdDate bounds', () => {
  const dateFrom = new Date('2026-08-02');
  const dateTo = new Date('2026-08-05');
  const result = filterHabits(habits, '', dateFrom, dateTo);
  assert.deepStrictEqual(names(result), ['Read 20 pages', 'Meditate', 'Weekly review']);
});

test('category and date range combined require both to match', () => {
  const dateFrom = new Date('2026-08-01');
  const dateTo = new Date('2026-08-05');
  const result = filterHabits(habits, 'Health', dateFrom, dateTo);
  // "Stretch" is Health but created 2026-08-10, outside the range — must be excluded.
  assert.deepStrictEqual(names(result), ['Morning run']);
});

test('combination that matches nothing returns an empty array', () => {
  const dateFrom = new Date('2026-08-01');
  const dateTo = new Date('2026-08-05');
  const result = filterHabits(habits, 'Learning', dateFrom, new Date('2026-08-01'));
  assert.deepStrictEqual(result, []);
});
