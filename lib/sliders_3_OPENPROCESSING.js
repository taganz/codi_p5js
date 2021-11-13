"use strict";

////////////////////////////////////////////////////////////////
// sliders_3 - OPENPROCESSING VERSION
// 
// don't forget to activate OP Configurator 3000 lib
//
////////////////////////////////////////////////////////////////



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

// returns value for slider with var_name
function sliders_value(var_name) {
    return Function("return " + var_name + ";")();
}

// return last changed slider or null. resets status
function sliders_changed() {
    let var_name_changed = null;
		//for (let i = 0; i < _sliders_names.length; i++) {
	  for (let i = 0; i < _sliders_num; i++) {
        let var_name = _sliders_names[i];
				let var_value = sliders_value(var_name);
				if (_sliders_prev_values[var_name] != var_value) {
            var_name_changed = var_name;
            _sliders_prev_values[var_name] = var_value;
        }

    }
	  return var_name_changed;

}

// compatibility with standalone version
function sliders_show_toggle() {}
