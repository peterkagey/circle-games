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
if (window.innerWidth < 600){
  max_a = 6;
  max_b = 8;
}else if(window.innerWidth < 1200){
  max_a = 12;
  max_b = 10;
}else{
  max_a = 18;
  max_b = 10;
}
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

function initialize_atox_and_btoy(){
  for (a = 0; a < max_a ; a++){
    atox[a] = 0.5*(canvas.width/max_a) + a*canvas.width/max_a;
  }
  for (b = 0; b < max_b ; b++){
     btoy[b] = 0.5*canvas.height/max_b + b*canvas.height/max_b;
  }}

function intialize_labels(){
  for (i = 0; i < max_a*(max_b-1); i++){
    label[i] = 0;
  }
}

function reset_canvas(){
  context.canvas.width = context.canvas.width;
}

function draw_circles(){
  for (b = 1; b < max_b ; b++){
    for (a = 0; a < max_a ; a++) {
      color_based_on_state(a, b);
    }
  }
}



function distance(x1, y1, x2, y2){return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));}

function update_state(a,b){
  i = index(a,b);
  label[i] = (label[i] + max_vertex) % (max_vertex+1);
}

function color_based_on_state(a, b){
  if (b == 0){
    state = "menu"
  }else{
    state = label[index(a,b)]
  }
  context.beginPath();
  context.arc(atox[a], btoy[b], r, 0, 2 * 3.1415);
  if (state == "menu"){
    context.fillStyle = color4;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "white";
  }else if (state == 0){
    context.fillStyle = color2;
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = color1;
  }else{
    context.fillStyle = color3;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "white";
    print_string_at(state, a, b);
  }
  context.stroke();
}

function print_string_at(text_string, a, b){
  context.font = '20px Helvetica';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText(text_string, atox[a], btoy[b] + 20/(2.62));} // make sure penultimate number is same as context.font

function color_and_print_string_at(string, a, b){
  color_based_on_state(a,b);
  print_string_at(string, a, b);
}

function change_circle_on_click(){
  coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
  if (distance(canvasX, canvasY, atox[max_a-3], btoy[0]) < r && max_vertex > 1){
    max_vertex--;
    return;
  }else if(distance(canvasX, canvasY, atox[max_a-1], btoy[0]) < r){
    max_vertex++;
    return;
  }else if(distance(canvasX, canvasY, atox[2], btoy[0]) < r){
    document.getElementById("new_game").submit();
  }

  for (i = 0; i < max_a; i++){
    if (Math.abs(atox[i]-canvasX) < r){
      a = i;
      break;
    }
  }
  for (j = 0; j < max_b; j++){
    if (Math.abs(btoy[j]-canvasY) < r){
      b = j;
      break;
    }
  }
  if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
    update_state(a,b);
    return;
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
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = 4;
  
  if(game_matrix[label[index(a1,b1)]-1][label[index(a2,b2)]-1] > 1){
    console.log();
    context.strokeStyle = 'red';
  }else{
    context.strokeStyle = 'white';
  }
  context.stroke();
}

function index(a,b){return max_a*(b-1) + a}

function max_label(){
  var max_l = 0
  for (i = 0; i < label.length; i++){
    if (label[i] > max_l){
      max_l = label[i];
    }
  }
  return max_l
}

function reset_game_matrix(){
  n = Math.max(max_label(), max_vertex);
  var matrix = [];
  for(i=0; i < n; i++) {
    matrix[i] = [];
    for(j=0; j < n; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix}

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

  if (ab_state > 0 && right_state > 0 && ab_state != right_state){
    console.log("right")
    i_touches_j(ab_state,right_state,game_matrix);
    draw_line(a, b, a+1, b);
  }

  if (ab_state > 0 && down_state > 0 && ab_state != down_state){
    console.log("down")
    i_touches_j(ab_state, down_state, game_matrix);
    draw_line(a, b, a, b+1);
  }
}

function calculate_proximity_and_draw_all_lines(){
  for (b = 1; b < max_b ; b++){
    for (a = 0; a < max_a ; a++){
      compare_right_and_down_and_draw(a,b);
    }
  }
}


function draw_menu_bar(){
  var prox_score = largest_full_submatrix(game_matrix);
  var nov = number_of_vertices();
  color_and_print_string_at(nov, 0, 0);
  color_and_print_string_at(prox_score, 1, 0);
  color_and_print_string_at("\u2013", max_a-3, 0);
  color_and_print_string_at(max_vertex, max_a-2, 0);
  color_and_print_string_at("+", max_a-1, 0);
  color_and_print_string_at("S", 2, 0);
  return [nov, prox_score]
}

function set_rails_values(ver, lev, lab){
  document.getElementById("game_vertices").value = ver;
  document.getElementById("game_level").value = lev;
  document.getElementById("game_max_a").value = max_a;
  document.getElementById("game_solution").value = lab;
}

function click_function(){
  change_circle_on_click();
  reset_canvas();
  game_matrix = reset_game_matrix();
  draw_circles();
  calculate_proximity_and_draw_all_lines();
  vertex_and_level = draw_menu_bar();
  set_rails_values(vertex_and_level[0], vertex_and_level[1], label);
}

function initialize_everything(){
  initialize_atox_and_btoy();
  intialize_labels();
  draw_circles(); // draws circles
  game_matrix = reset_game_matrix();
  vertex_and_level = draw_menu_bar();
  set_rails_values(vertex_and_level[0], vertex_and_level[1], label);}

initialize_everything();