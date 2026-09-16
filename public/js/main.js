// main.js — wires the form, filter controls, sorting, delete button,
// backend API, and render layer.

const SORT_KEY = 'habitTracker.sort';

const DEFAULT_SORT = {
  field: 'name',
  dir: 'asc',
};

const FILTER_IDS = [
  'filter-category',
  'filter-date-from',
  'filter-date-to',
];

function loadSort() {
  try {
    const stored = JSON.parse(localStorage.getItem(SORT_KEY));

    if (stored && stored.field && stored.dir) {
      return stored;
    }
  } catch (e) {
    // Ignore malformed / unavailable storage.
  }

  return { ...DEFAULT_SORT };
}

function getFilterValues() {
  const [category, dateFrom, dateTo] = FILTER_IDS.map(
    (id) => document.getElementById(id).value
  );

  return {
    category,
    dateFrom,
    dateTo,
  };
}

async function applyFilters() {
  const { category, dateFrom, dateTo } = getFilterValues();

  const all = await getHabits();

  const filtered = filterHabits(
    all,
    category,
    dateFrom,
    dateTo
  );

  const field = document.getElementById('sort-field').value;
  const dir = document.getElementById('sort-dir').value;

  renderHabitList(sortHabits(filtered, field, dir));
}

async function renderSorted() {
  const field = document.getElementById('sort-field').value;
  const dir = document.getElementById('sort-dir').value;

  try {
    localStorage.setItem(
      SORT_KEY,
      JSON.stringify({ field, dir })
    );
  } catch (e) {
    // Ignore storage failures.
  }

  const habits = await getHabits();

  renderHabitList(sortHabits(habits, field, dir));
}

document
  .getElementById('add-habit-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const frequency = document.getElementById('frequency').value;

    await addHabit(name, category, frequency);

    e.target.reset();

    await applyFilters();
  });

FILTER_IDS.forEach((id) => {
  document
    .getElementById(id)
    .addEventListener('change', applyFilters);
});

document
  .getElementById('sort-controls')
  .addEventListener('change', renderSorted);

document
  .getElementById('clear-filters')
  .addEventListener('click', () => {
    FILTER_IDS.forEach((id) => {
      document.getElementById(id).value = '';
    });

    applyFilters();
  });

// Delete button
document
  .getElementById('habit-list-body')
  .addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      deleteHabit(e.target.dataset.id);
      applyFilters();
    }
  });

// Check-in button
document
  .getElementById('habit-list-body')
  .addEventListener('click', async (e) => {
    const btn = e.target.closest('.check-in-btn');

    if (!btn) return;

    checkInHabit(btn.dataset.id);

    await renderSorted();
  });

// Clicking the check-ins header switches to check-in sorting.
document
  .getElementById('sort-checkins-header')
  .addEventListener('click', async () => {
    const fieldEl = document.getElementById('sort-field');
    const dirEl = document.getElementById('sort-dir');

    if (fieldEl.value === 'checkins') {
      dirEl.value = dirEl.value === 'asc' ? 'desc' : 'asc';
    } else {
      fieldEl.value = 'checkins';
      dirEl.value = 'asc';
    }

    await renderSorted();
  });

// Restore saved sorting preferences.
const initialSort = loadSort();

document.getElementById('sort-field').value = initialSort.field;
document.getElementById('sort-dir').value = initialSort.dir;

// Initial render.
applyFilters();