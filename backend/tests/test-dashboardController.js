const { test, mock, afterEach } = require('node:test');
const assert = require('node:assert');

const Habit = require('../models/Habit');
const { getDashboard } = require('../controllers/dashboardController');

function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    send(data) { this.body = data; return this; },
  };
}

function daysAgoISO(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

afterEach(() => { mock.restoreAll(); });

test('getDashboard returns zeroed metrics for a user with no habits', async () => {
  mock.method(Habit, 'find', async () => []);
  const res = mockRes();
  await getDashboard({ userId: 'u1' }, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.currentStreak, 0);
  assert.strictEqual(res.body.longestStreak, 0);
  assert.strictEqual(res.body.thisWeekCompletionRate, 0);
  assert.deepStrictEqual(res.body.completionsByCategory, {});
});

test('getDashboard returns a streak of 0 for a habit with zero completions', async () => {
  mock.method(Habit, 'find', async () => [
    { category: 'Health', completedDates: [] },
  ]);
  const res = mockRes();
  await getDashboard({ userId: 'u1' }, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.currentStreak, 0);
  assert.strictEqual(res.body.longestStreak, 0);
});

test('getDashboard computes current streak from consecutive days ending today', async () => {
  mock.method(Habit, 'find', async () => [
    { category: 'Health', completedDates: [daysAgoISO(0), daysAgoISO(1), daysAgoISO(2)] },
  ]);
  const res = mockRes();
  await getDashboard({ userId: 'u1' }, res);
  assert.strictEqual(res.body.currentStreak, 3);
});

test('getDashboard computes longest streak even if it is not the current one', async () => {
  mock.method(Habit, 'find', async () => [
    // A 4-day streak far in the past, then a gap, then today only (streak of 1).
    { category: 'Health', completedDates: ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04', daysAgoISO(0)] },
  ]);
  const res = mockRes();
  await getDashboard({ userId: 'u1' }, res);
  assert.strictEqual(res.body.longestStreak, 4);
  assert.strictEqual(res.body.currentStreak, 1);
});

test('getDashboard breaks down completions by category', async () => {
  mock.method(Habit, 'find', async () => [
    { category: 'Health', completedDates: ['2026-01-01', '2026-01-02'] },
    { category: 'Health', completedDates: ['2026-01-03'] },
    { category: 'Learning', completedDates: ['2026-01-01'] },
  ]);
  const res = mockRes();
  await getDashboard({ userId: 'u1' }, res);
  assert.deepStrictEqual(res.body.completionsByCategory, { Health: 3, Learning: 1 });
});

test('getDashboard only reads habits scoped to req.userId', async () => {
  let calledWith;
  mock.method(Habit, 'find', async (query) => { calledWith = query; return []; });
  const res = mockRes();
  await getDashboard({ userId: 'u1' }, res);
  assert.deepStrictEqual(calledWith, { userId: 'u1' });
});
