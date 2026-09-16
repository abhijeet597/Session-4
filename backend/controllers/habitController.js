const Habit = require('../models/Habit');

async function getHabits(req, res) {
  const habits = await Habit.find();
  res.json(habits);
}

async function createHabit(req, res) {
  const { name, category, frequency } = req.body;
  if (!name || !category || !frequency) {
    return res.status(400).json({ error: 'name, category, and frequency are all required' });
  }
  const habit = await Habit.create({
    name, category, frequency,
    createdDate: new Date().toISOString().slice(0, 10),
  });
  res.status(201).json(habit);
}

// TODO (this session's continuing work): implement update and delete
async function updateHabit(req, res) {
  res.status(501).json({ error: 'Not implemented yet' });
}

async function deleteHabit(req, res) {
  res.status(501).json({ error: 'Not implemented yet' });
}

module.exports = { getHabits, createHabit, updateHabit, deleteHabit };