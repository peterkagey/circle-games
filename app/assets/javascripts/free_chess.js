var canvas = document.getElementById("free_chess_canvas");
var context = canvas.getContext("2d");
canvas.width = 500
canvas.height = canvas.width * 1.2
var tile_width = (canvas.width)/8
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


context.fillRect(0, canvas.width, canvas.width, 100);


function show_piece_at(text_string, xy_array, color){
	var x = xy_array[0]; var y = xy_array[1]
	if (color == 'black'){
		var fillcolor = '#222222';
		var bordercolor = '#dddddd';
		var textcolor = '#888888';
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

var wR =  [0.5 * tile_width, 0.5 * tile_width, 'alive']
var wk =  [1.5 * tile_width, 0.5 * tile_width, 'alive']
var wB =  [2.5 * tile_width, 0.5 * tile_width, 'alive']
var wK =  [3.5 * tile_width, 0.5 * tile_width, 'alive']
var wQ =  [4.5 * tile_width, 0.5 * tile_width, 'alive']
var wB2 = [5.5 * tile_width, 0.5 * tile_width, 'alive']
var wk2 = [6.5 * tile_width, 0.5 * tile_width, 'alive']
var wR2 = [7.5 * tile_width, 0.5 * tile_width, 'alive']

var wp1 = [0.5 * tile_width, 1.5 * tile_width, 'alive']
var wp2 = [1.5 * tile_width, 1.5 * tile_width, 'alive']
var wp3 = [2.5 * tile_width, 1.5 * tile_width, 'alive']
var wp4 = [3.5 * tile_width, 1.5 * tile_width, 'alive']
var wp5 = [4.5 * tile_width, 1.5 * tile_width, 'alive']
var wp6 = [5.5 * tile_width, 1.5 * tile_width, 'alive']
var wp7 = [6.5 * tile_width, 1.5 * tile_width, 'alive']
var wp8 = [7.5 * tile_width, 1.5 * tile_width, 'alive']

var bR =  [0.5 * tile_width, 7.5 * tile_width, 'alive']
var bk =  [1.5 * tile_width, 7.5 * tile_width, 'alive']
var bB =  [2.5 * tile_width, 7.5 * tile_width, 'alive']
var bK =  [3.5 * tile_width, 7.5 * tile_width, 'alive']
var bQ =  [4.5 * tile_width, 7.5 * tile_width, 'alive']
var bB2 = [5.5 * tile_width, 7.5 * tile_width, 'alive']
var bk2 = [6.5 * tile_width, 7.5 * tile_width, 'alive']
var bR2 = [7.5 * tile_width, 7.5 * tile_width, 'alive']

var bp1 = [0.5 * tile_width, 6.5 * tile_width, 'alive']
var bp2 = [1.5 * tile_width, 6.5 * tile_width, 'alive']
var bp3 = [2.5 * tile_width, 6.5 * tile_width, 'alive']
var bp4 = [3.5 * tile_width, 6.5 * tile_width, 'alive']
var bp5 = [4.5 * tile_width, 6.5 * tile_width, 'alive']
var bp6 = [5.5 * tile_width, 6.5 * tile_width, 'alive']
var bp7 = [6.5 * tile_width, 6.5 * tile_width, 'alive']
var bp8 = [7.5 * tile_width, 6.5 * tile_width, 'alive']

function show_pieces(){
	if (wR[2] == 'alive') {show_piece_at('\u2656', wR,  'white')}
	if (wk[2] == 'alive') {show_piece_at('\u2658', wk,  'white')}
	if (wB[2] == 'alive') {show_piece_at('\u2657', wB,  'white')}
	if (wK[2] == 'alive') {show_piece_at('\u2654', wK,  'white')}
	if (wQ[2] == 'alive') {show_piece_at('\u2655', wQ,  'white')}
	if (wB2[2] == 'alive'){show_piece_at('\u2657', wB2, 'white')}
	if (wk2[2] == 'alive'){show_piece_at('\u2658', wk2, 'white')}
	if (wR2[2] == 'alive'){show_piece_at('\u2656', wR2, 'white')}
	if (wp1[2] == 'alive'){show_piece_at('\u2659', wp1, 'white')}
	if (wp2[2] == 'alive'){show_piece_at('\u2659', wp2, 'white')}
	if (wp3[2] == 'alive'){show_piece_at('\u2659', wp3, 'white')}
	if (wp4[2] == 'alive'){show_piece_at('\u2659', wp4, 'white')}
	if (wp5[2] == 'alive'){show_piece_at('\u2659', wp5, 'white')}
	if (wp6[2] == 'alive'){show_piece_at('\u2659', wp6, 'white')}
	if (wp7[2] == 'alive'){show_piece_at('\u2659', wp7, 'white')}
	if (wp8[2] == 'alive'){show_piece_at('\u2659', wp8, 'white')}

	if (bR[2] == 'alive') {show_piece_at('\u265C', bR,  'black')}
	if (bk[2] == 'alive') {show_piece_at('\u265E', bk,  'black')}
	if (bB[2] == 'alive') {show_piece_at('\u265D', bB,  'black')}
	if (bK[2] == 'alive') {show_piece_at('\u265A', bK,  'black')}
	if (bQ[2] == 'alive') {show_piece_at('\u265B', bQ,  'black')}
	if (bB2[2] == 'alive'){show_piece_at('\u265D', bB2, 'black')}
	if (bk2[2] == 'alive'){show_piece_at('\u265E', bk2, 'black')}
	if (bR2[2] == 'alive'){show_piece_at('\u265C', bR2, 'black')}
	if (bp1[2] == 'alive'){show_piece_at('\u265F', bp1, 'black')}
	if (bp2[2] == 'alive'){show_piece_at('\u265F', bp2, 'black')}
	if (bp3[2] == 'alive'){show_piece_at('\u265F', bp3, 'black')}
	if (bp4[2] == 'alive'){show_piece_at('\u265F', bp4, 'black')}
	if (bp5[2] == 'alive'){show_piece_at('\u265F', bp5, 'black')}
	if (bp6[2] == 'alive'){show_piece_at('\u265F', bp6, 'black')}
	if (bp7[2] == 'alive'){show_piece_at('\u265F', bp7, 'black')}
	if (bp8[2] == 'alive'){show_piece_at('\u265F', bp8, 'black')}
}

tile_board()
show_pieces()