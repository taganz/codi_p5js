////////////////////////////////////////////////////////////////
// buttons
////////////////////////////////////////////////////////////////

let btn_pause;
let btn_save;
let btn_refresh;
let gui_need_refresh = false;
let btn_func_1;

function setup() {
	
	btn_pause = createButton('Pause')
	btn_pause.mousePressed(btn_pause_pressed);
	btn_pause.position(0, 400);
	
	btn_save = createButton('Save')
	btn_save.mousePressed(btn_save_pressed);
	btn_save.position(50, 400);
	
    btn_refresh = createButton('refresh')
	btn_refresh.mousePressed(btn_refresh_pressed);
	btn_refresh.position(0, 400);
	
	btn_pause = createButton('func_1')
	btn_pause.mousePressed(btn_func_1_pressed);
	btn_pause.position(0, 400);
	
	

}



function btn_save_pressed() {
	saveCanvas('flowfiled', 'png');
}

function btn_pause_pressed() {
	if (isLooping())
		noLoop();
	else 
		loop();
}

function btn_refresh_pressed() {
	gui_need_refresh = true;
}
function btn_func_1_pressed() {
	// code
}