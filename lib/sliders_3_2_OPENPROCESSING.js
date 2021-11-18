"use strict";

////////////////////////////////////////////////////////////////
// sliders_3_2 - OPENPROCESSING VERSION
// 
// don't forget to activate OP Configurator 3000 lib
//
////////////////////////////////////////////////////////////////



let _sliders_names = new Array();
let _sliders_prev_values = new Array();
let _sliders_num = 0;
let _sliders_changed_first_time = true;
let _sliders_activated = false;      // default value


// this is necessary to show sliders.
// should be the first function called
function sliders_activate() {
  _sliders_activated = true;
}

function sliders_add(min, max, default_value, step, var_name) {

  if (_sliders_activated) {
      OPC.slider(var_name, default_value, min, max, step);
      _sliders_names[_sliders_num] = var_name;
      _sliders_prev_values[var_name] = null;   
      _sliders_num++;
      //console.log("sliders_add "+ _sliders_num + " " +var_name);
  }
  else {
   // _sliders_prev_values[var_name] = default_value;
    Object.defineProperty(window, var_name, {
			get: function () {
				return default_value;
			}
    })
  }
}

// returns value for slider with var_name
function sliders_value(var_name) {
 // if (_sliders_activated) {
    return Function("return " + var_name + ";")();
 // }
 // else {
 //   return _sliders_prev_values[var_name];
 // }
}

// return last changed slider or null. resets status
function sliders_changed() {
    if (_sliders_changed_first_time) {
      _sliders_changed_first_time = false;
      return "_first_";
    } 
    if (_sliders_activated == false) {
      return null;
    }
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
