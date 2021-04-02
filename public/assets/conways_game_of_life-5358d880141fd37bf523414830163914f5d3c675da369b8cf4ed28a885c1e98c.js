var canvas, context
var tileStateArray
var tiles_across, tiles_down, tile_size

function initializeCanvas() {
  canvas = document.getElementById("conway");
  tiles_across = 50, tile_size = 20
  tiles_down = Math.round(window.innerHeight/tile_size) - 5;

  canvas.width  = tile_size * tiles_across
  canvas.height = tile_size * tiles_down
  context = canvas.getContext("2d");
}

function initializeTiles(){
  function randomBoolAry(){
    new_ary = new Array(tiles_down)
    for (i = 0; i < new_ary.length; i++){ new_ary[i] = Math.random() < 0.3 }
    return new_ary
  }
  var colors = new Array(tiles_across)
  for (x = 0; x < colors.length; x++){ colors[x] = randomBoolAry() }
  return colors
}

function tileBoard(){
  for (x = 0; x < tiles_across; x++){
    for (y = 0; y < tiles_down; y++){
      context.strokeStyle = "black"
      context.strokeRect(x * tile_size, y * tile_size, tile_size, tile_size);

      context.fillStyle = tileStateArray[x][y] ? "black" : "white"
      context.fillRect(x * tile_size, y * tile_size, tile_size, tile_size);
    }
  }
}

function livingNeighbors(x,y,old_tileStateArray){

  function coordinateIsAlive(coordinate){
    return old_tileStateArray[coordinate[0]][coordinate[1]]
  }

  function allNeighboringCells() {
    cell_list = []
    var max_x = tiles_across - 1
    var max_y = tiles_down - 1

    if (x != 0) { cell_list.push([x - 1, y])}
    if (y != 0) { cell_list.push([x, y - 1])}
    if (x != max_x) { cell_list.push([x + 1, y])}
    if (y != max_y) { cell_list.push([x, y + 1])}

    if (x != 0 && y != 0)         { cell_list.push([x - 1, y - 1])}
    if (x != 0 && y != max_y)     { cell_list.push([x - 1, y + 1])}
    if (x != max_x && y != 0)     { cell_list.push([x + 1, y - 1])}
    if (x != max_x && y != max_y) { cell_list.push([x + 1, y + 1])}
    return cell_list
  }

  var counter = 0
  neighbor_coords = allNeighboringCells(x,y)
  for (i = 0; i < neighbor_coords.length; i++){
    if(coordinateIsAlive(neighbor_coords[i])) { counter++ }
  }
  return counter
}

function updateTileStateArray(){

  function copyAry(ary) { return JSON.parse(JSON.stringify(ary)) }

  function updateTileState(x,y, old_tileStateArray){
    neighbor_count = livingNeighbors(x,y,old_tileStateArray)
    if (old_tileStateArray[x][y]) {
      return neighbor_count == 2 || neighbor_count == 3
    } else {
      return neighbor_count == 3
    }
  }

  var old_tileStateArray = copyAry(tileStateArray)
  for(x = 0; x < tileStateArray.length; x++){
    for(y = 0; y < tileStateArray[0].length; y++){
      tileStateArray[x][y] = updateTileState(x,y,old_tileStateArray)
    }
  }
}

function initializeEverything() {
  initializeCanvas()
  tileStateArray = initializeTiles()
  tileBoard()

  setInterval(function() {
    updateTileStateArray()
    tileBoard()
  }, 150);
}

initializeEverything();
