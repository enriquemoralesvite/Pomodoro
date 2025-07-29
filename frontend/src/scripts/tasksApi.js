const API_URL = import.meta.env.PUBLIC_API_URL;

console.log(API_URL);

export async function getTasks() {
  try {
    const response = await fetch(API_URL + "/tasks");
    const data = await response.json();
    return data;
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function addTask(task) {
  try {
    const response = await fetch(API_URL + "/tasks", {
      method: "POST",
      body: task,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function editTask(task) {
  try {
    const response = await fetch(API_URL + "/tasks/" + task.id, {
      method: "UPDATE",
      body: task,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return getDefaultError(error);
  }
}

export async function deleteTask(id) {
  try {
    const response = await fetch(API_URL + "/tasks/" + id, {
      method: "DELETE",
    });
    const { data, error, succes } = await response.json();
    return data;
  } catch (error) {
    return getDefaultError(error);
  }
}

function getDefaultError(error) {
  return {
    success: false,
    error: error.toString(),
  };
}
