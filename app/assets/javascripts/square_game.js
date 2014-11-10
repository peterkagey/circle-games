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

var canvas = document.getElementById("square_game_canvas");
var context = canvas.getContext("2d");
// context.fillStyle = "red";
var default_a_width; var default_b_height;
var ruby_a; var ruby_b;
var a_width; var b_height;
var a_shift; var b_shift;
var r
var color1 = '#404040'; var color2 = '#444444'; var color3 = '#346a5b'; var color4 = '#2c4d75';
var game_matrix; var labels = [];
var atox = []; var btoy = [];
var max_vertex = 3;
var level; var score;
var alec_string;
var coords; var canvasX; var canvasY
var backCanvas = document.createElement('canvas');
var backCtx = backCanvas.getContext('2d');
var mouseDown = 0
var clickXdel; var clickYdel;
var click_original_a; var click_original_b;
var value_of_moving_circle
var dragging = false;

function saveCanvas(){
  backCtx.drawImage(canvas, 0,0);
}

function restoreCanvas(){
  context.drawImage(backCanvas, 0,0);
}

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

function reset_canvas(){
  canvas.width = canvas.width;
}

function color_and_label_all_circles(){
  for (b = 1; b < b_height ; b++){
    for (a = 0; a < a_width ; a++) {
      draw_circle_based_on_state(a, b);
    }
  }
}

function distance(x1, y1, x2, y2){return Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2));}

function update_state(a,b){
  i = index(a,b);
  (labels[i] > 0) ? labels[i]-- : labels[i] = max_vertex;
}

function draw_circle_based_on_state(a, b){
  var state;
  if (b == 0){
    state = "menu";
  }else{
    state = labels[index(a,b)];
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

function print_string_at(text_string, a, b, flipstring){
  context.font = '20px Helvetica';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  if (flipstring == "flip"){
  context.rotate(Math.PI/2);
  context.fillText(text_string, btoy[b], -atox[a] + 20/(2.62));
  context.rotate(-Math.PI/2);
  }else{
  context.fillText(text_string, atox[a], btoy[b] + 20/(2.62));
  }
} // make sure penultimate number is same as context.font

function print_string_at_xy(text_string, x, y, flipstring){
  context.font = '20px Helvetica';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  if (flipstring == "flip"){
  context.rotate(Math.PI/2);
  context.fillText(text_string, y, -x + 20/(2.62));
  context.rotate(-Math.PI/2);
  }else{
  context.fillText(text_string, x, y + 20/(2.62));
  }
} // make sure penultimate number is same as context.font

function color_and_print_string_at(string, a, b, flipstring){
  draw_circle_based_on_state(a,b);
  print_string_at(string, a, b, flipstring);
}

function number_of_vertices(){
  var count = 0;
  for (i = 0; i < a_width*(b_height-1); i++) {
    if (labels[i] != 0){
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
  
  if(game_matrix[labels[index(a1,b1)]-1][labels[index(a2,b2)]-1] > 1){
    context.strokeStyle = 'red';
  }else{
    context.strokeStyle = 'white';
  }
  context.stroke();
}

function index(a,b){return a_width*(b-1) + a}

function max_label(){
  var max_l = 0
  for (i = 0; i < labels.length; i++){
    if (parseInt(labels[i]) > max_l){
      max_l = labels[i];
    }
  }
  return max_l
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
  var ab_state = labels[index(a,b)];
  if(ab_state == 0){
  return
  }
  i_touches_j(ab_state, ab_state, game_matrix);

  if(a != a_width - 1 && labels[index(a+1,b)] > 0 && labels[index(a+1,b)] != ab_state){
    i_touches_j(ab_state, labels[index(a+1,b)], game_matrix);
  }
  if(b != b_height - 1 && labels[index(a,b+1)] > 0 && labels[index(a,b+1)] != ab_state){
    i_touches_j(ab_state, labels[index(a,b+1)], game_matrix);
  }
}

function compare_right_and_down_and_draw(a,b){
  ab_state = labels[index(a,b)];
  if(ab_state == 0){
  return
  }
  if(a != a_width - 1 && labels[index(a+1,b)] > 0 && labels[index(a+1, b)] != ab_state){
    draw_line(a, b, a+1, b);
  }
  if(b != b_height - 1 && labels[index(a,b+1)] > 0 && labels[index(a, b+1)] != ab_state){
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
    labels[index(a_pos, b_row)] = parseInt(solution_list[i]);
  }
}

function set_rails_values(){
  document.getElementById("square_game_vertices").value  = score;
  document.getElementById("square_game_level").value     = level;
  document.getElementById("square_game_max_a").value     = a_width;
  document.getElementById("square_game_max_b").value     = b_height;
  document.getElementById("square_game_solution").value  = labels;
  document.getElementById("alec_notes").value     = alec_string;
}

function refresh_canvas(){
  reset_canvas();
  context.rect(0,0,canvas.width,canvas.height);
  context.fillStyle = color2;
  context.fill();
  context.stroke();
  reset_game_matrix();
  color_and_label_all_circles();
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
  initialize_labels(a_width, b_height);
  set_initial_positions(solution_string);
  max_vertex = Math.max(max_label(), max_vertex);
  refresh_canvas();
}

function resize_canvas(dimension){
  if (dimension == "widen"){
    a_width++;
    canvas.width = Math.min(window.innerWidth-scrollCompensate(), 63*a_width);
    canvas.height = (b_height * canvas.width) / a_width;
    r = Math.min(25, 0.5*canvas.width/(a_width*1.25));
    initialize_atox_and_btoy();
    for(i = 0; i < b_height-1; i++){
      labels.splice(i*a_width+a_width - 1, 0, 0);
    }
  }
  if (dimension == "heighten"){
    b_height++;
    canvas.height = (b_height * canvas.width) / a_width;
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
    canvas.width = Math.min(window.innerWidth-scrollCompensate(), 63*a_width);
    canvas.height = (b_height * canvas.width) / a_width;
    r = Math.min(25, 0.5*canvas.width/(a_width*1.25));
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
    canvas.height = (b_height * canvas.width) / a_width;
    initialize_atox_and_btoy();
    labels.splice(labels.length-a_width, a_width);
  }
}

function set_size(){
  if (window.innerWidth < 600){
    default_a_width = 6;
    default_b_height = 10;
  }else if(window.innerWidth < 1200){
    default_a_width = 12;
    default_b_height = 10;
  }else{
    default_a_width = 18;
    default_b_height = 10;
  }
  //assume that a is too big, and b is never too big
  a_width = Math.max(ruby_a, default_a_width);
  b_height = Math.max(ruby_b+b_shift+1, default_b_height);
  // b_height = Math.max(ruby_b, default_b_height);
  canvas.width = Math.min(window.innerWidth-scrollCompensate(), 63*a_width);
  canvas.height = (b_height * canvas.width) / a_width;
  r = Math.min(25, 0.5*canvas.width/(a_width*1.25));
  backCanvas.width = canvas.width;
  backCanvas.height = canvas.height;
}

function move_everything(direction){
  if (direction == "left"){
    for(i = 0; i < labels.length/a_width; i++){
      if(labels[i * a_width] != 0){
        return false;
      }
    }
    labels.splice(labels.length, 0, 0);
    labels.shift();

  }else if(direction == "right"){  
    for(i = 0; i < labels.length/a_width; i++){
      if(labels[i * a_width + a_width - 1] != 0){
        return false;
      }
    }
    labels.splice(0, 0, 0);
    labels.pop();

  } else if (direction == "up"){
    for(i = 0; i < a_width; i++){
      if(labels[i] != 0){
        return false;
      }
    }
    var top_row = labels.splice(0, a_width);
    labels = labels.concat(top_row);

  } else if (direction == "down"){
    for(i = 0; i < a_width; i++){
      if(labels[labels.length - 1 - i] != 0){
        return false;
      }
    }
    var bottom_row = labels.splice(labels.length-a_width, a_width);
    labels = bottom_row.concat(labels);
  } else {
    return false;
  }
}

var handlemousedown = function() { // Where the clickiness happens.
  mouseDown++
  dragging = false;
  var a; var b;
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
  if (event.which == 1){
    if (distance(canvasX, canvasY, atox[a_width-3], btoy[0]) < r && max_vertex > 1){
      max_vertex--;
      refresh_canvas();
      return false;
    }else if(distance(canvasX, canvasY, atox[a_width-1], btoy[0]) < r){
      max_vertex++;
      refresh_canvas();
      return false;
    }else if(distance(canvasX, canvasY, atox[2], btoy[0]) < r){
      document.getElementById("new_square_game").submit();
      return
    }else if(a_width > 6 && distance(canvasX, canvasY, atox[3], btoy[0]) < r){
      document.getElementById("new_square_game").submit(); // seems broken.
      window.location.assign("http://www.peterkagey.com"); //I'd prefer a "home_path" solution.
      return
    }else if(a_width > 7 && distance(canvasX, canvasY, atox[4], btoy[0]) < r){
      move_everything("left");
      refresh_canvas();
      return false;
    }else if(a_width > 8 && distance(canvasX, canvasY, atox[5], btoy[0]) < r){
      move_everything("right");
      refresh_canvas();
      return false;
    }else if(a_width > 9 && distance(canvasX, canvasY, atox[6], btoy[0]) < r){
      move_everything("up");
      refresh_canvas();
      return false;
    }else if(a_width > 10 && distance(canvasX, canvasY, atox[7], btoy[0]) < r){
      move_everything("down");
      refresh_canvas();
      return false;
    }else if(a_width > 11 && distance(canvasX, canvasY, atox[8], btoy[0]) < r){
      resize_canvas("widen");
      refresh_canvas();
      return false;
    }else if(a_width > 12 && distance(canvasX, canvasY, atox[9], btoy[0]) < r){
      resize_canvas("heighten");
      refresh_canvas();
      return false;
    }else if(a_width > 13 && distance(canvasX, canvasY, atox[10], btoy[0]) < r){
      resize_canvas("narrow");
      refresh_canvas();
      return false;
    }else if(a_width > 14 && distance(canvasX, canvasY, atox[11], btoy[0]) < r){
      resize_canvas("shorten");
      refresh_canvas();
      return false;
    }
    if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
      click_original_a = a;
      click_original_b = b;
      clickXdel = atox[a] - canvasX;
      clickYdel = btoy[b] - canvasY;
      value_of_moving_circle = labels[index(a,b)];
      labels[index(a,b)] = 0;
      refresh_canvas();
      saveCanvas();
      labels[index(a,b)] = value_of_moving_circle;
      refresh_canvas();
      return false;
    }else{
      value_of_moving_circle = 0;
    }
  }
  if (event.which == 3){
    if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
      labels[index(a,b)] = (parseInt(labels[index(a,b)]) + 1) % (max_vertex + 1);
      refresh_canvas();
      return false;
    }
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
  if(a_width > 7){
    color_and_print_string_at("\u2190", 4, 0)
  }
  if(a_width > 8){
    color_and_print_string_at("\u2192", 5, 0);
  }
  if(a_width > 9){
    color_and_print_string_at("\u2191", 6, 0);
  }
  if(a_width > 10){
    color_and_print_string_at("\u2193", 7, 0);
  }
  if(a_width > 11){
    color_and_print_string_at("\u2190\u2192", 8, 0);
  }
  if(a_width > 12){
    color_and_print_string_at("\u2190\u2192", 9, 0, "flip");
  }
  if(a_width > 13){
    color_and_print_string_at("\u2192\u2190", 10, 0);
  }
  if(a_width > 14){
    color_and_print_string_at("\u2192\u2190", 11, 0, "flip");
  }
}

canvas.oncontextmenu = function() {
  return false;
}

var handlefocus = function(e){
  if(e.type=='mouseover'){
    canvas.focus();
    return false;
  }else if(e.type=='mouseout'){
    canvas.blur();
    return false;
  }
  return true;
};

var handlemousemove = function(){
  var coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
  // refresh_canvas();
  if(mouseDown && event.which == 1 && value_of_moving_circle > 0){
    dragging = true;
    restoreCanvas();
    context.beginPath();
    context.arc(canvasX + clickXdel, canvasY + clickYdel, r, 0, 2 * 3.1415);
    context.fillStyle = color3;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "white";
    context.stroke();
    print_string_at_xy(value_of_moving_circle, canvasX + clickXdel, canvasY + clickYdel);
  }
}

var handlemouseup = function(){
  var a; var b;
  refresh_canvas();
  saveCanvas();
  mouseDown--
  if (dragging){
    for (i = 0; i < a_width; i++){
      if (Math.abs(atox[i] - (canvasX+clickXdel)) < r){
        a = i;
        break;
      }
    }
    for (j = 1; j < b_height; j++){
      if (Math.abs(btoy[j] - (canvasY+clickYdel)) < r){
        b = j;
        break;
      }
    }
    if (distance(atox[a], btoy[b], canvasX+clickXdel, canvasY+clickYdel) < r){
      labels[index(click_original_a, click_original_b)] = 0;
      labels[index(a,b)] = value_of_moving_circle;
      refresh_canvas();
    }
  }else{
    for (i = 0; i < a_width; i++){
      if (Math.abs(atox[i] - canvasX) < r){
        a = i;
        break;
      }
    }
    for (j = 1; j < b_height; j++){
      if (Math.abs(btoy[j] - canvasY) < r){
        b = j;
        break;
      }
    }
    if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
      if (event.which == 1){
        update_state(a,b);
      }
      refresh_canvas();
    }
  }
  dragging = false; // does the magic on mouseup
}

var handlekeydown = function(){
  var a; var b
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
    labels[index(a,b)] = 0;
    refresh_canvas();
    return false;
  }
}

function saveCanvas(){
  backCtx.drawImage(canvas, 0,0);
}

function restoreCanvas(){
  context.drawImage(backCanvas, 0,0);
}

canvas.addEventListener('mouseover', handlefocus, false);
canvas.addEventListener('mouseout', handlefocus, false);
canvas.addEventListener('keydown', handlekeydown, false);
canvas.addEventListener('mousedown', handlemousedown, false);
canvas.addEventListener('mousemove', handlemousemove, false);
canvas.addEventListener('mouseup', handlemouseup, false);

$(document).ready(function(){
  $("#instr").click(function(){
    $("#instructions_paragraph").toggle();
  });
});
$(document).ready(function(){
  $("#connect").click(function(){
    $("#alec_notes").toggle();
  });
});
$(document).ready(function(){
  $("#best_sol").click(function(){
    $("li").toggle();
  });
});