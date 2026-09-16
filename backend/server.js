const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const habitsRouter = require('./routes/habits');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/habits', habitsRouter);
app.use(express.static(path.join(__dirname, '../public')));

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habit-tracker')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;