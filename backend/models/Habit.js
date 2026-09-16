const mongoose = require('mongoose');

const CATEGORIES = ['Health', 'Productivity', 'Mindfulness', 'Learning', 'Other'];

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: CATEGORIES },
  frequency: { type: String, required: true, enum: ['Daily', 'Weekly'] },
  createdDate: { type: String, required: true },
  completedDates: { type: [String], default: [] },
});

const Habit = mongoose.model('Habit', habitSchema);
Habit.CATEGORIES = CATEGORIES;

module.exports = Habit;