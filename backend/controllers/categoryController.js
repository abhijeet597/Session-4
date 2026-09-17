const Category = require('../models/Category');

async function getCategories(req, res) {
  const categories = await Category.find();
  res.json(categories);
}

async function createCategory(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  const existing = await Category.findOne({ name });
  if (existing) {
    return res.status(409).json({ error: 'Category already exists' });
  }
  const category = await Category.create({ name });
  res.status(201).json(category);
}

module.exports = { getCategories, createCategory };
