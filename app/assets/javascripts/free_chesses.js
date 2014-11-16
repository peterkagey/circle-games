var canvas = document.getElementById("free_chess_canvas");
var context = canvas.getContext("2d");
canvas.width = 500
canvas.height = canvas.width
var tile_width = canvas.width / 8
var r = 0.9 * canvas.width / (16 * Math.sqrt(2))

function tile_board(){
	for (i = 0; i<64; i++){
		if( (i + Math.floor(i/8)) % 2 == 0) {
			var leftmost_x = (i % 8) * tile_width
			var topmost_y = Math.floor(i/8) * tile_width
			context.fillStyle = "grey"
			context.fillRect(leftmost_x, topmost_y, tile_width, tile_width);
		}
	}	
}

tile_board()

function show_piece_at(text_string, xy_array, color){
	var x = xy_array[0]; var y = xy_array[1]
	if (color == 'black'){
		var fillcolor = '#222222';
		var bordercolor = '#dddddd';
		var textcolor = '#dddddd';
	} else if (color == 'white') {
		var fillcolor = '#dddddd';
		var bordercolor = '#222222';
		var textcolor = '#222222';
	}
  context.beginPath();
  context.arc(x, y, r, 0, 2 * 3.1415);
	context.fillStyle = fillcolor;
	context.fill();
  context.strokeStyle = bordercolor;
  context.stroke();
  context.font = '20px Helvetica';
  context.fillStyle = textcolor;
  context.textAlign = 'center';
  context.fillText(text_string, x, y + 20/(2.62));
}

// This could be done in one 32 element array,
// Let's keep it explicit for now.

var wR = [0.5 * tile_width, 0.5 * tile_width]
var wk = [1.5 * tile_width, 0.5 * tile_width]
var wB = [2.5 * tile_width, 0.5 * tile_width]
var wK = [3.5 * tile_width, 0.5 * tile_width]
var wQ = [4.5 * tile_width, 0.5 * tile_width]
var wB2 = [5.5 * tile_width, 0.5 * tile_width]
var wk2 = [6.5 * tile_width, 0.5 * tile_width]
var wR2 = [7.5 * tile_width, 0.5 * tile_width]

var wp1 = [0.5 * tile_width, 1.5 * tile_width]
var wp2 = [1.5 * tile_width, 1.5 * tile_width]
var wp3 = [2.5 * tile_width, 1.5 * tile_width]
var wp4 = [3.5 * tile_width, 1.5 * tile_width]
var wp5 = [4.5 * tile_width, 1.5 * tile_width]
var wp6 = [5.5 * tile_width, 1.5 * tile_width]
var wp7 = [6.5 * tile_width, 1.5 * tile_width]
var wp8 = [7.5 * tile_width, 1.5 * tile_width]

var bR = [0.5 * tile_width, 7.5 * tile_width]
var bk = [1.5 * tile_width, 7.5 * tile_width]
var bB = [2.5 * tile_width, 7.5 * tile_width]
var bK = [3.5 * tile_width, 7.5 * tile_width]
var bQ = [4.5 * tile_width, 7.5 * tile_width]
var bB2 = [5.5 * tile_width, 7.5 * tile_width]
var bk2 = [6.5 * tile_width, 7.5 * tile_width]
var bR2 = [7.5 * tile_width, 7.5 * tile_width]

var bp1 = [0.5 * tile_width, 6.5 * tile_width]
var bp2 = [1.5 * tile_width, 6.5 * tile_width]
var bp3 = [2.5 * tile_width, 6.5 * tile_width]
var bp4 = [3.5 * tile_width, 6.5 * tile_width]
var bp5 = [4.5 * tile_width, 6.5 * tile_width]
var bp6 = [5.5 * tile_width, 6.5 * tile_width]
var bp7 = [6.5 * tile_width, 6.5 * tile_width]
var bp8 = [7.5 * tile_width, 6.5 * tile_width]

function initial_set_pieces(){
	show_piece_at('\u2656', wR, 'white')
	show_piece_at('\u2658', wk, 'white')
	show_piece_at('\u2657', wB, 'white')
	show_piece_at('\u2654', wK, 'white')
	show_piece_at('\u2655', wQ, 'white')
	show_piece_at('\u2657', wB2, 'white')
	show_piece_at('\u2658', wk2, 'white')
	show_piece_at('\u2656', wR2, 'white')
	show_piece_at('\u2659', wp1, 'white')
	show_piece_at('\u2659', wp2, 'white')
	show_piece_at('\u2659', wp3, 'white')
	show_piece_at('\u2659', wp4, 'white')
	show_piece_at('\u2659', wp5, 'white')
	show_piece_at('\u2659', wp6, 'white')
	show_piece_at('\u2659', wp7, 'white')
	show_piece_at('\u2659', wp8, 'white')

	show_piece_at('\u265C', bR, 'black')
	show_piece_at('\u265E', bk, 'black')
	show_piece_at('\u265D', bB, 'black')
	show_piece_at('\u265A', bK, 'black')
	show_piece_at('\u265B', bQ, 'black')
	show_piece_at('\u265D', bB2, 'black')
	show_piece_at('\u265E', bk2, 'black')
	show_piece_at('\u265C', bR2, 'black')
	show_piece_at('\u265F', bp1, 'black')
	show_piece_at('\u265F', bp2, 'black')
	show_piece_at('\u265F', bp3, 'black')
	show_piece_at('\u265F', bp4, 'black')
	show_piece_at('\u265F', bp5, 'black')
	show_piece_at('\u265F', bp6, 'black')
	show_piece_at('\u265F', bp7, 'black')
	show_piece_at('\u265F', bp8, 'black')
}