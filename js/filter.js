// filter.js — pure filtering logic, kept separate from the DOM so it can be tested directly

// function filterHabits(habits, category, dateFrom, dateTo) {
//   return habits.filter((habit) => {
//     const matchesCategory = !category || habit.category === category;
//     const createdDate = new Date(habit.createdDate);
//     const afterFrom = !dateFrom || createdDate.getTime() >= dateFrom.getTime();
//     const beforeTo = !dateTo || createdDate.getTime() <= dateTo.getTime();
//     return matchesCategory && afterFrom && beforeTo;
//   });
// }

function filterHabits(habits, category, dateFrom, dateTo) {
  return habits.filter((habit) => {
    const matchesCategory = !category || habit.category === category;
    const afterFrom = !dateFrom || habit.createdDate.getTime() >= dateFrom.getTime();
    const beforeTo = !dateTo || habit.createdDate.getTime() <= dateTo.getTime();
    return matchesCategory && afterFrom && beforeTo;
  });
}


// Works as a plain browser global (loaded via <script>) and as a Node module (for tests)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterHabits };
}