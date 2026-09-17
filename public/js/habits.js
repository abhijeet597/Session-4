// habits.js — getHabits and addHabit now talk to the backend API.
// deleteHabit below is intentionally unchanged from the in-memory version.
// It still mutates a local array instead of deleting from the backend.
// This is the bug students are expected to find in this session.

const API_BASE = '/api/habits';

// Stale local cache — leftover from the pre-backend version.
// getHabits() populates it, but deleteHabit() incorrectly operates on it.
let localHabitsCache = [];

async function getHabits() {
  const res = await fetch(API_BASE);
  const data = await res.json();

  localHabitsCache = data;
  return data;
}

async function addHabit(name, category, frequency) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      category,
      frequency,
    }),
  });

  return res.json();
}

// Intentionally unchanged from the previous in-memory implementation.
// BUG: This only removes the habit from the local cache.
// It does NOT send a DELETE request to the backend.
// function deleteHabit(id) {
//   const index = localHabitsCache.findIndex(
//     (habit) => habit._id === id
//   );

//   if (index === -1) return false;

//   localHabitsCache.splice(index, 1);
//   return true;
// }

async function deleteHabit(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to delete habit');
  }

  return true;
}