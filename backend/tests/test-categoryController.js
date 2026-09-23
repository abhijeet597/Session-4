const { test, mock, afterEach } = require('node:test');
const assert = require('node:assert');

const Category = require('../models/Category');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');

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

test('getCategories returns all categories', async () => {
  mock.method(Category, 'find', async () => [{ _id: '1', name: 'Health' }]);
  const res = mockRes();
  await getCategories({}, res);
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.length, 1);
});

test('getCategories queries with no filter — categories are shared across all users', async () => {
  let calledWith;
  mock.method(Category, 'find', async (query) => { calledWith = query; return []; });
  const res = mockRes();
  await getCategories({ userId: 'user-1' }, res);
  assert.strictEqual(calledWith, undefined);
});

test('createCategory rejects a request with no name', async () => {
  const res = mockRes();
  await createCategory({ body: {} }, res);
  assert.strictEqual(res.statusCode, 400);
});

test('createCategory rejects a duplicate name', async () => {
  mock.method(Category, 'findOne', async () => ({ _id: '1', name: 'Health' }));
  const res = mockRes();
  await createCategory({ body: { name: 'Health' } }, res);
  assert.strictEqual(res.statusCode, 409);
});

test('createCategory creates a new category', async () => {
  mock.method(Category, 'findOne', async () => null);
  mock.method(Category, 'create', async (data) => ({ _id: 'new-id', ...data }));
  const res = mockRes();
  await createCategory({ body: { name: 'Travel' } }, res);
  assert.strictEqual(res.statusCode, 201);
});

test('deleteCategory returns 404 for a non-existent id', async () => {
  mock.method(Category, 'findByIdAndDelete', async () => null);
  const res = mockRes();
  await deleteCategory({ params: { id: 'x' } }, res);
  assert.strictEqual(res.statusCode, 404);
});

test('deleteCategory returns 204 on success', async () => {
  mock.method(Category, 'findByIdAndDelete', async (id) => ({ _id: id }));
  const res = mockRes();
  await deleteCategory({ params: { id: '1' } }, res);
  assert.strictEqual(res.statusCode, 204);
});
