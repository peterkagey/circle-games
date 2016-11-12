var canvas = document.getElementById("square_game_canvas");
var context = canvas.getContext("2d");

var scale = window.devicePixelRatio || 1

var backCanvas = document.createElement('canvas');
var backCtx = backCanvas.getContext('2d');
function saveCanvas() {
  backCanvas.width = canvas.width;
  backCanvas.height = canvas.height;
  backCtx.drawImage(canvas, 0,0);
}
function restoreCanvas(){ context.drawImage(backCanvas, 0,0);}

var default_a_width; var default_b_height;
var rubyA; var rubyB;
var a_width; var b_height;
var aShift; var bShift; var r;
var circleBorderColor = '#ccc'
var backgroundColor = '#ddd'
var gameCircleFill = '#346a5b'
var menuCircleFill = '#2c4d75'
var textColor = 'white'
var badConnectionColor = "red"
var goodConnectionColor = gameCircleFill
var labels = [];
var max_vertex = 3;
var level; var score;
var alec_string;
var coords; var canvasX; var canvasY
var font_size = 20; var border_width = 2;
var canvasBuffer = 20;

function set_r(){
  r = scale * Math.min(25, 0.5*canvas.width/(a_width*1.25)/scale);
  font_size = Math.round(4 * r / 5);
  border_width = r / 12
}

function initialize_everything(solutionString, rubyAShift, rubyBShift, rubyAVal, rubyBVal){
  rubyA = rubyAVal; aShift = rubyAShift
  rubyB = rubyBVal; bShift = rubyBShift
  set_size();
  initialize_atox_and_btoy();
  initialize_labels(a_width, b_height);
  set_initial_positions(solutionString);
  max_vertex = Math.max(max_label(), max_vertex);
  refresh_canvas();
}

function set_size(){
  default_a_width = Math.max(6, Math.round((window.innerWidth-scrollCompensate())/60));
  default_b_height = 10;
  //assume that a is too big, and b is never too big
  a_width = Math.max(rubyA, default_a_width);
  b_height = Math.max(rubyB+bShift+1, default_b_height);
  setCanvasSize();
  set_r();
}

var atox = []; var btoy = [];
function initialize_atox_and_btoy(){
  for (a = 0; a < a_width ; a++){
    atox[a] = 0.5*(canvas.width/a_width) + a*canvas.width/a_width;
  }
  for (b = 0; b < b_height ; b++){
     btoy[b] = 0.5*canvas.height/b_height + b*canvas.height/b_height;
  }
}
function initialize_labels(a, b){
  for (i = 0; i < a*(b-1); i++){
    labels[i] = 0;
  }
}
function set_initial_positions(solution_string){
  if (rubyA + aShift > a_width){
    aShift = a_width - rubyA
  };
  var solution_list = solution_string.split(",");
  var b_row = bShift;
  for (i = 0; i < solution_list.length; i++){
    var a_pos = (i % rubyA) + aShift;
    if (a_pos == aShift){
      b_row++;
    }
    labels[index(a_pos, b_row)] = parseInt(solution_list[i]);
  }
}
function color_and_label_all_circles(){
  for (b = 1; b < b_height ; b++){
    for (a = 0; a < a_width ; a++) {
      draw_circle_based_on_state(a, b);
    }
  }
}

var game_matrix;
function reset_game_matrix(){
  var n = Math.max(max_label(), max_vertex);
  var matrix = [];
  for(i = 0; i < n; i++) {
    matrix[i] = [];
    for (j = 0; j < n; j++) {
      if (i == j && labels.includes(i + 1)) {
        matrix[i][j] = 1;
      } else {
        matrix[i][j] = 0;
      }
    }
  }
  game_matrix = matrix;}

function distance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));
}

function update_state(a,b){
  i = index(a,b);
  (labels[i] > 0) ? labels[i]-- : labels[i] = max_vertex;
}

function draw_circle_based_on_state(a, b){
  var state;
  if (b == 0){ state = "menu"; }
  else { state = labels[index(a,b)]; }
  var x = atox[a]; var y = btoy[b]

  if (state == "menu") {
    drawCircleAtXY(x, y, menuCircleFill, menuCircleFill);
  } else if (state == 0) {
    drawCircleAtXY(x, y, backgroundColor, circleBorderColor);
  } else {
    drawGameCircleAtXY(state, x, y, gameCircleFill);
  }
}

function drawCircleAtXY(x, y, fillColor, strokeColor) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * 3.1415);
  context.fillStyle = fillColor;
  context.fill();
  context.lineWidth = border_width;
  context.strokeStyle = strokeColor;
  context.stroke();
}

function drawGameCircleAtXY(text_string, x, y, color) {
  drawCircleAtXY(x, y, color, color)
  print_string_at_xy(text_string, x, y);
}

function print_string_at_xy(text_string, x, y, flipstring){
  context.font = font_size + "px Helvetica";
  context.fillStyle = textColor;
  context.textAlign = 'center';
  if (flipstring == "flip"){
    context.rotate(Math.PI/2);
    context.fillText(text_string, y, -x + font_size/(2.62));
    context.rotate(-Math.PI/2);
  } else {
    context.fillText(text_string, x, y + font_size/(2.62));
  }
}

function color_and_print_string_at(string, a, b, flipstring){
  draw_circle_based_on_state(a,b);
  print_string_at_xy(string, atox[a], btoy[b], flipstring);
}

function colorValue(value){
  for (b = 1; b < b_height ; b++){
    for (a = 0; a < a_width ; a++){
      if (labels[index(a, b)] == value)
        drawGameCircleAtXY(labels[index(a, b)], atox[a], btoy[b], "#752c4d")
    }
  }
}

function number_of_vertices(){
  var count = 0;
  for (i = 0; i < a_width*(b_height-1); i++) {
    if (labels[i] != 0){ count++; }
  }
  return count
}

function connected(a1, b1, a2, b2) {
  var row = labels[index(a1, b1)] - 1
  var column = labels[index(a2, b2)] - 1
  return game_matrix[row][column] > 1
}

function draw_line(a1, b1, a2, b2){
  var x1, x2, y1, y2;
  context.beginPath();
  if (a1 == a2){
    x1 = atox[a1];
    x2 = atox[a2];
    y1 = btoy[Math.min(b1,b2)] + r + 2;
    y2 = btoy[Math.max(b1,b2)] - r - 2;
  } else {
    x1 = atox[Math.min(a1,a2)] + r + 2;
    x2 = atox[Math.max(a1,a2)] - r - 2;
    y1 = btoy[b1];
    y2 = btoy[b2];
  }
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineWidth = border_width * 2;

  if (connected(a1, b1, a2, b2)){
    context.strokeStyle = badConnectionColor;
  } else {
    context.strokeStyle = goodConnectionColor;
  }
  context.stroke();
}

function index(a,b) { return a_width * (b - 1) + a }

function max_label(){
  var max_l = 0
  for (i = 0; i < labels.length; i++){
    if (parseInt(labels[i]) > max_l){ max_l = labels[i]; }
  }
  return max_l
}

function ab_from_xy(x,y){
  var a; var b
  for (i = 0; i < a_width; i++){
    if (Math.abs(atox[i]-x) < r){ a = i; break; }
  }
  for (j = 0; j < b_height; j++){
    if (Math.abs(btoy[j]-y) < r){ b = j; break; }
  }
  return [a,b]
}

function i_touches_j(i, j, matrix){
  if (i != 0 && j != 0) {
    matrix[i-1][j-1]++;
    matrix[j-1][i-1]++;
  }
}

function largest_full_submatrix(matrix){
  for (n = 0; n < matrix.length+1; n++){
    for (i = 0; i < n; i++){
      for (j = 0; j < n; j++){
        if( matrix[i][j] == 0){ return n-1 }
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
      if (matrix[i][j] == 0) { alec_string = alec_string + " " + fix_s((j+1),len) }
      else                   { alec_string = alec_string + " " + fix_s("", len) }
    }
    alec_string = alec_string + "\n";
  }
  return alec_string
}

function compare_right_and_down_and_update(a,b){
  var ab_state = labels[index(a,b)];
  if (ab_state == 0) { return }

  if (a != a_width - 1 && labels[index(a + 1, b)] > 0 ) {
    i_touches_j(ab_state, labels[index(a + 1, b)], game_matrix);
  }
  if(b != b_height - 1 && labels[index(a,b+1)] > 0 ) {
    i_touches_j(ab_state, labels[index(a,b+1)], game_matrix);
  }
}

function compare_right_and_down_and_draw(a,b){
  ab_state = labels[index(a,b)];
  if(ab_state == 0) { return }
  if(a != a_width - 1 && labels[index(a+1,b)] > 0){
    draw_line(a, b, a+1, b);
  }
  if(b != b_height - 1 && labels[index(a,b+1)] > 0){
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

function set_rails_values(){
  document.getElementById("square_game_vertices").value  = score;
  document.getElementById("square_game_level").value     = level;
  document.getElementById("square_game_max_a").value     = a_width;
  document.getElementById("square_game_max_b").value     = b_height;
  document.getElementById("square_game_solution").value  = labels;
  document.getElementById("alec_notes").value            = alec_string;
}

function refresh_canvas(){
  canvas.width = canvas.width;
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = backgroundColor;
  context.fill();
  context.stroke();
  reset_game_matrix();
  color_and_label_all_circles();
  calculate_proximity_and_draw_all_lines();
  draw_menu_bar();
  set_alec_string();
  set_rails_values();
}

function setCanvasSize(){
  canvas.width = scale * Math.min(window.innerWidth-scrollCompensate() - 40, 63*a_width);
  canvas.height = (b_height * canvas.width) / a_width;
  canvas.style.width = canvas.width / scale + "px";
  canvas.style.height = canvas.height / scale + "px";
}

function resize_canvas(dimension){
  if (dimension == "widen"){
    a_width++;
    setCanvasSize()
    set_r();
    initialize_atox_and_btoy();
    for(i = 0; i < b_height-1; i++){
      labels.splice(i*a_width+a_width - 1, 0, 0);
    }
  }

  if (dimension == "heighten"){
    b_height++;
    setCanvasSize()
    initialize_atox_and_btoy();
    for(i = a_width*(b_height-2); i < a_width*(b_height-1); i++){
      labels[i] = 0;
    }
  }

  if (dimension == "narrow"){
    for(i = 0; i < labels.length/a_width; i++){
      if(labels[i * a_width + a_width - 1] != 0){
        return false;
      }
    }
    a_width--;
    setCanvasSize()
    set_r();
    initialize_atox_and_btoy();
    for(i = 1; i < b_height; i++){
      labels.splice(i * a_width, 1)
    }
  }

  if (dimension == "shorten"){
    for(i = 0; i < a_width; i++){
      if(labels[labels.length - 1 - i] != 0){
        return false;
      }
    }
    b_height--;
    setCanvasSize();
    initialize_atox_and_btoy();
    labels.splice(labels.length-a_width, a_width);
  }
}

function move_everything(direction){
  if (direction == "left"){
    for(i = 0; i < labels.length/a_width; i++){
      if(labels[i * a_width] != 0){ return false; }
    }
    labels.splice(labels.length, 0, 0);
    labels.shift();

  }else if(direction == "right"){
    for(i = 0; i < labels.length/a_width; i++){
      if(labels[i * a_width + a_width - 1] != 0){ return false; }
    }
    labels.splice(0, 0, 0);
    labels.pop();

  } else if (direction == "up"){
    for(i = 0; i < a_width; i++){
      if(labels[i] != 0){ return false; }
    }
    var top_row = labels.splice(0, a_width);
    labels = labels.concat(top_row);

  } else if (direction == "down"){
    for(i = 0; i < a_width; i++){
      if(labels[labels.length - 1 - i] != 0){ return false; }
    }
    var bottom_row = labels.splice(labels.length-a_width, a_width);
    labels = bottom_row.concat(labels);
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
  if(a_width > 6) { color_and_print_string_at("N", 3, 0); }
  if(a_width > 7) { color_and_print_string_at("\u2190", 4, 0) }
  if(a_width > 8) { color_and_print_string_at("\u2192", 5, 0); }
  if(a_width > 9) { color_and_print_string_at("\u2191", 6, 0); }
  if(a_width > 10){ color_and_print_string_at("\u2193", 7, 0); }
  if(a_width > 11){ color_and_print_string_at("\u2190\u2192", 8, 0); }
  if(a_width > 12){ color_and_print_string_at("\u2190\u2192", 9, 0, "flip"); }
  if(a_width > 13){ color_and_print_string_at("\u2192\u2190", 10, 0); }
  if(a_width > 14){ color_and_print_string_at("\u2192\u2190", 11, 0, "flip"); }
}

// Disable the menu when user right-clicks.
canvas.oncontextmenu = function(event) {
  return false;
}

$(document).ready(function(){
  $("#instr").click(function(){
    $("#instructions_paragraph").toggle();
  });
  $("#connect").click(function(){
    $("#alec_notes").toggle();
    $("#alec_notes").width(canvas.width - 30)
    document.getElementById("alec_notes").value = alec_string;
  });
  $("#best_sol").click(function(){
    $("li").toggle();
  });
});
