// main.js — wires up the form, sorting, and initial render

// TODO: temporary debug comment — remove before commit

const SORT_KEY = 'habitTracker.sort';
const DEFAULT_SORT = { field: 'name', dir: 'asc' };

function loadSort() {
  try {
    const stored = JSON.parse(localStorage.getItem(SORT_KEY));
    if (stored && stored.field && stored.dir) return stored;
  } catch (e) {
    // ignore malformed / unavailable storage
  }
  return { ...DEFAULT_SORT };
}

function applyFilters() {
  const category = document.getElementById('filter-category').value;
  const dateFromValue = document.getElementById('filter-date-from').value;
  const dateToValue = document.getElementById('filter-date-to').value;
  const dateFrom = dateFromValue ? new Date(dateFromValue) : null;
  const dateTo = dateToValue ? new Date(dateToValue) : null;
  const field = document.getElementById('sort-field').value;
  const dir = document.getElementById('sort-dir').value;
  const filtered = filterHabits(getHabits(), category, dateFrom, dateTo);
  renderHabitList(sortHabits(filtered, field, dir));
}

function renderSorted() {
  const field = document.getElementById('sort-field').value;
  const dir = document.getElementById('sort-dir').value;
  try {
    localStorage.setItem(SORT_KEY, JSON.stringify({ field, dir }));
  } catch (e) {
    // ignore storage failures
  }
  renderHabitList(sortHabits(getHabits(), field, dir));
}

document.getElementById('add-habit-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const frequency = document.getElementById('frequency').value;

  addHabit(name, category, frequency);
  renderSorted();
  e.target.reset();
});

document.getElementById('sort-controls').addEventListener('change', renderSorted);

document.getElementById('habit-list-body').addEventListener('click', (e) => {
  const btn = e.target.closest('.check-in-btn');
  if (!btn) return;
  checkInHabit(Number(btn.dataset.id));
  renderSorted();
});

document.getElementById('sort-checkins-header').addEventListener('click', () => {
  const fieldEl = document.getElementById('sort-field');
  const dirEl = document.getElementById('sort-dir');
  if (fieldEl.value === 'checkins') {
    dirEl.value = dirEl.value === 'asc' ? 'desc' : 'asc';
  } else {
    fieldEl.value = 'checkins';
    dirEl.value = 'asc';
  }
  renderSorted();
});

document.getElementById('add-habit-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const category = document.getElementById('category').value;
  const frequency = document.getElementById('frequency').value;

  addHabit(name, category, frequency);
  e.target.reset();
  applyFilters();
});

document.getElementById('filter-category').addEventListener('change', applyFilters);
document.getElementById('filter-date-from').addEventListener('change', applyFilters);
document.getElementById('filter-date-to').addEventListener('change', applyFilters);
document.getElementById('clear-filters').addEventListener('click', () => {
  document.getElementById('filter-category').value = '';
  document.getElementById('filter-date-from').value = '';
  document.getElementById('filter-date-to').value = '';
  applyFilters();
});

applyFilters();

const initialSort = loadSort();
document.getElementById('sort-field').value = initialSort.field;
document.getElementById('sort-dir').value = initialSort.dir;
renderSorted();
