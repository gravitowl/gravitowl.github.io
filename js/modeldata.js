//<div class="variable-card">
//  <p>$a</p>
//  <button>Edit</button>
//</div>;
const baseItemInput = document.getElementById("item");
const baseItemFilter = document.getElementById("filter");
const baseValueInput = document.getElementById("baseValue");
const downloadButton = document.getElementById("download");
const addModelButton = document.getElementById("addModelButton");
const modelList = document.querySelector(".modeldata");
const outputArea = document.getElementById("output");
const generateButton = document.getElementById("generate");
const downloadError = document.getElementById("download-error");
const itemError = document.getElementById("item-error");
const modelError = document.getElementById("model-error");

let editModelButtons = document.querySelectorAll(".open-edit");
let download = undefined;
//add variables
addModelButton.addEventListener("click", () => {
  //add main div
  const modelDiv = document.createElement("div");
  modelDiv.classList.add("model-card");

  //add variable title
  const modelTitle = document.createElement("div");
  modelTitle.classList.add("model-title");
  modelTitle.innerHTML = "Model";

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
  const nameInput = createElem("input", { type: "text", value: "Model" });
  nameInput.classList.add("name");

  const pathLabel = document.createElement("label");
  pathLabel.innerHTML = "Path:";
  const pathInput = createElem("input", { type: "text", value: "/" });
  pathInput.classList.add("path");

  //add everything to DOM
  modalBody.appendChild(nameLabel);
  modalBody.appendChild(nameInput);

  modalBody.appendChild(pathLabel);
  modalBody.appendChild(pathInput);

  modelDiv.appendChild(modelTitle);
  modelDiv.appendChild(buttonsDiv);
  buttonsDiv.appendChild(editButton);
  buttonsDiv.appendChild(removeButton);
  modelDiv.appendChild(editModal);
  editModal.appendChild(modalHeader);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  editModal.appendChild(modalBody);
  modelList.appendChild(modelDiv);

  editModelButtons = document.querySelectorAll(".open-edit");

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
  nameInput.oninput = () => {
    nameInput.parentElement.parentElement.parentElement.firstChild.innerHTML =
      nameInput.value;
  };
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
  generateModelFile();
  downloadError.style.display = "none";
});

function generateModelFile() {
  const editModals = document.querySelectorAll(".modal");
  const item = baseItemInput.value;
  let paths = [];
  let type = "generated";
  let custommodeldata;

  if (editModals.length !== 0 || item !== "-1") {
    editModals.forEach((modal) => {
      let modalChilds = modal.lastElementChild;
      modalChilds = modalChilds.childNodes;
      modalChilds.forEach((child) => {
        if (child.classList.contains("path")) {
          paths.push(child.value);
        }
      });
    });
    const baseValue = Number(baseValueInput.value);
    switch (item) {
      case "wooden_sword":
        type = "handheld";
        break;
      case "stone_sword":
        type = "handheld";
        break;
      case "iron_sword":
        type = "handheld";
        break;
      case "golden_sword":
        type = "handheld";
        break;
      case "diamond_sword":
        type = "handheld";
        break;
      case "netherite_sword":
        type = "handheld";
        break;
      case "carrot_on_a_stick":
        type = "handheld_rod";
        break;
      case "warped_fungus_on_a_stick":
        type = "handheld_rod";
        break;
      case "fishing_rod":
        type = "handheld_rod";
    }

    custommodeldata = {
      parent: type,
      textures: { layer0: `item/${item}` },
      overrides: [],
    };
    let predicates = [];
    for (
      let modelNumber = baseValue;
      modelNumber <= editModelButtons.length + baseValue - 1;
      modelNumber++
    ) {
      let path;
      editModals[modelNumber - baseValue].lastElementChild.childNodes.forEach(
        (child) => {
          if (child.classList.contains("path")) {
            path = child.value;
          }
        }
      );
      predicates.push({
        predicate: { custom_model_data: modelNumber },
        model: `item${path}`,
      });
    }
    custommodeldata.overrides.push(...predicates);
  }
  if (item !== "-1" && editModals.length !== 0) {
    outputArea.value = JSON.stringify(custommodeldata, null, 2);
    itemError.style.display = "none";
    modelError.style.display = "none";
  }

  if (item === "-1") {
    itemError.style.display = "block";
  } else {
    itemError.style.display = "none";
  }
  if (editModals.length === 0) {
    modelError.style.display = "block";
  } else {
    modelError.style.display = "none";
  }
}

//{"predicate":{"custom_model_data": modelNumber}, "model":`item/${path}`}(,)

//download
downloadButton.addEventListener("click", () => {
  if (outputArea.value.trim() === "") {
    downloadError.style.display = "block";
    return;
  }
  downloadError.style.display = "none";

  const name = `${baseItemInput.value}.json`;
  const text = outputArea.value;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, name);
});

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};

baseItemFilter.oninput = () => {
  options = baseItemInput.getElementsByTagName("option");
  console.log(options[0].value.toLowerCase());
  for (let i = options.length - 1; i >= 0; i--) {
    if (options[i].value.toLowerCase().includes(baseItemFilter.value)) {
      options[i].style.display = "block";
      baseItemInput.selectedIndex = i;
    } else {
      options[i].style.display = "none";
    }
  }
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

// {
//   "parent": "item/handheld",
//   "textures": {
//    "layer0": "item/<base item>"
//   },

//   "overrides": [
//    { "predicate": {"custom_model_data": <number>}, "model": "item/<model's json file>"}

//   ]

//  }
