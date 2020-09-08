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
      xInput.value = "T * sin(T)";
      yInput.value = "T * cos(T)";
      zInput.value = "T";
      particleAmountNumber.value = "100";
      particleAmountRange.value = "100";

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
      xInput.value = "sin(T)";
      yInput.value = "cos(T)";
      zInput.value = "T";
      particleAmountNumber.value = "100";
      particleAmountRange.value = "100";

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
      xInput.value = "sin(T/10*pi)";
      yInput.value = "sin((T%10)*pi)cos(T/10*pi)";
      zInput.value = "cos((T%10)*pi)cos(T/10*pi)";
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
    case "golden-ratio":
      xInput.value = "sin(T*pi*1.61803398875*P)*(1-T*T)^0.5";
      yInput.value = "T";
      zInput.value = "cos(T*pi*1.61803398875*P)*(1-T*T)^0.5";
      particleAmountNumber.value = "400";
      particleAmountRange.value = "400";
      timeMinInput.value = "-1";
      timeMaxInput.value = "1";
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
    case "magica":
      xInput.value = "sin(T*pi/3*1.03)*(1-exp(-exp(T/15)/10))";
      yInput.value = "cos(T*pi/3*1.03)*(1-exp(-exp(T/15)/10))";
      zInput.value = "0";
      particleAmountNumber.value = "100";
      particleAmountRange.value = "100";
      timeMinInput.value = "0";
      timeMaxInput.value = "100";
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
    case "cube":
      xInput.value =
        "(1)/(1+exp(-10000*(T-1)))-((1)/(1+exp(-10000*(T-2))))+T*((1)/(1+exp(-10000*T))-((1)/(1+exp(-10000*(T-1)))))+(3-T)*((1)/(1+exp(-10000*(T-2)))-((1)/(1+exp(-10000*(T-3)))))+(1)/(1+exp(-10000*(T-6)))-((1)/(1+exp(-10000*(T-8))))+(T-8)*((1)/(1+exp(-10000*(T-8)))-((1)/(1+exp(-10000*(T-9)))))+(1)/(1+exp(-10000*(T-9)))-((1)/(1+exp(-10000*(T-10))))+(11-T)*((1)/(1+exp(-10000*(T-10)))-((1)/(1+exp(-10000*(T-11)))))";
      yInput.value =
        "(T-4)*((1)/(1+exp(-10000*(T-4)))-((1)/(1+exp(-10000*(T-5)))))+(T-5)*((1)/(1+exp(-10000*(T-5)))-((1)/(1+exp(-10000*(T-6)))))+(T-6)*((1)/(1+exp(-10000*(T-6)))-((1)/(1+exp(-10000*(T-7)))))+(T-7)*((1)/(1+exp(-10000*(T-7)))-((1)/(1+exp(-10000*(T-8)))))+(1)/(1+exp(-10000*(T-8)))-((1)/(1+exp(-10000*(T-12))))";
      zInput.value =
        "(T-1)*((1)/(1+exp(-10000*(T-1)))-((1)/(1+exp(-10000*(T-2)))))+(1)/(1+exp(-10000*(T-2)))-((1)/(1+exp(-10000*(T-3))))+(4-T)*((1)/(1+exp(-10000*(T-3)))-((1)/(1+exp(-10000*(T-4)))))+(1)/(1+exp(-10000*(T-5)))-((1)/(1+exp(-10000*(T-6))))+(1)/(1+exp(-10000*(T-7)))-((1)/(1+exp(-10000*(T-8))))+(T-9)*((1)/(1+exp(-10000*(T-9)))-((1)/(1+exp(-10000*(T-10)))))+(1)/(1+exp(-10000*(T-10)))-((1)/(1+exp(-10000*(T-11))))+(12-T)*((1)/(1+exp(-10000*(T-11)))-((1)/(1+exp(-10000*(T-12)))))";
      particleAmountNumber.value = "149";
      particleAmountRange.value = "149";
      timeMinInput.value = "0.001";
      timeMaxInput.value = "11.999";
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
    x = xInput.replace(/[T]/g, t);
    y = yInput.replace(/[T]/g, t);
    z = zInput.replace(/[T]/g, t);

    x = x.replace(/[P]/g, particleAmount);
    y = y.replace(/[P]/g, particleAmount);
    z = z.replace(/[P]/g, particleAmount);

    x = math.evaluate(x);
    x = x * Math.pow(10, 9);
    x = Math.floor(x);
    x = x / Math.pow(10, 9);

    y = math.evaluate(y);
    y = y * Math.pow(10, 9);
    y = Math.floor(y);
    y = y / Math.pow(10, 9);

    z = math.evaluate(z);
    z = z * Math.pow(10, 9);
    z = Math.floor(z);
    z = z / Math.pow(10, 9);

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

xInput.value = "T * sin(T)";
yInput.value = "T * cos(T)";
zInput.value = "T";
particleAmountNumber.value = "100";
particleAmountRange.value = "100";

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
