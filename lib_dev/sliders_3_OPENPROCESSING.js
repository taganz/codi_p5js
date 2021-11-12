"use strict";

////////////////////////////////////////////////////////////////
// sliders_2 - OPENPROCESSING VERSION
//
////////////////////////////////////////////////////////////////


let sliders_value = new Array();


let _sliders_names = new Array();
let _sliders_prev_values = new Array();
let _sliders_num = 0;

function sliders_add(min, max, default_value, step, var_name) {

    OPC.slider(var_name, default_value, min, max, step);
    _sliders_names[_sliders_num] = var_name;
    _sliders_prev_values[var_name] = null;   
    _sliders_num++;
		//console.log("sliders_add "+ _sliders_num + " " +var_name);
}


function sliders_changed() {
    let changed = false;
		//for (let i = 0; i < _sliders_names.length; i++) {
	  for (let i = 0; i < _sliders_num; i++) {
        let var_name = _sliders_names[i];
				let var_value = Function("return " + var_name + ";")();
				if (_sliders_prev_values[var_name] != var_value) {
            changed = true;
            _sliders_prev_values[var_name] = var_value;
        }

    }
	  return changed;

}

// compatibility with standalone version
function sliders_show_toggle() {}

