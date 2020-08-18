const timeMinInput = document.getElementById("timeMin");
const timeMaxInput = document.getElementById("timeMax");

const particleAmountRange = document.getElementById("particleAmountRange");
const particleAmountNumber = document.getElementById("particleAmountNumber");

const xInput = document.getElementById("X");
const yInput = document.getElementById("Y");
const zInput = document.getElementById("Z");

const drawButton = document.getElementById("draw");

const commandOutput = document.getElementById("output");

const particle = document.getElementById("selectParticle");

const commandSpecifier = document.getElementById("commandSpecifier");

const preset = document.getElementById("preset");

//presets
preset.addEventListener("input", () => {
  switch (preset.value) {
    case "cone":
      xInput.value = "t * sin(t)";
      yInput.value = "t * cos(t)";
      zInput.value = "t";
      generatePlot(
        Number(timeMinInput.value),
        Number(timeMaxInput.value),
        Number(particleAmountNumber.value),
        xInput.value,
        yInput.value,
        zInput.value,
        commandOutput,
        particle.value,
        commandSpecifier.value
      );
      break;
    case "cylinder":
      xInput.value = "sin(t)";
      yInput.value = "cos(t)";
      zInput.value = "t";
      generatePlot(
        Number(timeMinInput.value),
        Number(timeMaxInput.value),
        Number(particleAmountNumber.value),
        xInput.value,
        yInput.value,
        zInput.value,
        commandOutput,
        particle.value,
        commandSpecifier.value
      );
      break;
    case "sphere":
      xInput.value = "sin(t/10*pi)";
      yInput.value = "sin((t%10)*pi)cos(t/10*pi)";
      zInput.value = "cos((t%10)*pi)cos(t/10*pi)";
      particleAmountNumber.value = "400";
      particleAmountRange.value = "400";

      generatePlot(
        Number(timeMinInput.value),
        Number(timeMaxInput.value),
        Number(particleAmountNumber.value),
        xInput.value,
        yInput.value,
        zInput.value,
        commandOutput,
        particle.value,
        commandSpecifier.value
      );
      break;
  }
});

//sync values
particleAmountNumber.addEventListener("input", syncCharacterAmount);
particleAmountRange.addEventListener("input", syncCharacterAmount);

function syncCharacterAmount(e) {
  let value = e.target.value;
  if (Number(value) > particleAmountNumber.max) {
    value = particleAmountNumber.max;
  }
  particleAmountNumber.value = value;
  particleAmountRange.value = value;
}

//Detect draw button click, and execute functions
drawButton.addEventListener("click", (e) => {
  e.preventDefault();
  generatePlot(
    Number(timeMinInput.value),
    Number(timeMaxInput.value),
    Number(particleAmountNumber.value),
    xInput.value,
    yInput.value,
    zInput.value,
    commandOutput,
    particle.value,
    commandSpecifier.value
  );
});

//Generate a plotly plot according to the values put in by the user.
function generatePlot(
  timeMin,
  timeMax,
  particleAmount,
  xInput,
  yInput,
  zInput,
  output,
  particle,
  lastPartCommand
) {
  let commands = [];
  let xyz = [[], [], []];
  let selectedParticle = particle;
  let commandEnd = lastPartCommand;
  for (let particle = 1; particle <= particleAmount; particle++) {
    let t = map(particle, 0, particleAmount, timeMin, timeMax);
    x = xInput.replace(/[t]/g, t);
    y = yInput.replace(/[t]/g, t);
    z = zInput.replace(/[t]/g, t);
    x = math.evaluate(x);
    x = x * 15;
    x = Math.floor(x);
    x = x / 15;

    y = math.evaluate(y);
    y = y * 15;
    y = Math.floor(y);
    y = y / 15;

    z = math.evaluate(z);
    z = z * 15;
    z = Math.floor(z);
    z = z / 15;

    let command = `particle minecraft:${selectedParticle} ^${x} ^${y} ^${z} ${commandEnd}`;
    xyz[0].push(x);
    xyz[1].push(y);
    xyz[2].push(z);
    commands.push(command);
  }

  commands = commands.join("\n");
  makePlot("chart", xyz[0], xyz[1], xyz[2], "markers", "scatter3d");
  output.value = commands;
}

//Make the plotly plot
function makePlot(div, xValues, yValues, zValues, modeValue, typeValue) {
  Plotly.newPlot(div, [
    {
      x: xValues,
      y: yValues,
      z: zValues,

      mode: modeValue,
      type: "scatter3d",
    },
    // {
    //   scene: {
    //     xaxis: {
    //       backgroundcolor: "rgb(200, 200, 230)",
    //       gridcolor: "rgb(255, 255, 255)",
    //       showbackground: true,
    //       zerolinecolor: "rgb(255, 255, 255)",
    //     },
    //     yaxis: {
    //       backgroundcolor: "rgb(230, 200,230)",
    //       gridcolor: "rgb(255, 255, 255)",
    //       showbackground: true,
    //       zerolinecolor: "rgb(255, 255, 255)",
    //     },
    //     zaxis: {
    //       backgroundcolor: "rgb(230, 230,200)",
    //       gridcolor: "rgb(255, 255, 255)",
    //       showbackground: true,
    //       zerolinecolor: "rgb(255, 255, 255)",
    //     },
    //   },
    // },
  ]);
}

//Map values function
function map(value, firstMin, firstMax, secondMin, secondMax) {
  return (
    ((value - firstMin) * (secondMax - secondMin)) / (firstMax - firstMin) +
    secondMin
  );
}

//Toggle settings page in DOM
function toggleSettings() {
  if (settings.style.display === "none") {
    settings.style.display = "block";
  } else {
    settings.style.display = "none";
  }
}

toggleSettings();

xInput.value = "t * sin(t)";
yInput.value = "t * cos(t)";
zInput.value = "t";
generatePlot(
  Number(timeMinInput.value),
  Number(timeMaxInput.value),
  Number(particleAmountNumber.value),
  xInput.value,
  yInput.value,
  zInput.value,
  commandOutput,
  particle.value,
  commandSpecifier.value
);
