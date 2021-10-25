
////////////////////////////////////////////////////////////////
// keyboard
////////////////////////////////////////////////////////////////


let _keyboard_paused = false;

// 's' : save canvas to a png file
// 'p' : toogle pause draw

function keyPressed() {
	if (key == 's' || key == 'S') {
		saveCanvas('flowfiled', 'png');
	}

	if (key == 'p' || key == 'P') {
		if (_keyboard_paused) {
			loop();
			_keyboard_paused = false;
		} else {
			noLoop();
			_keyboard_paused = true;
		}
	}
}