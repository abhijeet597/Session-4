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
  const { id } = req.params;
  const updated = await Habit.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  if (!updated) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  res.json(updated);
}

async function deleteHabit(req, res) {
  const { id } = req.params;
  const deleted = await Habit.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  res.status(204).send();
}


module.exports = { getHabits, createHabit, updateHabit, deleteHabit };