const timeMinInput = document.getElementById("timeMin");
const timeMaxInput = document.getElementById("timeMax");
const particlesInput = document.getElementById("particles");
const xInput = document.getElementById("x");
const yInput = document.getElementById("y");
const zInput = document.getElementById("z");
const presetInput = document.getElementById("presets");
const particleTypeInput = document.getElementById("particle");
const selectorInput = document.getElementById("selector");
const forceInput = document.getElementById("force");
const particleSpeedInput = document.getElementById("speed");
const particleAmountInput = document.getElementById("count");
const settingsButton = document.getElementById("settings");
const renderButton = document.getElementById("render");
const downloadButton = document.getElementById("download");
const downloadError = document.querySelector(".download-error");

let downloadValue = undefined;

renderButton.addEventListener("click", () => {
  const x = xInput.value;
  const y = yInput.value;
  const z = zInput.value;
  const particleAmount = particlesInput.value;
  const particleType = particleTypeInput.value;
  const selector = selectorInput.value;
  const force = forceInput.checked;
  const amount = particleAmountInput.value;
  const speed = particleSpeedInput.value;
  const timeMin = Number(timeMinInput.value);
  const timeMax = Number(timeMaxInput.value);
  const points = Number(particlesInput.value);
  generateCommands(
    x,
    y,
    z,
    points,
    timeMin,
    timeMax,
    particleAmount,
    particleType,
    selector,
    force,
    amount,
    speed
  );
  downloadError.style.display = "none";
});

function generateCommands(
  x,
  y,
  z,
  points,
  timeMin,
  timeMax,
  particleAmount,
  particleType,
  selector,
  force,
  amount,
  speed
) {
  let commands = [];
  let xyz = [[], [], []];

  if (force == true) {
    force = "force";
  } else {
    force = "normal";
  }
  for (let i = 1; i <= particleAmount; i++) {
    let t = map(i, 0, particleAmount, timeMin, timeMax);

    xValue = x.replace(/[T]/g, t);
    yValue = y.replace(/[T]/g, t);
    zValue = z.replace(/[T]/g, t);

    xValue = xValue.replace(/[P]/g, particleAmount);
    yValue = yValue.replace(/[P]/g, particleAmount);
    zValue = zValue.replace(/[P]/g, particleAmount);

    xValue = math.evaluate(xValue);
    xValue = math.format(xValue, { notation: "fixed" });
    xValue = xValue * Math.pow(10, 9);
    xValue = Math.floor(xValue);
    xValue = xValue / Math.pow(10, 9);

    yValue = math.evaluate(yValue);
    yValue = math.format(yValue, { notation: "fixed" });
    yValue = yValue * Math.pow(10, 9);
    yValue = Math.floor(yValue);
    yValue = yValue / Math.pow(10, 9);

    zValue = math.evaluate(zValue);
    zValue = math.format(zValue, { notation: "fixed" });
    zValue = zValue * Math.pow(10, 9);
    zValue = Math.floor(zValue);
    zValue = zValue / Math.pow(10, 9);

    let command = `particle minecraft:${particleType} ^${xValue} ^${yValue} ^${zValue} 0 0 0 ${speed} ${amount} ${force} ${selector}`;
    commands.push(command);
    xyz[0].push(xValue);
    xyz[1].push(yValue);
    xyz[2].push(zValue);
  }
  downloadValue = commands.join("\n");
  makePlot("graph", xyz[0], xyz[1], xyz[2], "markers", "scatter3d");
}

function makePlot(div, xValues, yValues, zValues, modeValue, typeValue) {
  var trace1 = {
    type: typeValue,
    x: xValues,
    y: yValues,
    z: zValues,
    mode: modeValue,
    marker: {
      color: "#C8A2C8",
    },
  };

  var data = [trace1];

  var layout = {
    font: { size: 10 },
    paper_bgcolor: "#d8262600",
    plot_bgcolor: " #d8262600",
    scene: {
      xaxis: {
        backgroundcolor: "rgb(200, 200, 230)",
        gridcolor: "white",
        showbackground: true,
        zerolinecolor: "white",
        tickcolor: "black",
        tickfont: { color: "black" },
        title: { font: { color: "black" } },
      },
      yaxis: {
        backgroundcolor: "rgb(230, 200, 230)",
        gridcolor: "white",
        showbackground: true,
        zerolinecolor: "white",
        tickcolor: "black",
        tickfont: { color: "black" },
        title: { text: "z", font: { color: "black" } },
      },
      zaxis: {
        backgroundcolor: "rgb(230, 230, 200)",
        gridcolor: "white",
        showbackground: true,
        zerolinecolor: "white",
        tickcolor: "black",
        tickfont: { color: "black" },
        title: { text: "y", font: { color: "black" } },
      },
      camera: {
        up: { x: 0, y: 0, z: 1 },
        center: { x: 0, y: 0, z: 0 },
        eye: { x: 1, y: -1, z: 0.5 },
      },
    },
  };

  var config = { responsive: true, displayModeBar: false };

  Plotly.newPlot(div, data, layout, config);
}

function map(value, firstMin, firstMax, secondMin, secondMax) {
  return (
    ((value - firstMin) * (secondMax - secondMin)) / (firstMax - firstMin) +
    secondMin
  );
}

downloadButton.addEventListener("click", () => {
  if (downloadValue === undefined) {
    downloadError.style.display = "block";
    return;
  }
  downloadError.style.display = "none";
  let text = downloadValue;
  let name = "particleplot.mcfunction";

  let blob = new Blob([text], { type: "text/plain;charset=utf-8" });

  saveAs(blob, name);
});

presetInput.addEventListener("change", () => {
  switch (presetInput.value) {
    case "cone":
      timeMinInput.value = "0";
      timeMaxInput.value = "20";
      particlesInput.value = "100";
      xInput.value = "T*sin(T)";
      yInput.value = "T*cos(T)";
      zInput.value = "T";
      break;
    case "cylinder":
      timeMinInput.value = "0";
      timeMaxInput.value = "20";
      particlesInput.value = "100";
      xInput.value = "sin(T)";
      yInput.value = "cos(T)";
      zInput.value = "T";
      break;
    case "sphere":
      timeMinInput.value = "0";
      timeMaxInput.value = "20";
      particlesInput.value = "400";
      xInput.value = "sin(T/10*pi)";
      yInput.value = "sin((T%10)*pi)cos(T/10*pi)";
      zInput.value = "cos((T%10)*pi)cos(T/10*pi)";
      break;
    case "golden_ratio":
      timeMinInput.value = "-1";
      timeMaxInput.value = "1";
      particlesInput.value = "400";
      xInput.value = "sin(T*pi*1.61803398875*P)*(1-T*T)^0.5";
      yInput.value = "T";
      zInput.value = "cos(T*pi*1.61803398875*P)*(1-T*T)^0.5";
      break;
    case "magika":
      timeMinInput.value = "0";
      timeMaxInput.value = "100";
      particlesInput.value = "100";
      xInput.value = "sin(T*pi/3*1.03)*(1-exp(-exp(T/15)/10))";
      yInput.value = "cos(T*pi/3*1.03)*(1-exp(-exp(T/15)/10))";
      zInput.value = "0";
      break;
    case "cube":
      timeMinInput.value = "0.001";
      timeMaxInput.value = "11.999";
      particlesInput.value = "149";
      xInput.value =
        "(1)/(1+exp(-10000*(T-1)))-((1)/(1+exp(-10000*(T-2))))+T*((1)/(1+exp(-10000*T))-((1)/(1+exp(-10000*(T-1)))))+(3-T)*((1)/(1+exp(-10000*(T-2)))-((1)/(1+exp(-10000*(T-3)))))+(1)/(1+exp(-10000*(T-6)))-((1)/(1+exp(-10000*(T-8))))+(T-8)*((1)/(1+exp(-10000*(T-8)))-((1)/(1+exp(-10000*(T-9)))))+(1)/(1+exp(-10000*(T-9)))-((1)/(1+exp(-10000*(T-10))))+(11-T)*((1)/(1+exp(-10000*(T-10)))-((1)/(1+exp(-10000*(T-11)))))";
      yInput.value =
        "(T-4)*((1)/(1+exp(-10000*(T-4)))-((1)/(1+exp(-10000*(T-5)))))+(T-5)*((1)/(1+exp(-10000*(T-5)))-((1)/(1+exp(-10000*(T-6)))))+(T-6)*((1)/(1+exp(-10000*(T-6)))-((1)/(1+exp(-10000*(T-7)))))+(T-7)*((1)/(1+exp(-10000*(T-7)))-((1)/(1+exp(-10000*(T-8)))))+(1)/(1+exp(-10000*(T-8)))-((1)/(1+exp(-10000*(T-12))))";
      zInput.value =
        "(T-1)*((1)/(1+exp(-10000*(T-1)))-((1)/(1+exp(-10000*(T-2)))))+(1)/(1+exp(-10000*(T-2)))-((1)/(1+exp(-10000*(T-3))))+(4-T)*((1)/(1+exp(-10000*(T-3)))-((1)/(1+exp(-10000*(T-4)))))+(1)/(1+exp(-10000*(T-5)))-((1)/(1+exp(-10000*(T-6))))+(1)/(1+exp(-10000*(T-7)))-((1)/(1+exp(-10000*(T-8))))+(T-9)*((1)/(1+exp(-10000*(T-9)))-((1)/(1+exp(-10000*(T-10)))))+(1)/(1+exp(-10000*(T-10)))-((1)/(1+exp(-10000*(T-11))))+(12-T)*((1)/(1+exp(-10000*(T-11)))-((1)/(1+exp(-10000*(T-12)))))";
      break;
  }
  renderButton.click();
});

timeMinInput.value = "0";
timeMaxInput.value = "20";
particlesInput.value = "100";
xInput.value = "T*sin(T)";
yInput.value = "T*cos(T)";
zInput.value = "T";
renderButton.click();
