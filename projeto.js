const createListItem = (itemText) => {
  const list = document.getElementById("list");

  var item = document.createElement("li");

  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  item.append(checkbox);

  var text = document.createElement("span");
  text.innerText = itemText;
  item.append(text);

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
  createListItem(formData.get("newItemText"));
  form.reset();
};

document
  .getElementById("newItemForm")
  .addEventListener("submit", newItemSubmit);
