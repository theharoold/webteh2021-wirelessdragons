let canvas;
let context;
let savedImageData;

let dragging = false;
let strokeColor = "black";
let fillColor = "black";
let lineWidth = 10;

let currentTool = "brush";

class ShapeBoundingBox {
  constructor(left, top, width, height) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
  }
}

class MouseDownPosition {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let shapeBoundingBox = new ShapeBoundingBox(0, 0, 0, 0);
let mouseDown = new MouseDownPosition(0, 0); // mousedown location
let loc = new Location(0, 0); // current mouse location

document.addEventListener("DOMContentLoaded", setupCanvas);

function setupCanvas() {
  canvas = document.getElementById("paint-canvas");
  context = canvas.getContext("2d");
  context.strokeStyle = strokeColor;
  context.lineWidth = lineWidth;

  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener("mousedown", ReactToMouseDown);
  canvas.addEventListener("mousemove", ReactToMouseMove);
  canvas.addEventListener("mouseup", ReactToMouseUp);

  canvas.addEventListener("touchstart", ReactToMouseDown);
  canvas.addEventListener("touchmove", ReactToMouseMove);
  canvas.addEventListener("touchend", ReactToMouseUp);
}

function changeTool(toolClicked) {
  document.getElementById("brush").className = "";
  document.getElementById("eraser").className = "";
  document.getElementById("circle").className = "";
  document.getElementById("square").className = "";

  document.getElementById(toolClicked).classList = "selected";
  currentTool = toolClicked;
  
  if(currentTool === 'brush' && strokeColor === "white") { strokeColor = "black"; }
  else if(currentTool === 'eraser') { strokeColor = "white"; }
  else if (strokeColor === 'white' && currentTool != 'eraser') { strokeColor = "black"; }
}

// konvertuje client.X i client.Y u pozicije relativne u ondosu na canvas
function GetMousePosition(x, y) {
  let canvasOffset = canvas.getBoundingClientRect();
  return {
    x: (x - canvasOffset.left) * (canvas.width / canvasOffset.width),
    y: (y - canvasOffset.top) * (canvas.height / canvasOffset.height),
  };
}

function SaveCanvasImage() {
  savedImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function RedrawCanvasImage() {
  context.putImageData(savedImageData, 0, 0);
}

function UpdateRubberBandSizeData(loc) {
  shapeBoundingBox.width = Math.abs(loc.x - mouseDown.x);
  shapeBoundingBox.height = Math.abs(loc.y - mouseDown.y);

  if (loc.x > mouseDown.x) {
    shapeBoundingBox.left = mouseDown.x;
  } else {
    shapeBoundingBox.left = loc.x;
  }

  if (loc.y > mouseDown.y) {
    shapeBoundingBox.top = mouseDown.y;
  } else {
    shapeBoundingBox.top = loc.y;
  }
}

function ReactToMouseDown(e) {
  loc = GetMousePosition(e.clientX, e.clientY);
  mouseDown.x = loc.x;
  mouseDown.y = loc.y;
  dragging = true;

  if(currentTool === 'brush' || currentTool === 'eraser') {
    context.beginPath();
    context.moveTo(mouseDown.x, mouseDown.y); 
  }
  
  SaveCanvasImage();
}

function ReactToMouseMove(e) {
  loc = GetMousePosition(e.clientX, e.clientY);

  if (dragging) {
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
  }

  if (dragging && (currentTool === 'brush' || currentTool === 'eraser')) {
    context.lineTo(loc.x, loc.y);
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }
}

function ReactToMouseUp(e) {
  if (dragging && (currentTool === 'brush' || currentTool === 'eraser')) {
    context.stroke();
    context.closePath();
    dragging = false;
  } else if (currentTool != 'brush') {
      loc = GetMousePosition(e.clientX, e.clientY);
      RedrawCanvasImage();
      UpdateRubberbandOnMove(loc);
      dragging = false;
  }
}

function SaveImage() {
  let imageFile = document.getElementById("img-file");
  imageFile.setAttribute("download", "image.png");
  imageFile.setAttribute("href", canvas.toDataURL());
}

function UpdateRubberbandOnMove(loc) {
  UpdateRubberBandSizeData(loc);
  drawRubberbandShape();
}

function drawRubberbandShape() {
  context.strokeStyle = strokeColor;
  context.fillStyle = fillColor;
  context.lineWidth = lineWidth;

  if (currentTool === "circle") {
    let radius = shapeBoundingBox.width;
    context.beginPath();
    context.arc(mouseDown.x, mouseDown.y, radius, 0, Math.PI * 2);
    context.stroke();
  } else if (currentTool === "square") {
    context.strokeRect (shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
  }
}

function clearCanvas() {
  let initial_bg_color = "white";
  context.fillStyle = initial_bg_color;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function changeColor(color) {
  if(currentTool === "eraser") {
    strokeColor = "white";
  } else {
    strokeColor = color;
  }
}