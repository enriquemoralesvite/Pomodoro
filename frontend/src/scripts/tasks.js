import { deleteTask, editTask } from "./tasksApi";
import * as dialog from "./dialog.js";

export function createTask(task) {
  const { id, title, duration, status } = task;
  const li = document.createElement("li");
  li.id = id;

  li.dataset.id = id;
  li.dataset.title = title;
  li.dataset.duration = duration;
  li.dataset.status = status;

  li.className =
    "group task-item flex justify-between px-2 pb-2 pt-2 hover:bg-white/30 rounded-lg gap-2";
  li.innerHTML = getTaskHtml(title, duration);
  bindSaveTaskAction(li);
  bindEditTaskAction(li);
  bindCancelTaskAction(li);
  bindDeleteTaskAction(li);
  bindUpdateTaskStatus(li);

  return li;
}

function getTaskHtml(title, duration) {
  return `
  <div class="flex items-center gap-3 w-full">
    <input type="checkbox" name="task-check" />
    <div class="flex flex-col w-full">
      <span class="taskTitle line-clamp-2 break-all">${title} </span>
      <input type="text" name="title" class="inputTitle hidden" />

      <span class="taskDurationContainer flex text-xs text-gray-400">0/<span class="taskDuration">${duration}</span>
      <input type="number" name="duration" class="inputDuration hidden" /> 
      min.</span>
    </div>
  </div>

  <!-- Acciones -->
  <div class="task-actions flex gap-2 md:opacity-0 group-hover:opacity-100">
    <button class="btnEdit text-black/80 text-xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 21q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"/></svg>    </button>
    <button class="btnDelete text-black/80 text-xl">
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm3-4q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17"/></svg>
    </button>
    <button class="btnSave text-black/80 hidden text-xl">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.414A2 2 0 0 0 19.414 5L17 2.586A2 2 0 0 0 15.586 2zm10.238 8.793a1 1 0 1 0-1.414-1.414l-4.242 4.243l-1.415-1.415a1 1 0 0 0-1.414 1.414l2.05 2.051a1.1 1.1 0 0 0 1.556 0l4.88-4.879Z"/></g></svg>
    </button>
    <button class="btnCancel text-black/80 hidden text-xl">
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 13.4l2.9 2.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7L13.4 12l2.9-2.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 10.6L9.1 7.7q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l2.9 2.9l-2.9 2.9q-.275.275-.275.7t.275.7t.7.275t.7-.275zm0 8.6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
    </button>
  </div>
    `;
}

function bindSaveTaskAction(element) {
  const { btnSave, inputTitle, inputDuration, taskTitle, taskDuration } =
    getElements(element);

  btnSave.addEventListener("click", async () => {
    const title = inputTitle.value;
    const duration = inputDuration.value;

    // Se pasa el ID por separado y los datos de la tarea en un objeto, como espera la API.
    // Antes se pasaba el objeto `element.dataset` completo, lo que causaba un error.
    const { success, error } = await editTask(element.dataset.id, {
      title,
      duration,
    });
    if (success) {
      element.dataset.title = title;
      element.dataset.duration = duration;
      taskTitle.innerText = title;
      taskDuration.innerText = duration;
      toggleElements(element);
    } else {
      console.log(error);
    }
  });
}

//
function bindEditTaskAction(element) {
  const { btnEdit, inputTitle, inputDuration, taskTitle, taskDuration } =
    getElements(element);

  btnEdit.addEventListener("click", () => {
    inputTitle.value = taskTitle.innerText;
    inputDuration.value = +taskDuration.innerText;
    element.classList.toggle("bg-white/50");
    toggleElements(element);
    inputTitle.focus();
  });
}

function bindDeleteTaskAction(element) {
  const deleteDialogId = "deleteConfirmDialog";
  const btn = element.querySelector(".btnDelete");

  const deleteAction = async () => {
    const { success, error } = await deleteTask(element.dataset.id);

    if (success) {
      element.remove();
    } else {
      console.log(error);
    }
  };

  btn.addEventListener("click", async () => {
    dialog.cancel(deleteDialogId);

    dialog.confirm(deleteDialogId, deleteAction);
    dialog.open(
      deleteDialogId,
      `¿Desea eliminar: "${element.dataset.title}" ?`
    );
  });
}

function bindCancelTaskAction(element) {
  const { btnCancel } = getElements(element);
  btnCancel.addEventListener("click", () => {
    toggleElements(element);
  });
}

function bindUpdateTaskStatus(element) {
  const { checkbox, taskTitle } = getElements(element);
  const styles = ["line-through", "text-gray-500", "italic"];
  const actions = element.querySelector(".task-actions");

  if (element.dataset.status === "completed") {
    checkbox.checked = true;
    taskTitle.classList.add(...styles);
    actions.classList.toggle("invisible");
  }

  checkbox.addEventListener("change", async () => {
    checkbox.disabled = true; // Bloquea el checkbox
    if (checkbox.checked) {
      taskTitle.classList.add(...styles);
      actions.classList.toggle("invisible");
      await editTask(element.dataset.id, { status: "completed" });
    } else {
      taskTitle.classList.remove(...styles);
      actions.classList.toggle("invisible");
      await editTask(element.dataset.id, { status: "pending" });
    }
    checkbox.disabled = false; // Desbloquea el checkbox
  });
}

function getElements(element) {
  const taskTitle = element.querySelector(".taskTitle");
  const taskDuration = element.querySelector(".taskDuration");

  const inputTitle = element.querySelector(".inputTitle");
  const inputDuration = element.querySelector(".inputDuration");

  const btnEdit = element.querySelector(".btnEdit");
  const btnDelete = element.querySelector(".btnDelete");
  const btnSave = element.querySelector(".btnSave");
  const btnCancel = element.querySelector(".btnCancel");

  const checkbox = element.querySelector('input[name="task-check"]');

  return {
    taskTitle,
    taskDuration,
    inputTitle,
    inputDuration,
    btnEdit,
    btnDelete,
    btnSave,
    btnCancel,
    checkbox,
  };
}

function toggleElements(element) {
  element.classList.toggle("bg-white/50");

  const elements = getElements(element);

  Object.values(elements).forEach((el) => el.classList.toggle("hidden"));
}
