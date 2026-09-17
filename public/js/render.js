// render.js — turns the habits array into table rows in the DOM
// MongoDB documents use _id, not id.

function renderHabitList(list) {
  const tbody = document.getElementById('habit-list-body');
  tbody.innerHTML = '';

  const today = todayISO();

  list.forEach((habit) => {
    const done = habit.completedDates.includes(today);
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${habit.name}</td>
      <td>${habit.category}</td>
      <td>${habit.frequency}</td>
      <td>${habit.completedDates.length} check-ins</td>
      <td>
        <button
          type="button"
          class="check-in-btn"
          data-id="${habit._id}"
          ${done ? 'disabled' : ''}
        >
          ${done ? 'Checked in ✓' : 'Check in today'}
        </button>
        // <button
        //   type="button"
        //   class="delete-btn"
        //   data-id="${habit._id}"
        // >
        //   Delete
        // </button>

        <button
          type="button"
          class="edit-btn"
          data-id="${habit._id}"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-btn"
          data-id="${habit._id}"
        >
          Delete
        </button>

      </td>
    `;

    tbody.appendChild(row);
  });

  if (list.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5">No habits match these filters.</td>';
    tbody.appendChild(row);
  }
}