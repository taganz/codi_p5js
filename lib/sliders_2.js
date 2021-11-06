"use strict";

////////////////////////////////////////////////////////////////
// sliders_2
//
////////////////////////////////////////////////////////////////


// els crea div  div_sliders



/*
    usage:


    setup()

        sliders_add(min, max, val, increment=0, "var1");  // 0 	
        sliders_add(min, max, val, increment=0 "var2"); // 1 
        ...
        sliders_format(initial_y);


    draw()

        
    	if (sliders_gui_need_refresh) {
		
            val1 = sliders_value["var1"];
            val2 = sliders_value["var2"];
            ...


*/


let sliders_value = new Array();
let sliders_gui_need_refresh = true;


let _sliders_output = new Array();
let _sliders_font;
let _sliders_div;
let _sliders_show = true;
let _div_sliders;  // canviar per _sliders_div???<----

function preload() {
   _sliders_font = loadFont('../assets/Inconsolata.otf');
}

// create div _div_sliders
function sliders_initialize() {
    
    // crea _div_sliders

    _div_sliders = document.createElement("div");
    _div_sliders.style.alignItems = 'flex_start';
    _div_sliders.style.background = "grey";

    // posa'l al DOM
    document.body.appendChild(_div_sliders);

    // titol del div
    const txt = document.createElement("P");
    txt.innerHTML = "Change generation parameters";
    _div_sliders.appendChild(txt);

}


function sliders_add(min, max, default_value, step, var_name) {

    // slider name and value
    const linia = document.createElement("P");
    let slider_place_holder = "slider_"+var_name;
    let value_place_holder = "val_"+var_name;
    print(`added slider: ${var_name} with value_place_holder: ${value_place_holder}`);
    linia.innerHTML =  
    ":  <span id='"+ slider_place_holder+"'></span> ... " +
    var_name +
    "  value: <span id='"+ value_place_holder+"'></span>";
    _div_sliders.appendChild(linia);
  
    // create slider
    
    var slider = document.createElement('input');
    slider.id = var_name;
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.value = default_value;
    sliders_value[var_name] = default_value;   
    slider.step = step;
    //slider.style.display = 'inline';

    // write output
    _sliders_output[var_name] = document.getElementById(value_place_holder);
    _sliders_output[var_name].innerHTML = slider.value;
    slider.oninput = function() {
      sliders_change(this.id, this.value);
    }

    document.getElementById(slider_place_holder).appendChild(slider);
  
}



// Apply control panel settings (user inputs)
function sliders_change(id,value) {
    value=eval(value);
    _sliders_output[id].innerHTML = value;   
    sliders_value[id] = value;
    //console.log("sliders_changed slider: "+id+"  new value: "+value);
    
    sliders_gui_need_refresh = true;
}

  
function sliders_show_toggle() {
    if (_sliders_show) {
        _div_sliders.style.display = "none";
        _sliders_show = false;
    }
    else {
        _div_sliders.style.display = "block";
        _sliders_show = true;
    }

}

