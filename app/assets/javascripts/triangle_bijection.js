'use strict';
function initializeSlider(){
  var n = document.getElementById("sliders").children.length
  var selected_slider = null

  function array_move(old_index, new_index) {
    if(new_index==null || new_index==old_index) { return; }
    var wrapper = document.getElementById("sliders");
    var containers = wrapper.children
    var sliders = []
    for (i=0; i<n; i++){
      sliders[i] = containers[i].firstElementChild
    }
    sliders.splice(new_index, 0, sliders.splice(old_index, 1)[0])
    for(i=0; i < n; i++){
      containers[i].innerHTML = null;
      containers[i].appendChild(sliders[i]);
    }
  };

  // Make draggable ghost transparent.
  document.addEventListener("dragstart", function( event ) {
    var img = new Image();
    // Transparent image.
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(img, 0, 0);
  }, false);

  for(var i=0; i<n;  i++) {
    document.getElementById("sliders").children[i]
    .addEventListener('dragenter', function(e) {
      if (e.target.className == "container inline") {
        var new_position = containerIndex(e.target);
      } else if (e.target.className.includes("slider")) {
        var new_position = sliderIndex(e.target);
      } else {
        return;
      }
      array_move(selected_slider, new_position);
      selected_slider = new_position;
    });
  }
  function containerIndex(s) {
    var sliders = Array.from(document.getElementsByClassName("container inline"))
    var selected_index = null
    for(var i = 0; i < n; i++) {
      if (sliders[i] == s) {
        selected_index = i
        break;
      }
    }
    return selected_index
  }

  function sliderIndex(s) {
    var sliders = Array.from(document.getElementsByClassName("slider"))
    var selected_index = null
    for(var i = 0; i < n; i++) {
      if (sliders[i] == s) {
        selected_index = i
        break;
      }
    }
    return selected_index
  }

  Array.from(document.getElementsByClassName("slider")).forEach(s =>
    s.addEventListener('dragstart', function(e) {
      selected_slider = sliderIndex(e.target)
    })
  );
}

'use strict';

function mainCanvas() {
  var canvas = document.getElementById("html_canvas");
  var size = 500;
  var scaleFactor = window.devicePixelRatio || 1;
  var width = Math.floor(size/(Math.sqrt(3)/2))
  canvas.width  = scaleFactor * width;
  canvas.height = scaleFactor * size;
  canvas.style.width = width + "px";
  canvas.style.height = size + "px";
  var context = canvas.getContext("2d");
  context.scale(scaleFactor,scaleFactor)

  var n;
  var a, b, c, d;
  updateFromSlider()
  var scale = width/(2*n);

  function resizeBoxes(){
    var box_size = Math.floor(width/(n+2))-4
    document.getElementById("sliders").style.width = 0 + "px";
    var containers = document.getElementsByClassName("container")
    containers[0].style.padding = "4px 2px 4px 4px"
    containers[containers.length - 1].style.padding = "4px 4px 4px 2px"
    for(var i=0;i<containers.length;i++){
      containers[i].style.height = box_size + "px";
      containers[i].style.width = box_size + "px";
      containers[i].firstElementChild.style.height = box_size + "px";
      containers[i].firstElementChild.style.width = box_size + "px";
    }
  }

  function updateFromSlider() {
    n = getValues()["pointsPerSide"];
    [a, b, c, d] = getValues()["indices"];
  }

  function getValues() {
    var n = -2
    var indices = []
    var sliders = document.getElementsByClassName("slider")
    for(var i=0;i<sliders.length;i++) {
      n++;
      if (sliders[i].className.includes("active")) {
        indices.push(i);
      }
    }
    return {"indices": indices, "pointsPerSide": n}
  }

  function resetCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  }

  function coordsToPoint(row, column) {
    return [
      width/2 + (2*column-row)*scale,
      1.732*(row + 0.5)*scale
    ]
  }

  function drawTriangularGrid() {
    for (var row = 0; row < n; row++) {
      for (var column = 0; column <= row; column++) {
        context.beginPath();
        context.fillStyle = "#666666";
        var [x,y] = coordsToPoint(row, column);
        context.arc(x,y,scale/4,0,2*Math.PI)
        context.fill();
        context.closePath();
      }
    }
  }

  function drawChristmasTreeStar(x1, y1) {
    context.beginPath();
    context.setLineDash([]);
    context.fillStyle = "#FF0000";
    context.strokeStyle = '#FF0000';
    context.lineWidth = scale/10;
    context.arc(x1,y1,scale/3,0,2*Math.PI);
    context.fill();
    context.closePath();
  }

  function drawUprightPerimeter(x1, y1, x2, y2, x3, y3){
    // Draw triangle
    context.beginPath();
    context.setLineDash([4,4]);
    context.lineWidth = scale/8;
    context.strokeStyle = '#FF0000';
    context.fillStyle = "#FF0000";
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.lineTo(x3,y3);
    context.lineTo(x1,y1);
    context.stroke();
    context.closePath();
  }

  function drawUprightTriangle() {
    var distFromRight = n + 1 - d;
    var distFromLeft = c - b - 1;
    var [topX, topY] = [distFromRight + distFromLeft, distFromLeft]
    var [x1, y1] = coordsToPoint(topX, topY)         // top
    var [x2, y2] = coordsToPoint(topX + b, topY)     // bottom left
    var [x3, y3] = coordsToPoint(topX + b, topY + b) // bottom right
    drawChristmasTreeStar(x1, y1);
    drawUprightPerimeter(x1, y1, x2, y2, x3, y3)
  }

  function drawCrookedPerimeter(x1, y1, x2, y2, x3, y3){
    context.beginPath();
    context.setLineDash([])
    context.lineWidth = scale/8;
    context.strokeStyle = '#0000FF';
    context.fillStyle = "#6666FF";
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.lineTo(x3,y3);
    context.lineTo(x1,y1);
    context.fill();
    context.stroke();
    context.closePath();
  }
  function drawCrookedTriangle() {
    var distFromRight = n + 1 - d;
    var distFromLeft = c - b - 1;
    var [topX, topY] = [distFromRight + distFromLeft, distFromLeft];
    var [x1,y1] = coordsToPoint(topX + a, topY);
    var [x2,y2] = coordsToPoint(topX + b, topY + a);
    var [x3,y3] = coordsToPoint(topX + b- a, topY + b - a);
    drawCrookedPerimeter(x1, y1, x2, y2, x3, y3);
  }

  function drawGridPerimeter() {
    var [x1, y1] = coordsToPoint(0,   0)         // top
    var [x2, y2] = coordsToPoint(n-1, 0)     // bottom left
    var [x3, y3] = coordsToPoint(n-1, n-1) // bottom right
    // Draw triangle
    context.beginPath();
    context.setLineDash([]);
    context.lineWidth = scale/10;
    context.strokeStyle = '#00AA00';
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.lineTo(x3,y3);
    context.lineTo(x1,y1);
    context.stroke();
    context.closePath();
  }

  function refreshImage() {
    resetCanvas();
    updateFromSlider();
    drawGridPerimeter();
    drawTriangularGrid();
    drawCrookedTriangle();
    drawUprightTriangle();
  }

  resizeBoxes()
  refreshImage()
  document.addEventListener('dragenter', function(e) {refreshImage()})
}
'use strict';

function explanationCanvas() {
  var canvas = document.getElementById("html_canvas2");
  var size = 500;
  var scaleFactor = window.devicePixelRatio || 1;
  var width = Math.floor(size/(Math.sqrt(3)/2))

  canvas.width  = scaleFactor * width;
  canvas.height = scaleFactor * size;
  canvas.style.width = width + "px";
  canvas.style.height = size + "px";
  var context = canvas.getContext("2d");
  context.scale(scaleFactor,scaleFactor)

  var n;
  var a, b, c, d;
  updateFromSlider()
  var scale = width/(2*n);

  function updateFromSlider() {
    n = getValues()["pointsPerSide"];
    [a, b, c, d] = getValues()["indices"];
  }

  function getValues() {
    var n = 0
    var indices = []
    var sliders = document.getElementsByClassName("slider")
    for(var i=0;i<sliders.length;i++) {
      n++;
      if (sliders[i].className.includes("active")) {
        indices.push(i);
      }
    }
    return {"indices": indices, "pointsPerSide": n}
  }

  function resetCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  }


  function coordsToPoint(row, column) {
    return [
      width/2 + (2*column-row)*scale,
      1.732*(row + 0.5)*scale
    ]
  }

  function drawFoundation() {
    for (var column = 0; column <= n-1; column++) {
      context.beginPath();
      context.fillStyle = "#888888";
      var [x,y] = coordsToPoint(n-1, column);
      context.rect(x-(0.6*scale),y-(0.6*scale),1.2*scale,1.2*scale)
      context.fill();
      context.closePath();

      context.beginPath();
      if ([a, b, c, d].includes(column)) {
        // 255, 127, 80
        context.fillStyle = "coral";
      } else {
        context.fillStyle = "#FFFFFF";
      }

      var [x,y] = coordsToPoint(n-1, column);
      context.rect(x-(0.5*scale),y-(0.5*scale),scale,scale)
      context.fill();
      context.closePath();
    }
  }

  function drawTriangularGrid() {
    // Position/orientation
    for (var row = 0; row < n - 1; row++) {
      for (var column = 0; column <= b + 1 - (n - row); column++) {
        context.beginPath();
        context.fillStyle = "#666666";
        var [x,y] = coordsToPoint(row, column);
        context.arc(x,y,scale/4,0,2*Math.PI)
        context.fill();
        context.closePath();
      }
    }
    for (var row = b; row < n - 1; row++) {
      for (var column = b+1; column <= row; column++) {
        context.beginPath();
        context.fillStyle = "#666666";
        var [x,y] = coordsToPoint(row, column);
        context.arc(x,y,scale/4,0,2*Math.PI)
        context.fill();
        context.closePath();
      }
    }
  }

  function drawChristmasTreeStar(x1, y1) {
    context.beginPath();
    context.setLineDash([]);
    context.fillStyle = "#FF0000";
    context.strokeStyle = '#FF0000';
    context.lineWidth = scale/10;
    context.arc(x1,y1,scale/3,0,2*Math.PI);
    context.fill();
    context.closePath();
  }

  function drawUprightPerimeter(x1, y1, x2, y2, x3, y3, drawBottom=true){
    // Draw triangle
    context.beginPath();
    context.setLineDash([4,4]);
    context.lineWidth = scale/8;
    context.strokeStyle = '#FF0000';
    context.moveTo(x3,y3);
    context.lineTo(x1,y1);
    context.lineTo(x2,y2);
    if (drawBottom) { context.lineTo(x3,y3) }
    context.stroke();
    context.closePath();
  }

  function drawUprightTriangle() {
    var distFromRight = n - b - 1;
    [distFromRight, 0]
    var [x1, y1] = coordsToPoint(distFromRight, 0)         // top
    var [x2, y2] = coordsToPoint(distFromRight + b, 0)     // bottom left
    var [x3, y3] = coordsToPoint(distFromRight + b, b) // bottom right
    drawChristmasTreeStar(x1, y1);
    drawUprightPerimeter(x1, y1, x2, y2, x3, y3)
  }

  function drawCrookedPerimeter(x1, y1, x2, y2, x3, y3){
    context.beginPath();
    context.setLineDash([])
    context.lineWidth = scale/8;
    context.strokeStyle = '#0000FF';
    context.fillStyle = "#6666FF";
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.lineTo(x3,y3);
    context.lineTo(x1,y1);
    context.fill();
    context.stroke();
    context.closePath();
  }
  function drawCrookedTriangle() {
    var distFromRight = n - b - 1;
    var [x1,y1] = coordsToPoint(distFromRight + a, 0);
    var [x2,y2] = coordsToPoint(distFromRight + b, a);
    var [x3,y3] = coordsToPoint(distFromRight + b - a, b - a);
    drawCrookedPerimeter(x1, y1, x2, y2, x3, y3);
  }

  function drawLegs(x2,y2,x3,y3,x21,y21,x31,y31) {
    context.beginPath();
    context.setLineDash([4,4]);
    context.lineWidth = scale/8;
    context.strokeStyle = '#666666';
    context.moveTo(x3,y3);
    context.lineTo(x31,y31);
    context.moveTo(x21,y21);
    context.lineTo(x2,y2);
    context.stroke();
    context.closePath();
  }

  function drawPositionTriangle() {
      // Draw triangle
      var distFromRight = n - 1 - d;
      var distFromLeft = c;
      var [topX, topY] = [distFromRight + distFromLeft, distFromLeft]
      var [x1, y1] = coordsToPoint(topX, topY)                 // top
      var [x2, y2] = coordsToPoint(topX + (d-c), topY)         // bottom left
      var [x3, y3] = coordsToPoint(topX + (d-c), topY + (d-c)) // bottom right

      if ((d-c) >= b) {
        var [x2, y2]   = coordsToPoint(topX + (d-c), topY)         // bottom left
        var [x21, y21] = coordsToPoint(topX + b, topY)                 // top
        var [x3, y3]   = coordsToPoint(topX + (d-c), topY + (d-c)) // bottom right
        var [x31, y31] = coordsToPoint(topX + b, topY + b)                 // top
        drawUprightPerimeter(x1,y1,x21,y21,x31,y31);
        drawLegs(x2,y2,x3,y3,x21,y21,x31,y31);
    } else {
      drawUprightPerimeter(x1,y1,x2,y2,x3,y3,false)
    }
    drawChristmasTreeStar(x1, y1);
  }

  function drawGridPerimeter() {
    var distFromLeft = b + 1;
    var sideLength = n-b-2;
    var [topX, topY] = [distFromLeft, distFromLeft]
    var [x1, y1] = coordsToPoint(topX, topY)         // top
    var [x2, y2] = coordsToPoint(topX + sideLength, topY)     // bottom left
    var [x3, y3] = coordsToPoint(topX + sideLength, topY + sideLength) // bottom right
    // Draw triangle
    context.beginPath();
    context.setLineDash([]);
    context.lineWidth = scale/10;
    context.strokeStyle = '#00AA00';
    context.moveTo(x3,y3);
    context.lineTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.closePath();
  }
  function drawPartitionLine() {
      var [x,y] = coordsToPoint(n - 1, b + 1/2)
      context.beginPath();
      context.setLineDash([]);
      context.lineWidth = scale/15;
      context.strokeStyle = '#000000';
      context.moveTo(x,0);
      context.lineTo(x,canvas.height);
      context.stroke();
      context.closePath();
  }

  function refreshImage() {
    resetCanvas();
    updateFromSlider();
    drawGridPerimeter();
    drawTriangularGrid();
    drawCrookedTriangle();
    drawUprightTriangle();
    drawPartitionLine();
    drawPositionTriangle();
    drawFoundation()
  }

  refreshImage()
  document.addEventListener('dragenter', function(e) {refreshImage()})
}

initializeSlider()
mainCanvas()
explanationCanvas()
