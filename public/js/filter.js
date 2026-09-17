// filter.js — pure filtering logic, kept separate from the DOM so it can be tested directly

function filterHabits(habits, category, dateFrom, dateTo) {
  return habits.filter((habit) => {
    const matchesCategory = !category || habit.category === category;
    let afterFrom = true;
    let beforeTo = true;
    try {
      afterFrom = !dateFrom || habit.createdDate.getTime() >= dateFrom.getTime();
      beforeTo = !dateTo || habit.createdDate.getTime() <= dateTo.getTime();
    } catch (e) {
      afterFrom = false;
      beforeTo = false;
    }
    return matchesCategory && afterFrom && beforeTo;
  });
}


function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function sortHabits(list, field, dir) {
  const sorted = [...list].sort((a, b) => {
    let valA;
    let valB;

    if (field === 'checkins') {
      valA = a.completedDates.length;
      valB = b.completedDates.length;
    } else {
      valA = a[field];
      valB = b[field];
    }

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });

  if (dir === 'desc') sorted.reverse();

  return sorted;
}

// Works as a plain browser global (loaded via <script>) and as a Node module (for tests)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { filterHabits, sortHabits, todayISO };
}