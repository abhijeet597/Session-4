const { test, mock, afterEach } = require('node:test');
const assert = require('node:assert');

const Habit = require('../models/Habit');
const { getHabits, createHabit, updateHabit, deleteHabit } = require('../controllers/habitController');

function mockRes() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    send(data) { this.body = data; return this; },
  };
}

afterEach(() => { mock.restoreAll(); });

test('getHabits returns all habits as JSON', async () => {
  mock.method(Habit, 'find', async () => [{ _id: '1', name: 'Morning run', category: 'Health', frequency: 'Daily' }]);
  const res = mockRes();
  await getHabits({}, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.length, 1);
});

test('createHabit rejects a request missing required fields', async () => {
  const res = mockRes();
  await createHabit({ body: { name: 'Meditate' } }, res);
  assert.strictEqual(res.statusCode, 400);
});

test('createHabit creates and returns the habit with 201', async () => {
  mock.method(Habit, 'create', async (data) => ({ _id: 'new-id', ...data }));
  const res = mockRes();
  await createHabit({ body: { name: 'Meditate', category: 'Mindfulness', frequency: 'Daily' } }, res);
  assert.strictEqual(res.statusCode, 201);
});

test('updateHabit returns 404 for a non-existent id', async () => {
  mock.method(Habit, 'findByIdAndUpdate', async () => null);
  const res = mockRes();
  await updateHabit({ params: { id: 'x' }, body: { frequency: 'Weekly' } }, res);
  assert.strictEqual(res.statusCode, 404);
});

test('updateHabit returns the updated document on success', async () => {
  mock.method(Habit, 'findByIdAndUpdate', async (id, body) => ({ _id: id, frequency: body.frequency }));
  const res = mockRes();
  await updateHabit({ params: { id: '1' }, body: { frequency: 'Weekly' } }, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.frequency, 'Weekly');
});

test('deleteHabit returns 404 for a non-existent id', async () => {
  mock.method(Habit, 'findByIdAndDelete', async () => null);
  const res = mockRes();
  await deleteHabit({ params: { id: 'x' } }, res);
  assert.strictEqual(res.statusCode, 404);
});

test('deleteHabit returns 204 on success', async () => {
  mock.method(Habit, 'findByIdAndDelete', async (id) => ({ _id: id }));
  const res = mockRes();
  await deleteHabit({ params: { id: '1' } }, res);
  assert.strictEqual(res.statusCode, 204);
});