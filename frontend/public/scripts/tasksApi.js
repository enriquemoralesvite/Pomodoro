const API_BASE = 'https://pomodoro-backend-clan.onrender.com/api';

export async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE}/timer/statistics`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });
    
    if (!response.ok) throw new Error(`Error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
}

export async function getWeeklyStatistics() {
  try {
    const response = await fetch(`${API_BASE}/timer/statistics/weekly`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      credentials: 'include'
    });

    const data = {
      status: response.status,
      ok: response.ok,
      data: await response.json()
    };
    
    console.log("Weekly stats response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching weekly stats:", error);
    throw error;
  }
}