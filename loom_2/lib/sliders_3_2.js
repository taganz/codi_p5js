"use strict";

////////////////////////////////////////////////////////////////
// sliders_2
//
////////////////////////////////////////////////////////////////


// els crea div  div_sliders



/*
    usage:


    preload() 

        sliders_preload()



    setup()

        sliders_activate();     // show sliders, if not will work with default values
        sliders_add(min, max, val, increment=0, "var1", true, "instructions var1");  // 0 	
        sliders_add(min, max, val, increment=0 "var2"); // 1 
        ...
        
        


    draw()

        // sliders_change() returns last var changed name
        //      resets change indicator, use only once in a draw() event
        
        let var_changed = sliders_changed();
    	if (var_changed != null) {
		
            
            val = sliders_value(var_changed)
            
    
    draw() 

        switch(sliders_changed()) {
                case "_first_":
                case "var1":
                    ... var1 ...
                default
                    // anything changed

*/


//let sliders_value = new Array();

//let _sliders_gui_need_refresh = true;
let _sliders_output = new Array();
let _sliders_last_changed = null;   // var_name for last slider changed
let _sliders_font;
//let _sliders_div;
let _sliders_show = true;
let _sliders_div;  
let _sliders_changed_var_name = new Array();    // bool. last changed slider
let _sliders_initialized = false;
let _sliders_changed_first_time = true;
let _sliders_activated = false;      // default value

// load font
function sliders_preload() {
 //  _sliders_font = loadFont('../assets/Inconsolata.otf');
}

// this is necessary to show sliders.
// should be the first function called
function sliders_activate() {
    _sliders_activated = true;
     if (_sliders_font == null){
       console.log("*** ERROR **** sliders 3.2. Font not loaded. Please use sliders_preload() in preload() function to load font.")
    }
}


// create div _sliders_div
function sliders_add(min, max, default_value, step, var_name, show=true, txt_help="") {


    // create variable

    window[var_name] = default_value;

    console.log("Created var: "+var_name+ " value: " + Function("return "+var_name+";")());

    // create slider

    if (show){

        if (_sliders_initialized == false) {
            _sliders_initialize();
            _sliders_initialized = true;
        }
    

        // slider name and value
        const linia = document.createElement("P");
        let slider_place_holder = "slider_"+var_name;
        let value_place_holder = "val_"+var_name;
        txt_help = txt_help == "" ? "" : "("+txt_help+")"
        linia.innerHTML =  
        ":  <span id='"+ slider_place_holder+"'></span> &nbsp &nbsp " +
        var_name +
        ":  <span id='"+ value_place_holder+"'></span>" +
        "&nbsp &nbsp &nbsp  "+ txt_help+"";
        _sliders_div.appendChild(linia);
    
        if (_sliders_activated == false){
            _sliders_div.style.display = "none";
        }

    // create slider
    

        var slider = document.createElement('input');
        slider.id = var_name;
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = default_value;
        slider.step = step;
        slider.oninput = function() {
            _sliders_change(this.id, this.value);
        }
    
        // write output
        _sliders_output[var_name] = document.getElementById(value_place_holder);
        _sliders_output[var_name].innerHTML = slider.value;
        
        document.getElementById(slider_place_holder).appendChild(slider);
    

        _sliders_changed_var_name[var_name] = false;

        
        console.log("Created slider: "+var_name+ " value: " + Function("return "+var_name+";")());
    }   

}

// returns value for slider with var_name
function sliders_value(var_name) {
    return Function("return " + var_name + ";")();
}

// return last changed slider or null. resets status. first time always return "_first_" 
function sliders_changed() {
    if (_sliders_changed_first_time) {
        _sliders_changed_first_time = false;
        return "_first_";
    }
    let ret = _sliders_last_changed;
    _sliders_last_changed = null;       // reset last change
    return ret;
}

function _sliders_initialize() {
    
    // crea _sliders_div

    _sliders_div = document.createElement("div");
    _sliders_div.style.alignItems = 'flex_start';
    _sliders_div.style.background = "grey";
    document.body.appendChild(_sliders_div);

    // titol del div
    const txt = document.createElement("P");
    txt.innerHTML = "Change generation parameters";
    _sliders_div.appendChild(txt);

    // hidden by default
    //sliders_show_toggle(true);
    if (_sliders_activated == false){
        sliders_show_toggle(false);
    }



}
// Apply control panel settings (user inputs)
function _sliders_change(id,value) {
    value=eval(value);
    _sliders_last_changed = id;
    _sliders_output[id].innerHTML = value;   
    //console.log("sliders_changed slider: "+id+"  new value: "+value);
    window[id] = value;
   // _sliders_gui_need_refresh = true;

   //_sliders_changed_var_name.fill(false);  // reset all
   for (const var_name in _sliders_changed_var_name) {
    _sliders_changed_var_name[var_name] = false;    // reset all
    }



    _sliders_changed_var_name[id] = true;
   //print("sliders change id " + id + " to value: "+ value);

}

  
function sliders_show_toggle(stat) {
    if (_sliders_activated == false) {
        console.log("*** sliders are not activated. can not show")
        return;
    }
    if (stat === false) {
        _sliders_div.style.display = "none";
        _sliders_show = false;
    }
    else if (stat == true) {
        _sliders_div.style.display = "block";
        _sliders_show = true;
    }
    else if (_sliders_show) {
        _sliders_div.style.display = "none";
        _sliders_show = false;
    }
    else {
        _sliders_div.style.display = "block";
        _sliders_show = true;
    }

}

