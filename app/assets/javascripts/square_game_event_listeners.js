var dragging = false; var mouseDown = false;

var handlemousedown = function(event) { // Where the clickiness happens.
  mouseDown = true; dragging = false;
  var a; var b;
  var ab = ab_from_xy(canvasX, canvasY);
  a = ab[0]; b = ab[1];
  if (event.which == 1){
    if      (distance(canvasX, canvasY, atox[a_width-3], btoy[0]) < r && max_vertex > 1) { max_vertex--; }
    else if (distance(canvasX, canvasY, atox[a_width-1], btoy[0]) < r && max_vertex < 99){ max_vertex++; }
    else if (distance(canvasX, canvasY, atox[2], btoy[0]) < r){
      document.getElementById("new_square_game").submit(); return
    }
    else if (a_width > 6 && distance(canvasX, canvasY, atox[3], btoy[0]) < r){
      document.getElementById("new_square_game").submit(); // seems broken.
      window.location.assign("http://www.peterkagey.com/square_games"); //I'd prefer a "home_path" solution.
      return
    }
    else if (a_width > 7  && distance(canvasX, canvasY, atox[4], btoy[0])  < r){ move_everything("left");   }
    else if (a_width > 8  && distance(canvasX, canvasY, atox[5], btoy[0])  < r){ move_everything("right");  }
    else if (a_width > 9  && distance(canvasX, canvasY, atox[6], btoy[0])  < r){ move_everything("up");     }
    else if (a_width > 10 && distance(canvasX, canvasY, atox[7], btoy[0])  < r){ move_everything("down");   }
    else if (a_width > 11 && distance(canvasX, canvasY, atox[8], btoy[0])  < r){ resize_canvas("widen");    }
    else if (a_width > 12 && distance(canvasX, canvasY, atox[9], btoy[0])  < r){ resize_canvas("heighten"); }
    else if (a_width > 13 && distance(canvasX, canvasY, atox[10], btoy[0]) < r){ resize_canvas("narrow");   }
    else if (a_width > 14 && distance(canvasX, canvasY, atox[11], btoy[0]) < r){ resize_canvas("shorten");  }
    if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
      click_original_a = a; click_original_b = b;
      clickXdel = atox[a] - canvasX; clickYdel = btoy[b] - canvasY;
      value_of_moving_circle = labels[index(a,b)];
      labels[index(a,b)] = 0;
      refresh_canvas();
      saveCanvas();
      labels[index(a,b)] = value_of_moving_circle;
    }
    else { value_of_moving_circle = 0; }
  }
  if (event.which == 3){
    if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
      labels[index(a,b)] = (parseInt(labels[index(a,b)]) + 1) % (max_vertex + 1);
    }
  }
  refresh_canvas();
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

var handlemousemove = function(event){
  var coords = canvas.relMouseCoords(event);
  canvasX = coords.x;
  canvasY = coords.y;
  // refresh_canvas();
  if (mouseDown && event.which == 1 && value_of_moving_circle > 0){
    dragging = true;
    restoreCanvas();
    drawGameCircleAtXY(value_of_moving_circle, canvasX + clickXdel, canvasY + clickYdel, gameCircleFill)
  }
}

var handlemouseup = function(event){
  var a; var b;
  refresh_canvas();
  saveCanvas();
  mouseDown = false;
  if (dragging){
    var ab = ab_from_xy(canvasX+clickXdel, canvasY+clickYdel);
    a = ab[0]; b = ab[1];
    if (distance(atox[a], btoy[b], canvasX+clickXdel, canvasY+clickYdel) < r){
      labels[index(click_original_a, click_original_b)] = 0;
      labels[index(a,b)] = value_of_moving_circle;
      refresh_canvas();
    }
  } else {
    var ab = ab_from_xy(canvasX, canvasY);
    a = ab[0]; b = ab[1];
    if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
      if (event.which == 1){ update_state(a,b); }
      refresh_canvas();
    }
  }
  dragging = false; // does the magic on mouseup
}

var handlekeydown = function(){
  var ab = ab_from_xy(canvasX, canvasY);
  a = ab[0]; b = ab[1];
  if (distance(atox[a], btoy[b], canvasX, canvasY) < r){
    labels[index(a,b)] = 0;
    refresh_canvas();
    return false;
  }
}

canvas.addEventListener('mouseover', handlefocus, false);
canvas.addEventListener('mouseout', handlefocus, false);
canvas.addEventListener('keydown', handlekeydown, false);
canvas.addEventListener('mousedown', handlemousedown, false);
canvas.addEventListener('mousemove', handlemousemove, false);
canvas.addEventListener('mouseup', handlemouseup, false);
