var canvas, context
var tilesAcross, tilesDown, tileSize
var borderWidth = 5
var originalColor = "#AAA"
var newColor = "#18C"
function initializeCanvas() {
  canvas = document.getElementById("maze");
  tilesDown = 30, tileSize = 50
  tilesAcross = Math.round((window.innerWidth - scrollCompensate())/tileSize) - 1;
  tilesDown = Math.floor(window.innerHeight/tileSize) - 2
  canvas.width  = tileSize * tilesAcross
  canvas.height = tileSize * tilesDown
  context = canvas.getContext("2d");
}

function initializeTiles(){
  function randomBoolAry(){
    var new_ary = new Array(tilesDown)
    for (i = 0; i < new_ary.length; i++){ new_ary[i] = Math.round(Math.random()) }
    return new_ary
  }
  var lineDirections = new Array(tilesAcross)
  for (x = 0; x < lineDirections.length; x++){ lineDirections[x] = randomBoolAry() }
  return lineDirections
}

function drawAt(x,y){
  context.strokeStyle = originalColor;
  context.lineWidth = borderWidth;
  context.lineCap="round";

  (tileStateArray[x][y]) ? drawNW(x,y) : drawNE(x,y)
}

function drawAt2(x,y){
  context.strokeStyle = newColor;
  context.lineWidth = borderWidth;
  context.lineCap="round";

  (tileStateArray[x][y]) ? drawNW(x,y) : drawNE(x,y)
}

function drawNW(x, y){
  context.beginPath();
  context.moveTo(x * tileSize, y * tileSize);
  context.lineTo((x + 1) * tileSize, (y + 1) * tileSize);
  context.stroke()
}

function drawNE(x,y){
  context.beginPath();
  context.moveTo((x + 1) * tileSize, y * tileSize);
  context.lineTo(x * tileSize, (y + 1) * tileSize);
  context.stroke()
}

function tileBoard(){

  for (x = 0; x < tilesAcross; x++){
    for (y = 0; y < tilesDown; y++){
      drawAt(x,y)
    }
  }
}

var handlemouseup = function(event) {
  var coords = canvas.relMouseCoords(event);
  canvasX = coords.x; canvasY = coords.y;
  var a = Math.floor(canvasX/tileSize)
  var b = Math.floor(canvasY/tileSize)
  if (event.which == 1) { drawAt2(a,b) } else { drawAt(a, b) }
}

initializeCanvas()
var tileStateArray = initializeTiles()
tileBoard()

// Disable the menu when user right-clicks.
canvas.oncontextmenu = function(event) {
  return false;
}

canvas.addEventListener('mouseup', handlemouseup, false);
