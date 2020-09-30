//<div class="variable-card">
//  <p>$a</p>
//  <button>Edit</button>
//</div>;
const commandInput = document.getElementById("command");
const repetitionsInput = document.getElementById("repetitions");
const downloadButton = document.getElementById("download");
const addVarButton = document.getElementById("addVarButton");
const variableList = document.querySelector(".variables");
const outputArea = document.getElementById("output");
const generateButton = document.getElementById("generate");
const errorMessage = document.querySelector(".download-error");

let editVarButtons = document.querySelectorAll(".open-edit");
let download = undefined;
//add variables
addVarButton.addEventListener("click", () => {
  //add main div
  const varDiv = document.createElement("div");
  varDiv.classList.add("variable-card");

  //add variable title
  const varTitle = document.createElement("div");
  varTitle.classList.add("var-title");
  varTitle.innerHTML = "#";

  //add div for buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons-div");

  //add buttons
  const editButton = document.createElement("button");
  editButton.classList.add("open-edit");
  editButton.innerHTML = "Edit";

  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-var");
  removeButton.innerHTML = "Remove";

  //add modal
  const editModal = document.createElement("div");
  editModal.classList.add("modal");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const modalTitle = document.createElement("div");
  modalTitle.innerHTML = "Edit Variable";
  modalTitle.classList.add("modal-title");

  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.innerHTML = "&times;";

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  //add modal inputs
  const nameLabel = document.createElement("label");
  nameLabel.innerHTML = "Name:";
  const nameInput = createElem("input", { type: "text", value: "#" });
  nameInput.classList.add("name");

  const incrementLabel = document.createElement("label");
  incrementLabel.innerHTML = "Increment:";
  const incrementInput = createElem("input", {
    type: "number",
    min: "1",
    max: "100",
    value: "1",
  });
  incrementInput.classList.add("increment");

  const baseValueLabel = document.createElement("label");
  baseValueLabel.innerHTML = "Base value:";
  const baseValueInput = createElem("input", {
    type: "number",
    min: "1",
    max: "100",
    value: "1",
  });
  baseValueInput.classList.add("base");

  //add everything to DOM
  modalBody.appendChild(nameLabel);
  modalBody.appendChild(nameInput);

  modalBody.appendChild(incrementLabel);
  modalBody.appendChild(incrementInput);

  modalBody.appendChild(baseValueLabel);
  modalBody.appendChild(baseValueInput);

  varDiv.appendChild(varTitle);
  varDiv.appendChild(buttonsDiv);
  buttonsDiv.appendChild(removeButton);
  buttonsDiv.appendChild(editButton);
  varDiv.appendChild(editModal);
  editModal.appendChild(modalHeader);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  editModal.appendChild(modalBody);
  variableList.appendChild(varDiv);

  editVarButtons = document.querySelectorAll(".open-edit");

  //setup event listeners for clicking
  editButton.addEventListener("click", () => {
    openModal(editButton.parentElement.nextElementSibling);
  });

  closeButton.addEventListener("click", () => {
    closeModal(closeButton.closest(".modal"));
  });

  removeButton.addEventListener("click", () => {
    removeButton.parentElement.parentElement.remove();
  });

  //event listener for updating title
  nameInput.addEventListener("change", () => {
    nameInput.parentElement.parentElement.parentElement.firstChild.innerHTML =
      nameInput.value;
  });
});

//event listener for overlay to disable modal
overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

//function for opening a modal
function openModal(modal) {
  if (modal === null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

//function for closing a modal.
function closeModal(modal) {
  if (modal === null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

//create an element with attributes easily.
function createElem(name, attrs) {
  const elem = document.createElement(name);
  for (const [attr, val] of Object.entries(attrs)) elem.setAttribute(attr, val);
  return elem;
}

//*******************\\
//Actual generator part
//*******************\\

generateButton.addEventListener("click", () => {
  generateSequence();
  errorMessage.style.display = "none";
});

function generateSequence() {
  const editModals = document.querySelectorAll(".modal");
  variables = [];
  variablesIncrement = [];
  variablesValue = [];

  editModals.forEach((modal) => {
    modalChilds = modal.lastElementChild;
    modalChilds = modalChilds.childNodes;
    modalChilds.forEach((child) => {
      if (child.classList.contains("name")) {
        variables.push(child.value);
      } else if (child.classList.contains("increment")) {
        variablesIncrement.push(Number(child.value));
      } else if (child.classList.contains("base")) {
        variablesValue.push(Number(child.value));
      }
    });
  });

  const command = commandInput.value;
  const repetition = repetitionsInput.value;
  let commands = [];
  for (let i = 1; i <= repetition; i++) {
    let finalCommand = command;
    for (let i = 0; i < variables.length; i++) {
      finalCommand = finalCommand.replaceAll(variables[i], variablesValue[i]);
      variablesValue[i] += variablesIncrement[i];
    }
    commands.push(finalCommand);
  }
  commands = commands.join("\n");
  outputArea.value = commands;
}

//download
downloadButton.addEventListener("click", () => {
  if (outputArea.value.trim() === "") {
    errorMessage.style.display = "block";
    return;
  }
  errorMessage.style.display = "none";

  const name = "sequence.mcfunction";
  const text = outputArea.value;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, name);
});

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};
// const download = document.getElementById("download");
// console.log(download);
// download.addEventListener("click", () => {
//   let text = "hello this is cool";
//   let name = "cool.mcfunction";

//   let blob = new Blob([text], {
//     type: "text/plain;charset=utf-8",
//   });

//   saveAs(blob, name);
// });
