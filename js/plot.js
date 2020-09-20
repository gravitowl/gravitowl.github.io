let myDiv = document.getElementById("plot");
var trace1 = {
  type: "scatter3d",
  x: [1, 2, 3, 4],
  y: [5, 10, 2, 8],
  z: [2, 3, 4, 5],
  mode: "markers",
  marker: {
    color: "#C8A2C8",
    line: {
      width: 2.5,
    },
  },
};

var data = [trace1];

var layout = {
  showlegend: false,
  scene: {
    xaxis: {
      backgroundcolor: "rgb(200, 200, 250)",
      gridcolor: "white",
      showbackground: true,
      zerolinecolor: "white",
      tickcolor: "white",
      tickfont: { color: "white" },
      title: { font: { color: "white" } },
    },
    yaxis: {
      backgroundcolor: "rgb(250, 200, 250)",
      gridcolor: "white",
      showbackground: true,
      zerolinecolor: "white",
      tickcolor: "white",
      tickfont: { color: "white" },
      title: { text: "z", font: { color: "white" } },
    },
    zaxis: {
      backgroundcolor: "rgb(250, 250, 200)",
      gridcolor: "white",
      showbackground: true,
      zerolinecolor: "white",
      tickcolor: "white",
      tickfont: { color: "white" },
      title: { text: "y", font: { color: "white" } },
    },
    camera: {
      up: { x: 0, y: 0, z: 1 },
      center: { x: 0, y: 0, z: 0 },
      eye: { x: 1, y: -1, z: 0.5 },
    },
  },
};

var config = { responsive: true };

Plotly.newPlot(myDiv, data, layout, config);
