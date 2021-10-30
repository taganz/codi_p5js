

// snippets 

////////////////////////////////////////////////////////////////
// sliders
////////////////////////////////////////////////////////////////


let slider_num = 3;
let slider_object = new Array();

let gui_need_refresh = true;


function setup() {
	
	// create sliders

   
    rotX = 1.53;
    rotY = 6.09;
    rotZ = 5.47;
    slider_object[0] = createSlider(0, TWO_PI, rotX, 0);	
	slider_object[1] = createSlider(0, TWO_PI, rotY, 0);
    slider_object[2] = createSlider(0, TWO_PI, rotZ, 0);
    slider_format(canvas_size + 10);

}


function draw() {
	


	if (gui_need_refresh) {
		
		gui_need_refresh = false;
		

		val_1 = slider_val_1.value();
		val_2 = slider_val_2.value();
		print("val_1: "+val_1);
		print("val_2: "+val_2);
		

        // do code
    }
}



function slider_format(initial_y) {
    for (let i = 0; i < slider_num; i++){
		slider_object[i].position(10, initial_y + i * 20);
		slider_object[i].style('width', '180px');
		slider_object[i].changed(slider_changed);
    }	
	slider_changed();
}

function slider_changed() {
	gui_need_refresh = true;
    for (let i = 0; i < slider_num; i++){
        print("slider "+ i + ": " + slider_object[i].value());
    }
}
