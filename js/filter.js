// filter.js — pure filtering logic, kept separate from the DOM so it can be tested directly

function filterHabits(habits, category, dateFrom, dateTo) {
  return habits.filter((habit) => {
    const matchesCategory = !category || habit.category === category;
    const afterFrom = !dateFrom || habit.createdDate >= dateFrom;
    const beforeTo = !dateTo || habit.createdDate <= dateTo;
    return matchesCategory && afterFrom && beforeTo;
  });
}

// Works as a plain browser global (loaded via <script>) and as a Node module (for tests)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterHabits };
}