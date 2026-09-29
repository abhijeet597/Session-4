// main.js — wires the form, filter controls, sorting, delete button,
// backend API, and render layer.

const SORT_KEY = 'habitTracker.sort';

function logout() {
  clearToken();
  window.location.href = 'login.html';
}

// Categories fix: fetches categories and fills both the add-habit and filter dropdowns.
async function refreshCategoryOptions() {
  const categories = await getCategories();
  renderCategoryOptions(document.getElementById('category'), categories);
  renderCategoryOptions(document.getElementById('filter-category'), categories, { includeAllOption: true });
}

async function refreshDashboard() {
  const data = await getDashboard();

  document.getElementById('dash-current-streak').textContent = data.currentStreak ?? '—';
  document.getElementById('dash-longest-streak').textContent = data.longestStreak ?? '—';

  const rate = data.thisWeekCompletionRate;
  document.getElementById('dash-week-rate').textContent =
    rate != null ? Math.round(rate * 100) + '%' : '—';

  const byCategory = document.getElementById('dash-by-category');
  byCategory.innerHTML = '';
  const entries = Object.entries(data.completionsByCategory || {});
  if (entries.length === 0) {
    byCategory.textContent = '—';
  } else {
    entries.forEach(([cat, count]) => {
      const row = document.createElement('div');
      row.className = 'stat-category-row';
      row.innerHTML = `<span>${cat}</span><span class="stat-category-count">${count}</span>`;
      byCategory.appendChild(row);
    });
  }
}

async function initApp() {
  const initialSort = loadSort();
  document.getElementById('sort-field').value = initialSort.field;
  document.getElementById('sort-dir').value = initialSort.dir;

  // Categories fix: populate dropdowns before rendering habits.
  await refreshCategoryOptions();
  await applyFilters();
  await refreshDashboard();
}

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

// Show the day-of-week or day-of-month field depending on frequency.
document
  .getElementById('frequency')
  .addEventListener('change', (e) => {
    document.getElementById('day-of-week-field').hidden = e.target.value !== 'Weekly';
    document.getElementById('day-of-month-field').hidden = e.target.value !== 'Monthly';
  });

// Add habbit
document
  .getElementById('add-habit-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const frequency = document.getElementById('frequency').value;
    const dayOfWeek = frequency === 'Weekly'
      ? Number(document.getElementById('day-of-week').value)
      : undefined;
    const dayOfMonth = frequency === 'Monthly'
      ? Number(document.getElementById('day-of-month').value)
      : undefined;

    await addHabit(name, category, frequency, dayOfMonth, dayOfWeek);

    e.target.reset();
    document.getElementById('day-of-week-field').hidden = true;
    document.getElementById('day-of-month-field').hidden = true;

    await applyFilters();
    await refreshDashboard();
  });

FILTER_IDS.forEach((id) => {
  document
    .getElementById(id)
    .addEventListener('change', applyFilters);
});

// Categories fix: handles the new add-category form, then refreshes both dropdowns.
document
  .getElementById('add-category-form')
  .addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('category-name').value;

    await addCategory(name);

    e.target.reset();

    await refreshCategoryOptions();
  });

// Sorting
document
  .getElementById('sort-controls')
  .addEventListener('change', renderSorted);

// Clear Filters
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
  .addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      await deleteHabit(e.target.dataset.id);
      await applyFilters();
    }
  });

// Edit button
document
  .getElementById('habit-list-body')
  .addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const id = e.target.dataset.id;

      const frequency = prompt(
        'Enter new frequency (Daily or Weekly):'
      );

      if (frequency !== 'Daily' && frequency !== 'Weekly') {
        return;
      }

      await updateHabit(id, frequency);

      await applyFilters();
    }
  });

  // Check-in button
document
  .getElementById('habit-list-body')
  .addEventListener('click', async (e) => {
    const btn = e.target.closest('.check-in-btn');

    if (!btn) return;

    await checkInHabit(btn.dataset.id);

    await renderSorted();
    await refreshDashboard();
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

// Logout button
document
  .getElementById('logout-btn')
  .addEventListener('click', logout);

// index.html is the authenticated app — redirect to the login page if
// there's no token, instead of showing/hiding an in-page auth view.
if (getToken()) {
  initApp();
} else {
  window.location.href = 'login.html';
}