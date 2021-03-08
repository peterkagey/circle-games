var canvas, context
var tilesAcross, tilesDown, tileSize
var borderWidth = 60
var originalColor = "#CCC"
var newColor = "#18C"
var colorCounter = 0;
var colorz = ["#18C", "#1C8", "#81C", "#8C1", "#C18", "#C81"]

function initializeCanvas() {
  canvas = document.getElementById("maze");
  tilesDown = 30, tileSize = 100
  // tilesAcross = Math.round((window.innerWidth - scrollCompensate())/tileSize) - 1;
  tilesDown = 50; // Math.floor(window.innerHeight/tileSize) - 2
  tilesAcross = tilesDown
  canvas.width  = tileSize * tilesAcross
  canvas.height = tileSize * tilesDown
  context = canvas.getContext("2d");
  context.fillStyle='white';
  context.fillRect(0,0,canvas.width,canvas.height);
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

function drawAt(ary){
  var x = ary[0]
  var y = ary[1]
  context.strokeStyle = originalColor;
  context.lineWidth = borderWidth;
  context.lineCap="butt";

  (tileStateArray[x][y]) ? drawNW(x,y) : drawNE(x,y)
}

function drawAt2(ary){
  var x = ary[0]
  var y = ary[1]
  context.strokeStyle = newColor;
  context.lineWidth = borderWidth;
  context.lineCap="butt";

  (tileStateArray[x][y]) ? drawNW(x,y) : drawNE(x,y)
}

function isInBounds(array){
  var xInBounds = 0 <= array[0] && array[0] < tilesAcross
  var yInBounds = 0 <= array[1] && array[1] < tilesDown
  return xInBounds && yInBounds
}

function allAdjacent(x, y){
  function isConnected(ary){
    return tileStateArray[x][y] != tileStateArray[ary[0]][ary[1]]
  }
  var parallel = [[x + 1, y], [x, y - 1], [x - 1, y], [x, y + 1]]
  return parallel.filter(isInBounds).filter(isConnected)
}

function allOnLine(x, y) {
  function isConnected(ary){
    return tileStateArray[x][y] == tileStateArray[ary[0]][ary[1]]
  }
  if (tileStateArray[x][y]) {
    var perpendicular = [[x-1, y-1], [x+1, y+1]]
  } else {
    var perpendicular = [[x-1, y+1], [x+1, y-1]]
  }
  return perpendicular.filter(isInBounds).filter(isConnected)
}

function touchingSection(ary){
  var x = ary[0]
  var y = ary[1]
  return [[x, y]]
    .concat(allOnLine(x, y))
    .concat(allAdjacent(x, y))
    .sort()
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

// This works, but the performance is dismal!
function allTouching(x, y){
  function recurse(known) {
    var newValues = _.uniq(
      known.flatMap(touchingSection).sort(),
      function(i) {return JSON.stringify(i)}
    )
    if (_(newValues).isEqual(known)) { return known }
    else { return recurse(newValues) }
  }
  return recurse([[x, y]])
}

function drawNW(x, y){
  context.beginPath();
  context.moveTo((x - 0.01) * tileSize, (y - 0.01) * tileSize);
  context.lineTo((x + 1.01) * tileSize, (y + 1.01) * tileSize);
  context.stroke()
}

function drawNE(x,y){
  context.beginPath();
  context.moveTo((x + 1.01) * tileSize, (y - 0.01) * tileSize);
  context.lineTo((x - 0.01) * tileSize, (y + 1.01) * tileSize);
  context.stroke()
}

function tileBoard(){

  for (x = 0; x < tilesAcross; x++){
    for (y = 0; y < tilesDown; y++){
      drawAt([x,y])
    }
  }
}

var handlemouseup = function(event) {
  var coords = canvas.relMouseCoords(event);
  canvasX = coords.x; canvasY = coords.y;
  var a = Math.floor(canvasX/tileSize)
  var b = Math.floor(canvasY/tileSize)
  // colorCounter = (colorCounter + 1) % 6;
  newColor = colorz[colorCounter];
  console.log(newColor);
  if (event.which == 1) {
    allTouching(a, b).forEach(drawAt2)
  } else {
    allTouching(a, b).forEach(drawAt)
  }
}

initializeCanvas()
var tileStateArray = initializeTiles()
tileBoard()

// Disable the menu when user right-clicks.
canvas.oncontextmenu = function(event) {
  return false;
}

canvas.addEventListener('mouseup', handlemouseup, false);
