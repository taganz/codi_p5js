
////////////////////////////////////////////////////////////////
// keyboard
////////////////////////////////////////////////////////////////


let _keyboard_paused = false;
let _keyboard_orbitControl = false;
let _keyboard_image_name = "image";

// 's' : save canvas to a png file
// 'p' : toogle pause draw

function keyPressed() {
	if (key == 's' || key == 'S') {
		saveCanvas(_keyboard_image_name, 'png');
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

	/*
	if (key == 'o' || key == 'O' ) {
		_keyboard_orbitControl_tooggle();
	}
	*/

}

// set default image save name
function keyboard_image_name(txt){
	_keyboard_image_name = txt;
}

/*
function keyboard_draw_start() {
	if (_keyboard_orbitControl == true)
	{
		orbitControl();
	} 

}
function keyboard_draw_end() {
	if (_keyboard_orbitControl == false)
	{
		noLoop();
	} 

}


function _keyboard_orbitControl_tooggle(){
	if (_keyboard_orbitControl) {
		_keyboard_orbitControl = false;
		print("keyboard - orbitControl OFF");
	}
	else {
		_keyboard_orbitControl = true;
		print("keyboard - orbitControl ON");
	}

*/