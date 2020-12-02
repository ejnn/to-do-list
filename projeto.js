const resizeElement = (element) => {
  // o reset é necessário pra textareas diminuirem...
  element.style.height = 0;
  element.style.height = element.scrollHeight + "px";
};

const appendListItem = ({ checked, text }) => {
  const list = document.getElementById("list");

  var item = document.createElement("li");
  const removeItem = () => list.removeChild(item);

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  item.append(checkbox);

  var textarea = document.createElement("textarea");
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

  var removeButton = document.createElement("img");
  removeButton.className = "removeButton";
  removeButton.src = "images/crossMarkEmoji.svg";
  removeButton.addEventListener("click", removeItem);
  item.append(removeButton);

  list.append(item);
  resizeElement(textarea);
};

const createNewItem = () => {
  appendListItem({ checked: false, text: "" });

  const listItems = document.querySelectorAll("li");
  const newItem = listItems[listItems.length - 1];
  newItem.querySelector("textarea").focus();
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

window.addEventListener("beforeunload", saveList);
window.setInterval(saveList, 10 * 1000);

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

  var newItemDiv = document.createElement("div");
  newItemDiv.id = "newItemWrapper";
  newItemDiv.addEventListener("click", createNewItem);

  var plusSymbol = document.createElement("img");
  plusSymbol.src = "images/plusEmoji.svg";
  plusSymbol.alt = "Add-item symbol";
  newItemDiv.append(plusSymbol);

  var textarea = document.createElement("textarea");
  textarea.readonly = true;
  textarea.spellcheck = false;
  textarea.value = "novo item...";
  newItemDiv.append(textarea);

  document.getElementById("listWrapper").appendChild(newItemDiv);
  resizeElement(textarea);
});
