

////////////////////////////////////////////////////////////////
// sliders
////////////////////////////////////////////////////////////////


// OPC: https://github.com/msawired/processing-js.github.com

// text nomes funciona en 2d



/*
    usage:


    setup()

        sliders_add(min, max, val, increment=0);  // 0 	
        sliders_add(min, max, val, increment=0); // 1 
        ...
        sliders_format(initial_y);


    draw()

        
    	if (sliders_gui_need_refresh) {
		
            val1 = sliders_value[0];
            val2 = sliders_value[1];
            ...


*/


let sliders_num = 0;

let sliders_object = new Array();
let sliders_values = new Array();
let sliders_gui_need_refresh = true;
let font_inconsolata;
let _sliders_var_name = new Array();


//function preload() {
//   font_inconsolata = loadFont('assets/Inconsolata.otf');
//}

function sliders_add(min, max, default_value, step=1, var_name = "slider") {
    sliders_object[sliders_num] = createSlider(min, max, default_value, step);
    _sliders_var_name[sliders_num] = var_name;
    sliders_num++;
}


function sliders_format(initial_y) {

    //fill(0);
    //textFont(font_inconsolata);
    //textSize(32);
    for (let i = 0; i < sliders_num; i++){
        //text('hola', 0, initial_y + i * 20);
        sliders_object[i].position(50, initial_y + i * 20);
        sliders_object[i].style('width', '180px');
        sliders_object[i].changed(sliders_changed);
    }	
    sliders_changed();
}

function sliders_changed() {
    sliders_gui_need_refresh = true;
    for (let i = 0; i < sliders_num; i++){
        print("slider "+ i + "-" + _sliders_var_name[i] + ": " + sliders_object[i].value());
    }
}
