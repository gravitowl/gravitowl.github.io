//Gather all DOM elements
const imageButton = document.getElementById("image")
const realImageButton = document.getElementById("realImage")
const sizeInput = document.getElementById("size")
const spacingInput = document.getElementById("spacing")
const directionInput = document.getElementById("direction")

const downloadButton = document.getElementById("download")
const generateButton = document.getElementById("generate")

const uploadedFileName = document.querySelector(".uploadedImage")

const textOutput = document.querySelector(".outputArea")

const downloadError = document.querySelector(".download")
const generateError = document.querySelector(".generate")

let commands = [];

//Eventlisteners
imageButton.addEventListener("click", ()=>{
    realImageButton.click();
})

realImageButton.onchange = function(){
    const value = realImageButton.value.substring(12)
    uploadedFileName.innerText = value;
}

downloadButton.addEventListener("click", () => {
    if (commands.length === 0) {
      downloadError.style.display = "block";
      return;
    }
    console.log("hi")
    downloadError.style.display = "none";
  
    const name = `${uploadedFileName.innerText}.mcfunction`;
    const text = commands.join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, name);
  });

generateButton.addEventListener("click", ()=>{
    if(realImageButton.files && realImageButton.files[0]){
        generateError.style.display = "none"
        downloadError.style.display = "none";
        let reader = new FileReader();
        reader.onload = function(e){
            const uploadedImg = e.target.result;
            
            let colors = getColors(uploadedImg);
            commands = generateCommands(colors, sizeInput.value, Number(spacingInput.value), directionInput.value)
            textOutput.innerText = commands.join("\n");
        }
    
        reader.readAsDataURL(realImageButton.files[0])
        generateButton.click()
    }else{
        generateError.style.display = "block";
        return;
    }
})

function getColors(uploadedImg){
    imageElt = document.createElement("img")
    imageElt.src = uploadedImg
    let canvas = document.createElement("canvas");
    canvas.height = imageElt.height;
    canvas.width = imageElt.width;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imageElt, 0, 0, canvas.width, canvas.height);

    let colors = [];
    for(let i = 1; i <= canvas.width - 1; i++){
        colors.push([]);
        for(let j = 1; j <= canvas.height - 1; j++){
            var imageData = ctx.getImageData(i,j,1,1).data;
            colors[i - 1].push(imageData);
        }
    }
    return colors;
}

function generateCommands(colors, size, spacing, direction){
    let commands = [];
    let x,z
    if(direction === "x"){
        x = 0
        z = 0
    }else{
        z = 0
        x = 0
    }
    for(let i = 0; i < colors.length; i++){
        let y = colors[i].length * spacing;
        if(direction === "x"){
            x += spacing;
        }else{
            z += spacing;
        }
        for(let j = 0; j < colors[i].length; j++){
            if(colors[i][j][3] != 0){
                command = `particle minecraft:dust ${colors[i][j][0] / 255} ${colors[i][j][1] / 255} ${colors[i][j][2] / 255} ${size} ^${x} ^${y} ^${z} 0 0 0 0.01 1 force`
                commands.push(command);
            }
            y -= spacing
        }
    }
    return commands;
}