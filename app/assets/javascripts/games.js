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

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
}

// http://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
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

//Canvas setup.
max_a = 6; max_b = 10
var canvas = document.getElementById("game_canvas");
canvas.width = Math.min(window.innerWidth-scrollCompensate(), 63*max_a)
canvas.height = canvas.width/max_a*max_b;
var context = canvas.getContext("2d");
context.fillStyle = "#cccccc";
color1 = '#404040'; color2 = '#444444'; color3 = '#346a5b'; color4 = '#2c4d75';
r = Math.min(25, 0.5*canvas.width/(max_a*1.25));

var label = [];
var atox = []; var btoy = [];
var max_vertex = 3;
var game_matrix;
w = canvas.width; h = canvas.height;
function initialize_atox_and_btoy(){
  for (a = 0; a < max_a ; a++){
    atox[a] = 0.5*(w/max_a) + a*w/max_a;
  }
  for (b = 0; b < max_b ; b++){
     btoy[b] = 0.5*h/max_b + b*h/max_b;
  }}

function intialize_labels(){
  for (i = 0; i < max_a*(max_b-1); i++){
    label[i] = 0;
  }
}

function draw_circles(){
  context.canvas.width = context.canvas.width;
  for (b = 1; b < max_b ; b++){
    for (a = 0; a < max_a ; a++) {
      color_based_on_state(label[index(a,b)], a, b);
    }
  }}

function print_string_at(text_string, a, b){
  context.font = '20px Helvetica'; 
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText(text_string, atox[a], btoy[b] + 20/(2.62));} // make sure penultimate number is same as context.font

function distance(x1, y1, x2, y2){return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));}

function update_state(a,b){
  i2 = index(a,b);
  label[i2] = (label[i2] + max_vertex) % (max_vertex+1);
}

function color_based_on_state(state, a, b){
  context.beginPath();
  context.arc(atox[a], btoy[b], r, 0, 2 * 3.1415);
  if (state == 0){
    context.fillStyle = color2;
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = color1;
  }else if (state == "menu"){
    context.fillStyle = color4;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "white";
  }else{
    context.fillStyle = color3;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "white";
    print_string_at(state, a, b);
  }
  context.stroke();
}

function perhaps_submit(){
  coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
  if (distance(canvasX, canvasY, atox[3], btoy[0]) < r){
    document.getElementById("new_game").submit();
  }
}

function change_max_vertex(){
  coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
  if (distance(canvasX, canvasY, atox[max_a-3], btoy[0]) < r && max_vertex > 1){
    max_vertex--;
    return;
  }else if(distance(canvasX, canvasY, atox[max_a-1], btoy[0]) < r){
    max_vertex++;
    return;
  }
}

function color_circle_under_cursor(){
  coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
  for (b = 1; b < max_b; b++){  
    for (a = 0; a < max_a; a++){
      x1 = atox[a];
      y1 = btoy[b];
      if (distance(x1, y1, canvasX, canvasY) < r){ 
        update_state(a,b);
        color_based_on_state(label[index(a,b)], a, b);
        return
      }
    }
  }
}

function number_of_vertices(){
  var count = 0;
  for (var i = 0; i < max_a*(max_b-1); i++) {
    if (label[i] != 0){
      count++;
    }
  }
  return count}

function draw_line(a1, b1, a2, b2){
  context.beginPath();
  if(a1 == a2){
    x1 = atox[a1];
    x2 = atox[a2];
    y1 = btoy[Math.min(b1,b2)]+r+2;
    y2 = btoy[Math.max(b1,b2)]-r-2;
  }else{
    x1 = atox[Math.min(a1,a2)]+r+2;
    x2 = atox[Math.max(a1,a2)]-r-2;
    y1 = btoy[b1];
    y2 = btoy[b2];
  }
  
  if (label[index(a1,b1)] != label[index(a2,b2)]){
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 4;
    context.strokeStyle = 'white';
  }
  context.stroke();}

function r_index(a,b){return 4*(max_a*b + a)} //FIXME, remove first row

function index(a,b){return max_a*(b-1) + a}

function reset_game_matrix(){
  n = Math.max(max_vertex, highest_state());
  var matricks = [];
  for(i2=0; i2 < n; i2++) {
    matricks[i2] = [];
    for(j2=0; j2 < n; j2++) {
      matricks[i2][j2] = 0;
    }
  }
  return matricks}

function i_touches_j(i, j, matrix){
  if (i==0 || j == 0){return}
  matrix[i-1][j-1] = 1;
  matrix[j-1][i-1] = 1;}

function sum_matrix(matrix){
  var sum = 0;
  for (i2=0; i2 < matrix.length; i2++){
    for (j2=0; j2 < matrix[0].length; j2++){
      sum = sum + matrix[i2][j2];
    }
  }
  return sum;}

function largest_full_submatrix(matrix){
  for (n = 0; n < matrix.length+1; n++){
    for (i2 = 0; i2 < n; i2++){
      for (i3 = 0; i3 < n; i3++){
        if( matrix[i2][i3] == 0){
          return n-1
        }
      }
    }
  }
  return matrix.length
}

function compare_right_and_down_and_draw(a,b){
  ab_state = label[index(a,b)];
  i_touches_j(ab_state, ab_state, game_matrix);

  if(a == max_a && b == max_b){
  return  
  }

  if(a != max_a){
  right_state = label[index(a+1,b)];
  }

  if(b != max_b){
  down_state = label[index(a,b+1)];
  }

  if (ab_state != 0 && right_state > 0){
    draw_line(a, b, a+1, b);
    i_touches_j(ab_state,right_state,game_matrix);
  }

  if (ab_state != 0 && down_state > 0){
    draw_line(a, b, a, b+1);
    i_touches_j(ab_state, down_state, game_matrix);
  }}

function draw_all_lines(){
  for (b = 1; b < max_b ; b++){
    for (a = 0; a < max_a ; a++){
      compare_right_and_down_and_draw(a,b);
    }
  }
}

function highest_state(){
  var max_state = 0
  for (i = max_a; i < max_a*(max_b-1); i++){
    if(label[i] > max_state){
      max_state = label[i]
    }
  }
  return max_state
}

function menu_bar(){
  var prox_score = largest_full_submatrix(game_matrix);

  color_based_on_state("menu", 1, 0);
  color_based_on_state("menu", 0, 0);
  color_based_on_state("menu", max_a-3, 0);
  color_based_on_state("menu", max_a-2, 0);
  color_based_on_state("menu", max_a-1, 0);
  color_based_on_state("menu", 3, 0);


  var nov = number_of_vertices();
  print_string_at(nov, 0, 0);
  print_string_at(prox_score, 1, 0);
  print_string_at("\u2013", max_a-3, 0);
  print_string_at(max_vertex, max_a-2, 0);
  print_string_at("+", max_a-1, 0);
  print_string_at("S", 3, 0);
  return [nov, prox_score]
}

function click_function(){
  game_matrix = reset_game_matrix();
  change_max_vertex();
  draw_circles();
  color_circle_under_cursor();
  draw_all_lines(); 
  vertex_and_level = menu_bar();
  document.getElementById("game_vertices").value = vertex_and_level[0];
  document.getElementById("game_level").value = vertex_and_level[1];
  document.getElementById("game_max_a").value = max_a;
  document.getElementById("game_solution").value = label;
  perhaps_submit();
}

function initialize_everything(){
initialize_atox_and_btoy();
intialize_labels();
draw_circles(); // draws circles
game_matrix = reset_game_matrix();
vertex_and_level = menu_bar();
document.getElementById("game_vertices").value = vertex_and_level[0];
document.getElementById("game_level").value = vertex_and_level[1];
document.getElementById("game_max_a").value = max_a;
document.getElementById("game_solution").value = label;
}

initialize_everything();