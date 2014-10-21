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

//////////////////////////////////////////////////////

//Canvas setup.
var standard_a_width; var standard_b_height;
var a_width; var b_height;
var ruby_a; var ruby_b;
var canvas = document.getElementById("game_canvas");
var r
var a_shift; var b_shift;

var context = canvas.getContext("2d");
context.fillStyle = "#cccccc";
var color1 = '#404040'; var color2 = '#444444'; var color3 = '#346a5b'; var color4 = '#2c4d75';


var game_matrix; var label = [];
var atox = []; var btoy = [];
var max_vertex = 3;
var level; var score;
var alec_string;

function initialize_atox_and_btoy(){
  for (a = 0; a < a_width ; a++){
    atox[a] = 0.5*(canvas.width/a_width) + a*canvas.width/a_width;
  }
  for (b = 0; b < b_height ; b++){
     btoy[b] = 0.5*canvas.height/b_height + b*canvas.height/b_height;
  }}

function intialize_labels(a, b){
  for (i = 0; i < a*(b); i++){
    label[i] = 0;
  }
}

function reset_canvas(){
  context.canvas.width = context.canvas.width;
}

function draw_circles(){
  for (b = 1; b < b_height ; b++){
    for (a = 0; a < a_width ; a++) {
      color_based_on_state(a, b);
    }
  }
}

function distance(x1, y1, x2, y2){return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));}

function update_state(a,b){
  i = index(a,b);
  if (label[i] > 0){
    label[i]--;
  }else{
    label[i] = max_vertex;
  }
}

function color_based_on_state(a, b){
  var state;
  if (b == 0){
    state = "menu";
  }else{
    state = label[index(a,b)];
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

function number_of_vertices(){
  var count = 0;
  for (i = 0; i < a_width*(b_height-1); i++) {
    if (label[i] != 0){
      count++;
    }
  }
  return count}


function draw_line(a1, b1, a2, b2){
  var x1, x2, y1, y2;
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
    context.strokeStyle = 'red';
  }else{
    context.strokeStyle = 'white';
  }
  context.stroke();
}

function index(a,b){return a_width*(b-1) + a}

function max_label(){
  var max_l = 0
  for (i = 0; i < label.length; i++){
    if (parseInt(label[i]) > max_l){
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
  game_matrix = matrix;}

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
  return alec_string
}

function compare_right_and_down_and_update(a,b){
  var ab_state = label[index(a,b)];
  if(ab_state == 0){
  return
  }
  i_touches_j(ab_state, ab_state, game_matrix);

  if(a != a_width - 1 && label[index(a+1,b)] > 0 && label[index(a+1,b)] != ab_state){
    i_touches_j(ab_state, label[index(a+1,b)], game_matrix);
  }
  if(b != b_height - 1 && label[index(a,b+1)] > 0 && label[index(a,b+1)] != ab_state){
    i_touches_j(ab_state, label[index(a,b+1)], game_matrix);
  }
}

function compare_right_and_down_and_draw(a,b){
  ab_state = label[index(a,b)];
  if(ab_state == 0){
  return
  }
  if(a != a_width - 1 && label[index(a+1,b)] > 0 && label[index(a+1, b)] != ab_state){
    draw_line(a, b, a+1, b);
  }
  if(b != b_height - 1 && label[index(a,b+1)] > 0 && label[index(a, b+1)] != ab_state){
    draw_line(a, b, a, b+1);
  }
}

function calculate_proximity_and_draw_all_lines(){ // FIXME : this was split up to draw more red lines; inefficient.
  for (b = 1; b < b_height ; b++){
    for (a = 0; a < a_width ; a++){
      compare_right_and_down_and_update(a,b);
    }
  }
  for (b = 1; b < b_height ; b++){
    for (a = 0; a < a_width ; a++){
      compare_right_and_down_and_draw(a,b);
    }
  }
}

function set_initial_positions(solution_string){
  console.log(ruby_a + a_shift, a_width); 
  if (ruby_a + a_shift > a_width){
    a_shift = a_width - ruby_a
  }; 
  var solution_list = solution_string.split(",");
  var b_row = b_shift;
  for (i = 0; i < solution_list.length; i++){
    var a_pos = (i % ruby_a) + a_shift;
    if (a_pos == a_shift){
      b_row++;
    }
    label[index(a_pos, b_row)] = solution_list[i];
  }
}

function draw_menu_bar(){
  level = largest_full_submatrix(game_matrix);
  score = number_of_vertices();
  color_and_print_string_at(level, 0, 0);
  color_and_print_string_at(score, 1, 0);
  color_and_print_string_at("\u2013", a_width-3, 0);
  color_and_print_string_at(max_vertex, a_width-2, 0);
  color_and_print_string_at("+", a_width-1, 0);
  color_and_print_string_at("S", 2, 0);
  if(a_width > 6){
    color_and_print_string_at("N", 3, 0);
  }
}

function set_rails_values(){
  document.getElementById("game_vertices").value  = score;
  document.getElementById("game_level").value     = level;
  document.getElementById("game_max_a").value     = a_width;
  document.getElementById("game_max_b").value     = b_height;
  document.getElementById("game_solution").value  = label;
  document.getElementById("alec_notes").value     = alec_string;
}

function click_function(){
  reset_canvas();
  reset_game_matrix();
  draw_circles();
  calculate_proximity_and_draw_all_lines();
  draw_menu_bar();
  set_alec_string();
  set_rails_values();
}

function initialize_everything(solution_string, ruby_a_shift, ruby_b_shift, ruby_a_width, ruby_b_height){
  ruby_a = ruby_a_width;
  ruby_b = ruby_b_height;
  a_shift = ruby_a_shift;
  b_shift = ruby_b_shift;
  set_size();
  initialize_atox_and_btoy();
  intialize_labels(a_width, b_height);
  set_initial_positions(solution_string);
  max_vertex = Math.max(max_label(), max_vertex);
  draw_circles(); // draws circles
  reset_game_matrix();
  calculate_proximity_and_draw_all_lines();
  set_alec_string();
  draw_menu_bar();
  set_rails_values();
}

function set_size(){
  if (window.innerWidth < 600){
    standard_a_width = 6;
    standard_b_height = 10;
  }else if(window.innerWidth < 1200){
    standard_a_width = 12;
    standard_b_height = 10;
  }else{
    standard_a_width = 18;
    standard_b_height = 10;
  }
  //assume that a is too big, and b is never too big
  a_width = Math.max(ruby_a, standard_a_width);
  b_height = 10;
  // b_height = Math.max(ruby_b, standard_b_height);
  canvas.width = Math.min(window.innerWidth-scrollCompensate(), 63*a_width);
  canvas.height = (b_height * canvas.width) / a_width;
  r = Math.min(25, 0.5*canvas.width/(a_width*1.25));
}

canvas.oncontextmenu = function() { // FIXME : this isn't very DRY.
  var coords = canvas.relMouseCoords(event);
  var canvasX = coords.x;
  var canvasY = coords.y;

  for (i = 0; i < a_width; i++){
    if (Math.abs(atox[i]-canvasX) < r){
      a = i;
      break;
    }
  }
  for (j = 0; j < b_height; j++){
    if (Math.abs(btoy[j]-canvasY) < r){
      b = j;
      break;
    }
  }
  if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
    label[index(a,b)] = 0;
    click_function();
    return false;
  }
  // click_function();
  click_function();
  return false;
}

canvas.onclick = function() {
  var coords = canvas.relMouseCoords(event);
  var canvasX = coords.x;
  var canvasY = coords.y;

  if (distance(canvasX, canvasY, atox[a_width-3], btoy[0]) < r && max_vertex > 1){
    max_vertex--;
    click_function();
    return false;
  }else if(distance(canvasX, canvasY, atox[a_width-1], btoy[0]) < r){
    max_vertex++;
    click_function();
    return false;
  }else if(distance(canvasX, canvasY, atox[2], btoy[0]) < r){
    document.getElementById("new_game").submit();
    return
  }else if(a_width > 6 && distance(canvasX, canvasY, atox[3], btoy[0]) < r){
    document.getElementById("new_game").submit();
    window.location.assign("http://www.peterkagey.com"); //I'd prefer a "home_path"
    return
  }

  for (i = 0; i < a_width; i++){
    if (Math.abs(atox[i]-canvasX) < r){
      a = i;
      break;
    }
  }
  for (j = 0; j < b_height; j++){
    if (Math.abs(btoy[j]-canvasY) < r){
      b = j;
      break;
    }
  }
  if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
    update_state(a,b);
    click_function();
    return false;
  }
  // click_function();
  click_function();
  return false;
}