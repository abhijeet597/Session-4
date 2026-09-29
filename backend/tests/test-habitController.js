const { test, mock, afterEach } = require('node:test');
const assert = require('node:assert');

const Habit = require('../models/Habit');
const Category = require('../models/Category');
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
  await getHabits({ userId: 'user-1' }, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.length, 1);
});

test('getHabits only returns habits for req.userId', async () => {
  let calledWith;
  mock.method(Habit, 'find', async (query) => { calledWith = query; return []; });
  const res = mockRes();
  await getHabits({ userId: 'user-1' }, res);
  assert.deepStrictEqual(calledWith, { userId: 'user-1' });
});

test('createHabit rejects a request missing required fields', async () => {
  const res = mockRes();
  await createHabit({ userId: 'user-1', body: { name: 'Meditate' } }, res);
  assert.strictEqual(res.statusCode, 400);
});

test('createHabit creates and returns the habit with 201', async () => {
  mock.method(Category, 'findOne', async () => ({ _id: '1', name: 'Mindfulness' }));
  mock.method(Habit, 'create', async (data) => ({ _id: 'new-id', ...data }));
  const res = mockRes();
  await createHabit({ userId: 'user-1', body: { name: 'Meditate', category: 'Mindfulness', frequency: 'Daily' } }, res);
  assert.strictEqual(res.statusCode, 201);
});

test('createHabit accepts a Weekly habit with dayOfWeek 0 (Sunday)', async () => {
  mock.method(Category, 'findOne', async () => ({ _id: '1', name: 'Health' }));
  mock.method(Habit, 'create', async (data) => ({ _id: 'new-id', ...data }));
  const res = mockRes();
  await createHabit({ userId: 'user-1', body: { name: 'Rest day', category: 'Health', frequency: 'Weekly', dayOfWeek: 0 } }, res);
  assert.strictEqual(res.statusCode, 201);
});

test('createHabit attaches req.userId to the new habit', async () => {
  mock.method(Category, 'findOne', async () => ({ _id: '1', name: 'Mindfulness' }));
  let calledWith;
  mock.method(Habit, 'create', async (data) => { calledWith = data; return { _id: 'new-id', ...data }; });
  const res = mockRes();
  await createHabit({ userId: 'user-1', body: { name: 'Meditate', category: 'Mindfulness', frequency: 'Daily' } }, res);
  assert.strictEqual(calledWith.userId, 'user-1');
});

test('updateHabit passes req.body through to the database unchanged', async () => {
  let bodyPassedToDb;
  mock.method(Habit, 'findOneAndUpdate', async (query, body) => {
    bodyPassedToDb = body;
    return { _id: query._id, ...body };
  });
  const res = mockRes();
  const updates = { frequency: 'Weekly', name: 'New name' };
  await updateHabit({ userId: 'user-1', params: { id: '1' }, body: updates }, res);
  assert.deepStrictEqual(bodyPassedToDb, updates);
});

test('updateHabit returns 404 for a non-existent id', async () => {
  mock.method(Habit, 'findOneAndUpdate', async () => null);
  const res = mockRes();
  await updateHabit({ userId: 'user-1', params: { id: 'x' }, body: { frequency: 'Weekly' } }, res);
  assert.strictEqual(res.statusCode, 404);
});

test('updateHabit returns 404 if the habit belongs to a different user', async () => {
  mock.method(Habit, 'findOneAndUpdate', async () => null);
  const res = mockRes();
  await updateHabit({ userId: 'user-2', params: { id: '1' }, body: { frequency: 'Weekly' } }, res);
  assert.strictEqual(res.statusCode, 404);
});

test('updateHabit only matches a habit owned by req.userId', async () => {
  let calledWith;
  mock.method(Habit, 'findOneAndUpdate', async (query, body) => {
    calledWith = query;
    return { _id: query._id, frequency: body.frequency };
  });
  const res = mockRes();
  await updateHabit({ userId: 'user-1', params: { id: '1' }, body: { frequency: 'Weekly' } }, res);
  assert.deepStrictEqual(calledWith, { _id: '1', userId: 'user-1' });
});

test('updateHabit returns the updated document on success', async () => {
  mock.method(Habit, 'findOneAndUpdate', async (query, body) => ({ _id: query._id, frequency: body.frequency }));
  const res = mockRes();
  await updateHabit({ userId: 'user-1', params: { id: '1' }, body: { frequency: 'Weekly' } }, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.frequency, 'Weekly');
});

test('deleteHabit returns 404 for a non-existent id', async () => {
  mock.method(Habit, 'findOneAndDelete', async () => null);
  const res = mockRes();
  await deleteHabit({ userId: 'user-1', params: { id: 'x' } }, res);
  assert.strictEqual(res.statusCode, 404);
});

test('deleteHabit only matches a habit owned by req.userId', async () => {
  let calledWith;
  mock.method(Habit, 'findOneAndDelete', async (query) => {
    calledWith = query;
    return { _id: query._id };
  });
  const res = mockRes();
  await deleteHabit({ userId: 'user-1', params: { id: '1' } }, res);
  assert.deepStrictEqual(calledWith, { _id: '1', userId: 'user-1' });
});

test('deleteHabit returns 204 on success', async () => {
  mock.method(Habit, 'findOneAndDelete', async (query) => ({ _id: query._id }));
  const res = mockRes();
  await deleteHabit({ userId: 'user-1', params: { id: '1' } }, res);
  assert.strictEqual(res.statusCode, 204);
});
