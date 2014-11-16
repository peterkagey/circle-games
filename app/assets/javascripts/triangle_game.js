//http://stackoverflow.com/questions/19172936/javascript-get-window-width-minus-scrollbar-width
scrollCompensate = function () {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer); //Uncaught TypeError: Cannot read property 'appendChild' of null 
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
}

// // http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
HTMLCanvasElement.prototype.relMouseCoords = function (event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = this;

  do {
      totalOffsetX += currentElement.offsetLeft;
      totalOffsetY += currentElement.offsetTop;
  }
  while (currentElement = currentElement.offsetParent)

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  canvasX = Math.round( canvasX * (this.width / this.offsetWidth) );
  canvasY = Math.round( canvasY * (this.height / this.offsetHeight) );

  return {x:canvasX, y:canvasY}
}

//////////////////////////////////////////////////////

var canvas = document.getElementById("triangle_game_canvas");
var context = canvas.getContext("2d");
var labels = []
var a_width = 15; var b_height = 14;
var r = 25; var l = 65; //length of side of equilateral triangle
var color1 = '#404040'; var color2 = '#444444'; var color3 = '#346a5b'; var color4 = '#2c4d75';
var game_matrix; var max_vertex = 3;
var odd_atox = []; var even_atox = []; var btoy = [];
canvas.width = (a_width+0.5)*l
canvas.height = (b_height) * l * Math.sqrt(3)/2 + l - l*Math.sqrt(3)/2


function i_to_b(i){ return Math.floor(i/a_width) }
function i_to_a(i){ return i % a_width }
function i_to_x(i){ return (i_to_b(i) % 2  == 0) ? even_atox[i_to_a(i)] : odd_atox[i_to_a(i)] }
function i_to_y(i){ return btoy[i_to_b(i)] }


function initialize_atox_and_btoy(){
  for(i = 0; i < a_width; i++){
    even_atox[i] = l * (i + 1/2);
    odd_atox[i] = l * (i + 1);
  }
  for(i = 0; i < b_height; i++){
    btoy[i] = i * l * Math.sqrt(3)/2 + l/2;
  }  
}
function draw_all_circles(){
  for(i = 0; i < a_width * b_height; i++){
    draw_circle_based_on_state(i);
  }
}

function draw_line(i1, i2){
  var x1 = i_to_x(i1); var y1 = i_to_y(i1);
  var x2 = i_to_x(i2); var y2 = i_to_y(i2);
  var scale = (r+2) / distance(x1, y1, x2, y2);
  var x3 = x1 + (x2-x1) * scale; var y3 = y1 + (y2-y1) * scale;
  var x4 = x2 - (x2-x1) * scale; var y4 = y2 - (y2-y1) * scale;
  context.beginPath();
  context.moveTo(x3, y3);
  context.lineTo(x4, y4);
  context.lineWidth = 4;
  if(game_matrix[labels[i1]-1][labels[i2]-1] > 1){
    context.strokeStyle = 'red';
  }else{
    context.strokeStyle = 'white';
  }
  context.stroke();
}

function distance(x1, y1, x2, y2){return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));}

function initialize_labels(a_w, b_h){
  for (i = 0; i < a_w*(b_h); i++){
    labels[i] = 0;
  }
}

function update_state(a,b){
  i = index(a,b);
  (labels[i] > 0) ? labels[i]-- : labels[i] = max_vertex;
}

function draw_circle_based_on_state(i){
  var state;
  // if (b == 0){
  //   state = "menu";
  // }else{
  state = labels[i];
  // }
  context.beginPath();
  context.arc(i_to_x(i), i_to_y(i), r, 0, 2 * 3.1415);
  // if (state == "menu"){
  //   context.fillStyle = color4;
  //   context.fill();
  //   context.lineWidth = 2;
  //   context.strokeStyle = "white";
  if (state == 0){
    context.fillStyle = color2;
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = color1;
  }else{
    context.fillStyle = color3;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "white";
    print_string_at(state, i);
  }
  context.stroke();
}

function print_string_at(text_string, i, flipstring){
  context.font = '20px Helvetica';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  if (flipstring == "flip"){
  context.rotate(Math.PI/2);
  context.fillText(text_string, btoy[b], -atox[a] + 20/(2.62));
  context.rotate(-Math.PI/2);
  }else{
  context.fillText(text_string, i_to_x(i), i_to_y(i) + 20/(2.62));
  }
}

canvas.onclick = function() {
  for (i = 0; i < labels.length; i++){
    if (distance(i_to_x(i), i_to_y(i), canvasX, canvasY) < r){
      labels[i]++;
      refresh_canvas();
      // refresh_canvas();
      return false;
    }  
  }
}

canvas.oncontextmenu = function() {
  for (i = 0; i < labels.length; i++){
    if (distance(i_to_x(i), i_to_y(i), canvasX, canvasY) < r){
      labels[i] = 0;
      refresh_canvas();
//       // refresh_canvas();
      return false;
    }  
  }
}

function reset_game_matrix(){
  var n = Math.max(max_label(), max_vertex);
  var matrix = [];
  for(i=0; i < n; i++) {
    matrix[i] = [];
    for(j=0; j < n; j++) {
      matrix[i][j] = 0;
    }
  }
  game_matrix = matrix;}

function max_label(){
  var max_l = 0
  for (i = 0; i < labels.length; i++){
    if (parseInt(labels[i]) > max_l){
      max_l = labels[i];
    }
  }
  return max_l
}

function i_touches_j(i, j, matrix){
  if (i==0 || j == 0){return}
  matrix[i-1][j-1]++;
  matrix[j-1][i-1]++;}

function largest_full_submatrix(matrix){
  for (n = 0; n < matrix.length+1; n++){
    for (i = 0; i < n; i++){
      for (j = 0; j < n; j++){
        if( matrix[i][j] == 0){
          return n-1
        }
      }
    }
  }
  return matrix.length
}

function calculate_proximity_and_draw_all_lines(){ // FIXME : this was split up to draw more red lines; inefficient.
  for (i = 0; i < labels.length ; i++){
    compare_right_and_down_and_update(i);
  }
  for (i = 0; i < labels.length ; i++){
    compare_right_and_down_and_draw(i);
  }
}
function compare_right_and_down_and_update(i){
  var i_state = labels[i];
  if(i_state == 0){
    return;
  }else{
    i_touches_j(i_state, i_state, game_matrix)
  }
  if (i_to_a(i) != a_width - 1 && labels[i+1] > 0 && labels[i+1] != i_state){
      i_touches_j(i_state, labels[i+1], game_matrix);
    }
    
  if (i_to_b(i) % 2 == 0){ // EVEN goes down and to right "\"
    if (i_to_b(i) < b_height && labels[i+a_width] > 0 && labels[i+a_width] != i_state){
      i_touches_j(i_state, labels[i+a_width], game_matrix);
    }    
  }else{ // ODD goes down and to left "/"
    if (i_to_b(i) < b_height && labels[i+a_width] > 0 && labels[i+a_width] != i_state){
      i_touches_j(i_state, labels[i+a_width], game_matrix);
    }    
  }

  if (i_to_b(i) % 2 == 0){ // EVEN goes down and to left "/"
    if (i_to_a(i) > 0 && i_to_b(i) < b_height && labels[i+a_width-1] > 0 && labels[i+a_width-1] != i_state){
      i_touches_j(i_state, labels[i+a_width-1], game_matrix);
    }    
  }else{ // ODD goes down and to right "\"
    if (i_to_a(i) != a_width - 1 && i_to_b(i) < b_height && labels[i+a_width+1] > 0 && labels[i+a_width+1] != i_state){
      i_touches_j(i_state, labels[i+a_width+1], game_matrix);
    }    
  }
}

function compare_right_and_down_and_draw(i){
  var i_state = labels[i];
  if(i_state == 0){
    return;
  }
  if (i_to_a(i) != a_width - 1 && labels[i+1] > 0 && labels[i+1] != i_state){
      draw_line(i, i+1);
    }
    
  if (i_to_b(i) % 2 == 0){ // EVEN goes down and to right "\"
    if (i_to_b(i) < b_height && labels[i+a_width] > 0 && labels[i+a_width] != i_state){
      draw_line(i, i + a_width);
    }    
  }else{ // ODD goes down and to left "/"
    if (i_to_b(i) < b_height && labels[i+a_width] > 0 && labels[i+a_width] != i_state){
      draw_line(i, i + a_width);
    }    
  }

  if (i_to_b(i) % 2 == 0){ // EVEN goes down and to left "/"
    if (i_to_a(i) > 0 && i_to_b(i) < b_height && labels[i+a_width-1] > 0 && labels[i+a_width-1] != i_state){
      draw_line(i, i + a_width - 1);
    }    
  }else{ // ODD goes down and to right "\"
    if (i_to_a(i) != a_width - 1 && i_to_b(i) < b_height && labels[i+a_width+1] > 0 && labels[i+a_width+1] != i_state){
      draw_line(i, i + a_width + 1);
    }    
  }
}

function fix_s(string, length){return ("     " + string).slice(-length);}

function set_alec_string(){
  alec_string = "";
  var matrix = game_matrix;
  var len = matrix.length.toString().length
  for (i = 0; i < matrix.length; i++){
    alec_string = alec_string + fix_s((i+1),len) + ":";
    for (j = 0; j <= matrix.length; j++){
      if(matrix[i][j] == 0){
        alec_string = alec_string + " " + fix_s((j+1),len)
      }else{
        alec_string = alec_string + " " + fix_s("", len)
      }
    } 
    alec_string = alec_string + "\n";
  }
  document.getElementById("alec_notes").value     = alec_string;
}

function number_of_vertices(){
  var count = 0;
  for (i = 0; i < a_width*(b_height-1); i++) {
    if (labels[i] != 0){
      count++;
    }
  }
  return count}

function draw_menu_bar(){
  print_string_at(number_of_vertices(), 0);
  print_string_at(largest_full_submatrix(game_matrix), 1); 
}

//////////////////////////////////////////////
// INITIALIZE
initialize_atox_and_btoy();
initialize_labels(a_width, b_height);
draw_all_circles();
//////////////////////////////////////////////
//
function refresh_canvas(){
  canvas.width = canvas.width
  reset_game_matrix();
  draw_all_circles();
  calculate_proximity_and_draw_all_lines();
  draw_menu_bar();
  set_alec_string();
//   set_rails_values();
}
//////////////////////////////////////////////


var canvasX; var canvasY;

canvas.onmousemove = function(){
  var coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
}