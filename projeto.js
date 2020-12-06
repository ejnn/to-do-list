const resizeElement = (element) => {
  // Textareas need to be reset to shrink.
  element.style.height = 0;
  element.style.height = element.scrollHeight + "px";
};

var itemBeingDragged;

// Input: an object describing the item to be appended.
// Output: the item appended.
const appendListItem = ({ checked, text }) => {
  const list = document.getElementById("list");

  var item = document.createElement("li");
  const removeItem = () => item.remove();

  var dragHandle = document.createElement("img");
  dragHandle.className = "drag-handle";
  dragHandle.src = "images/blackCircleEmoji.svg";
  dragHandle.alt = "Drag handle.";
  dragHandle.draggable = false;

  dragHandle.addEventListener("mousedown", (event) => {
    item.setAttribute("draggable", "true");
    itemBeingDragged = item;
  });

  item.addEventListener("dragstart", (event) => {
    var transparentPixel = new Image(1, 1);

    transparentPixel.src =
      "data:image/png;base64,Qk2OAAAAAAAAAIoAAAB8AAAAAQAAAAEAAAABACAAAwAAAAQAAAAjLgAAIy4AAAAAAAAAAAAAAAD/AAD/AAD/AAAAAAAA/0JHUnMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA////AA==";

    // Even though it's a transparent pixel,
    // some browsers still draw a frame around
    // the drag image. Sigh.
    // Since I don't want a drag image,
    // I placed a high x and y offset (9999).
    event.dataTransfer.setDragImage(transparentPixel, 9999, 9999);
    event.dataTransfer.dropEffect = "move";
  });

  item.addEventListener("dragover", (event) => {
    // So the drop visually happens.
    event.preventDefault();

    if (itemBeingDragged == item) {
      return;
    }

    const itemRectangle = item.getBoundingClientRect();
    const itemMidHeight = itemRectangle.top + itemRectangle.height / 2;

    if (event.clientY < itemMidHeight) {
      if (itemBeingDragged != item.previousSibling) {
        list.insertBefore(itemBeingDragged, item);
      }
    } else if (itemBeingDragged != item.nextSibling) {
      list.insertBefore(itemBeingDragged, item.nextSibling);
    }
  });

  // So the drag image doesn't try to fly back
  // if the drag is canceled.
  window.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  item.addEventListener("dragend", () => {
    item.removeAttribute("draggable");
    itemBeingDragged = undefined;
  });

  item.addEventListener("mouseup", () => {
    item.removeAttribute("draggable");
    itemBeingDragged = undefined;
  });

  item.append(dragHandle);

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  // This is a workaround so MutationObservers
  // are able to observe checkbox state.
  if (checked) {
    checkbox.checked = true;
    checkbox.setAttribute("checked", "true");
  }
  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      checkbox.setAttribute("checked", "true");
    } else {
      checkbox.removeAttribute("checked");
    }
  });
  item.append(checkbox);

  var textarea = document.createElement("textarea");
  textarea.placeholder = "new item";
  textarea.value = text;
  textarea.spellcheck = false;
  textarea.addEventListener("input", (event) => resizeElement(event.target));
  textarea.addEventListener("keydown", (event) => {
    if (event.target.value == "" && event.key == "Backspace") {
      event.preventDefault();

      item.previousSibling?.querySelector("textarea").focus();
      removeItem();
    }
  });
  item.append(textarea);

  var removalWrapper = document.createElement("div");
  removalWrapper.className = "removal-wrapper";

  item.append(removalWrapper);

  var removeItemButton = document.createElement("input");
  removeItemButton.type = "image";
  removeItemButton.className = "remove-item-button";
  removeItemButton.src = "images/wastebasketEmoji.svg";
  removeItemButton.alt = "Remove item.";
  removeItemButton.addEventListener("click", () =>
    removeItemButton.replaceWith(confirmationDialog)
  );

  removalWrapper.append(removeItemButton);

  var confirmationDialog = document.createElement("div");
  confirmationDialog.className = "confirmation-dialog";
  confirmationDialog.addEventListener("mouseleave", () =>
    confirmationDialog.replaceWith(removeItemButton)
  );

  var confirmationText = document.createElement("span");
  confirmationText.className = "confirmation-text";
  confirmationText.innerText = "Are you sure?";

  confirmationDialog.append(confirmationText);

  var confirmationButtonsWrapper = document.createElement("div");
  confirmationButtonsWrapper.className = "confirmation-buttons-wrapper";

  confirmationDialog.append(confirmationButtonsWrapper);

  var confirmRemovalButton = document.createElement("input");
  confirmRemovalButton.className = "confirm-removal-button";
  confirmRemovalButton.setAttribute("aria-label", "Confirm item removal.");
  confirmRemovalButton.type = "image";
  confirmRemovalButton.src = "images/greenTickEmoji.svg";
  confirmRemovalButton.addEventListener("click", removeItem);

  confirmationButtonsWrapper.append(confirmRemovalButton);

  var cancelRemovalButton = document.createElement("input");
  cancelRemovalButton.className = "cancel-removal-button";
  cancelRemovalButton.setAttribute("aria-label", "Cancel item removal.");
  cancelRemovalButton.type = "image";
  cancelRemovalButton.src = "images/crossMarkEmoji.svg";
  cancelRemovalButton.addEventListener("click", () =>
    confirmationDialog.replaceWith(removeItemButton)
  );

  confirmationButtonsWrapper.append(cancelRemovalButton);

  list.append(item);
  resizeElement(textarea);

  return item;
};

const createNewItem = () => {
  appendListItem({ checked: false, text: "" })
    .querySelector("textarea")
    .focus();
};

document.addEventListener("keydown", (event) => {
  if (!event.shiftKey && event.key == "Enter") {
    event.preventDefault();

    createNewItem();
  }
});

const saveList = () => {
  const list = document.getElementById("list");
  var serializedList = [];

  for (const item of list.querySelectorAll("li")) {
    var serializedItem = {};
    serializedItem.checked = item.querySelector("input[type=checkbox]").checked;
    serializedItem.text = item.querySelector("textarea").value;
    serializedList.push(serializedItem);
  }

  window.localStorage.setItem("list", JSON.stringify(serializedList));
};

const loadList = () => {
  const serializedList = JSON.parse(window.localStorage.getItem("list"));
  if (serializedList.length > 0) {
    for (const serializedItem of serializedList) {
      appendListItem(serializedItem);
    }
  }
};

window.addEventListener("load", () => {
  loadList();

  const list = document.getElementById("list");
  const changeObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (["UL", "INPUT", "TEXTAREA"].includes(mutation.target.tagName)) {
        saveList();
        break;
      }
    }
  });
  const changeObserverOptions = {
    subtree: true,
    childList: true,
    attributes: true,
  };
  changeObserver.observe(list, changeObserverOptions);

  const newItemWrapper = document.getElementById("new-item-wrapper");
  newItemWrapper.addEventListener("click", createNewItem);
  resizeElement(newItemWrapper.querySelector("textarea"));
});
