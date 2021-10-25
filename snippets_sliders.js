

// snippets 

////////////////////////////////////////////////////////////////
// sliders
////////////////////////////////////////////////////////////////


let slider_val_1;
let val_1 = 0;

let slider_val_2;
let val_2 = 0;

let gui_need_refresh = true;


function setup() {
	
	// create sliders

	slider_val_1 = createSlider(5, 500, 25);
	slider_val_1.position(10, 100);
    slider_val_1.style('width', '180px');
	slider_val_1.changed(slider_changed);
	
	slider_val_2 = createSlider(50, 500, 150);
	slider_val_2.position(10, 200);
    slider_val_2.style('width', '180px');
	slider_val_2.changed(slider_changed);
		

}


function draw() {
	
	if (gui_need_refresh) {
		
		gui_need_refresh = false;
		
		val_1 = slider_val_1.value();
		val_2 = slider_val_2.value();
		

        // do code
    }
}


function slider_changed() {
	gui_need_refresh = true;
}


