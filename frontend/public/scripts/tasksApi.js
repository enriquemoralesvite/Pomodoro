const API_BASE = 'https://pomodoro-backend-clan.onrender.com/api';

export async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE}/timer/statistics`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      credentials: 'include'
    });
    const json = await response.json().catch(() => ({}));
    // Normaliza: si backend responde { success: true, data: { ... } }
    // devolvemos directamente el objeto interno para que cliente haga stats.pomodorosCompleted
    const data = json?.data ?? json;
    return { data, success: response.ok };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return { data: {}, success: false, error: error.message };
  }
}


export async function getWeeklyStatistics() {
  try {
    const response = await fetch(`${API_BASE}/timer/statistics/weekly`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      credentials: 'include'
    });
    const json = await response.json().catch(() => ({}));
    const rows = Array.isArray(json?.data) ? json.data : json;
    return { data: rows, success: response.ok };
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    return { data: [], success: false, error: error.message };
  }
}

export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE}/tasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const result = await response.json();
    return { data: result.data || [], success: true };
  } catch (error) {
    return { data: [], success: false, error: error.message };
  }
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  return await response.json();
}

export async function editTask(taskId, updates) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  return await response.json();
}

export async function addTask(task) {
  try {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}
