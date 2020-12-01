const createListItem = ({ checked, text }) => {
  const list = document.getElementById("list");

  var item = document.createElement("li");

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = checked;
  item.append(checkbox);

  var span = document.createElement("span");
  span.innerText = text;
  item.append(span);

  var removeButton = document.createElement("input");
  removeButton.type = "button";
  removeButton.onclick = () => list.removeChild(item);
  item.append(removeButton);

  list.append(item);
};

const newItemSubmit = (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  createListItem({ checked: false, text: formData.get("newItemText") });
  form.reset();
};

document
  .getElementById("newItemForm")
  .addEventListener("submit", newItemSubmit);

const saveList = () => {
  const list = document.getElementById("list");
  var serializedList = [];

  for (const item of list.childNodes) {
    var serializedItem = {};
    serializedItem.checked = item.querySelector("input[type=checkbox]").checked;
    serializedItem.text = item.querySelector("span").innerText;
    serializedList.push(serializedItem);
  }

  window.localStorage.setItem("list", JSON.stringify(serializedList));
};

window.addEventListener("beforeunload", saveList);

const loadList = () => {
  const serializedList = JSON.parse(window.localStorage.getItem("list"));
  if (serializedList.length > 0) {
    for (const serializedItem of serializedList) {
      createListItem(serializedItem);
    }
  }
};

window.onload = loadList;
