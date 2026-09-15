// habits.js — in-memory habit data (no backend yet — that comes later)

const CATEGORIES = ['Health', 'Productivity', 'Mindfulness', 'Learning', 'Other'];

let habits = [
  { id: 1, name: 'Morning run', category: 'Health', frequency: 'Daily', createdDate: '2026-08-01', completedDates: ['2026-09-01', '2026-09-02'] },
  { id: 2, name: 'Read 20 pages', category: 'Learning', frequency: 'Daily', createdDate: '2026-08-02', completedDates: ['2026-09-01'] },
  { id: 3, name: 'Meditate', category: 'Mindfulness', frequency: 'Daily', createdDate: '2026-08-03', completedDates: [] },
  { id: 4, name: 'Weekly review', category: 'Productivity', frequency: 'Weekly', createdDate: '2026-08-05', completedDates: ['2026-08-31'] },
];

let nextId = 5;

function addHabit(name, category, frequency) {
  const habit = {
    id: nextId++, name, category, frequency,
    createdDate: new Date().toISOString().slice(0, 10),
    completedDates: [],
  };
  habits.push(habit);
  return habit;
}

function getHabits() {
  return habits;
}

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function checkInHabit(id) {
  const habit = habitList.find((h) => h.id === id);
  if (!habit) return null;
  const today = todayISO();
  if (!habit.completedDates.includes(today)) {
    habit.completedDates.push(today);
  }
  return habit;
}

function sortHabits(list, field, dir) {
  const sorted = [...list].sort((a, b) => {
    if (field === 'checkins') {
      return a.completedDates.length - b.completedDates.length;
    }
    const av = String(a[field]).toLowerCase();
    const bv = String(b[field]).toLowerCase();
    return av.localeCompare(bv);
  });
  return dir === 'desc' ? sorted.reverse() : sorted;
}
