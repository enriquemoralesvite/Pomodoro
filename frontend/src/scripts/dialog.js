export function open(dialogId, message) {
  const dialog = document.getElementById(dialogId);
  if (message) {
    const textMessage = document.getElementById(dialogId + "-message");
    textMessage.innerText = message;
  }
  dialog.showModal();
}

export function cancel(dialogId) {
  const dialog = document.getElementById(dialogId);
  const cancelButton = document.getElementById(dialogId + "-cancel");

  const handleCancel = () => {
    dialog.close();
    cancelButton.removeEventListener("click", handleCancel);
  };

  // Form cancel button closes the dialog box
  cancelButton.addEventListener("click", handleCancel);
}

export function confirm(dialogId, action) {
  const dialog = document.getElementById(dialogId);
  const confirmButton = document.getElementById(dialogId + "-confirm");
  const handleClick = async () => {
    await action();
    dialog.close();
    confirmButton.removeEventListener("click", handleClick);
  };
  confirmButton.addEventListener("click", handleClick);
}
