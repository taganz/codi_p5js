// triangles mes separats+

// tbn
// By Ricard Dalmau
// twitter: @RidalmaSketch
// instagram: ridalma.sketch

const DEBUG_SMALL_FIGURE = false;
const DEBUG_SMALL_FIGURE_SIZE = 500;
const DEBUG_GRAPH_ON_TOP = false;
const DEBUG_LOG_CONSOLE = false;


let window_width;
let window_height;

let SEED_0, MODE_0, ROWS_0, DOTS_ROW_0, WEIGTH_0, COLOR_MODE_0;			// reset sliders
let DOT_SPACING_RANGE_0, DOT_HEIGHT_RANGE_0, DOT_BORDERS_0;            


//let palette;
let c_palette = [];
let n_palette = [];
let c_palette_strings = [];
let n_palette_strings = [];
let c_background_color;

let tens;
let step;
let _keyboard_paused = false;
let save_image_name = 'loom';

//let SEED = 510;

//let ROWS = 4;  // 4
//let DOTS_ROW = 4; // 7
//let WEIGHT = 35;
//let STRING_BASE = 3;
//let STRING_WEIGHT_RATIO = 0.05;
//let OSCILLATION_X = 40;
//let OSCILLATION_Y = 35;
//let PERIOD_X = 20;
//let PERIOD_Y = 30;
//let AMPLITUDE_FACTOR_X = 0.1;
//let AMPLITUDE_FACTOR_Y = 0.1;

let DOTS_LOWER_LIMIT = 1;  // %, si el baixo surten creuaments que no funcionen!
let WEIGHT_VARIATION = 0.1;
let OSC_Y_FACTOR = 70;
let OSC_Y_FACTOR_ROW = 0.8;

//let ROW_DANCE = 1;  // move 1 amb separacio a les linies

let PERLIN_K = 0.05;
let PERLIN_COLOR_RANGE = 70;
let PERLIN_PIXEL_SIZE = 1;
let COLOR_GRADATION_RANGE = 20;
let COLOR_GRADATION_DIVISIONS = 8;
let COLOR_GRADATION_K = 0.05;

let ROW_SPACING_RANGE = 0.1;

let MARGIN_HEIGHT = 0.1;    // espai no accessible
let MARGIN_WIDTH = 0.1;

//let DOT_SPACING_RANGE = 0.2;     // desviacio del punt sobre posicio x
//let DOT_HEIGHT_RANGE = 0.2;        // desviacio del punt sobre y linia

// ** DOT BORDERS **
let DOT_TOP_RANGE = 0.4;         // % alçada fila 
let DOT_BOTTOM_RANGE = 0.4;
let DOT_LEFT_RANGE = 0.4;
let DOT_RIGTH_RANGE = 0.4;

let NO_CROSS = 1;           // eliminar lines que es creuen

//let TENS_DISPLAY;
//let TENS_MOVE;

let pixel_density;


//name: 'retro-washedout',
const colors_retro_washedout = [
    '#878a87',
    '#cbdbc8',
    '#e8e0d4',
    '#b29e91',
    '#9f736c',
    '#b76254',
    '#dfa372'
  ]
  
const colors_gaudi = ["000000", "e9d758","3c91e6","ff8552","e6e6e6","1f271b","909090","734b5e"];
// sol lewitts sketch
const palette_array = [
    //["012a4a","013a63","01497c","014f86","2a6f97","2c7da0","468faf","61a5c2","89c2d9","a9d6e5"]
    //["daffed","9bf3f0","473198","4a0d67","adfc92","da4167","f0bcd4","eca72c","ee5622"]
    //["42f2f7","46acc2","498c8a","4b6858","4d4730","514b23","2c497f","3d2b56","60463b"]
    //colors_retro_washedout
    colors_gaudi
];

    

function setup() {

    SEED_0 = null;


    // --- comentar en OPC
    sliders_activate();
    sliders_add("SEED",         442, 1, 1000, 1);
    sliders_add("ROWS",         16, 2, 30, 1);
    sliders_add("DOTS_ROW",     28, 3, 50, 1);
    sliders_add("MOVE_MODE",    2, 0, 5, 1);  // 0.no move, 1.basic, 2, xx, 3, xx, 4, curtain, 5, no funciona
    sliders_add("MOVE_MODE_SPEED", 150, 100, 1000, 1);
    sliders_add("_______b", 999, 999, 999);
    sliders_add("COLOR_MODE",   3, 0, 3, 1);  
    sliders_add("DOT_SPACING_RANGE",   0.2, 0, 0.5, 0.05);  
    sliders_add("DOT_HEIGHT_RANGE",   0.2, 0, 1, 0.1);  
    sliders_add("DOT_BORDERS",   0.4, 0, 0.6, 0.1);  


    sliders_add("ROW_DANCE", 0, 0, 1, 1);

    sliders_add("TENS_DISPLAY", 0, 0, 2, 1);  // 0.normal, 1.texture, 2.debug, no 3.perlin 
    
    sliders_add("___work", 999, 999, 1000, 1);

    sliders_add("WEIGHT",       22, 1, 60,  1);
    sliders_add("STRING_BASE",   1, 1, 15, 1);
    sliders_add("STRING_WEIGHT_RATIO", 0.05, 0.01, 0.1, 0.01);
    sliders_add("OSCILLATION_X", 8, 0, 10, 0.1);
    sliders_add("OSCILLATION_Y", 9, 0, 30,  0.1);
    sliders_add("PERIOD_X",      170, 50, 250,  1);
    sliders_add("PERIOD_Y",      19050, 50, 250,  1);
    sliders_add("AMPLITUDE_FACTOR_X", 2, 1, 5, 0.1);
    sliders_add("AMPLITUDE_FACTOR_Y", 2, 1, 5, 0.1);

    // --- comentar en OPC
    
    colorMode(RGB, 255);
    pixelDensity(1);   // <-----
    pixel_density = pixelDensity();
    
   // create_canvas();
}


function draw() {

    if (SEED_0 != SEED 
			|| ROWS_0 != ROWS
			|| DOTS_ROW_0 != DOTS_ROW
			|| WEIGTH_0 != WEIGHT
            || COLOR_MODE_0 != COLOR_MODE
            || DOT_SPACING_RANGE_0 != DOT_SPACING_RANGE 
            || DOT_HEIGHT_RANGE_0 != DOT_HEIGHT_RANGE
            || DOT_BORDERS_0 != DOT_BORDERS
            ) {
            
            
        create_canvas();
		reset();
    }
	
    clear();
    background(c_background_color);
    //background(0, 30/100 * 255 );
    fill(c_palette[0]);
    fill(c_background_color);
    square(tens.off_x, tens.off_y, tens.size); 



    if (TENS_DISPLAY == 2) {
        tens.display();
    }
    else if (TENS_DISPLAY == 0) {
        tens.display_triangles(true);
    }
    else if (TENS_DISPLAY == 1) {
        if (MOVE_MODE == 0) {         // gradation only if not moving
            tens.display_triangles(false);
            let step_cycle = (step % 100) / 100;
            COLOR_GRADATION_RANGE = lerp(10, 50, step_cycle) - Math.abs(lerp(-40, 40, step_cycle));
            //COLOR_GRADATION_DIVISIONS = 7; //lerp(1, 4, step_cycle) - Math.abs(lerp(-2, 2, step_cycle));
        }
        else {
            tens.display_triangles(true);
        }

    }
    else if (TENS_DISPLAY == 3) {
        loadPixels();
        tens.display_triangles_perlin(pixels);
        updatePixels();    
    }

    if (DEBUG_GRAPH_ON_TOP) {
        tens.display();
    }


    
    if (MOVE_MODE == 0) {
        // no move
    }
    else if (MOVE_MODE == 5) {
        tens.move_curtain();
    }
    else {
        tens.move_neurons();
    }

    step++;
	
}

function reset() {
	
    randomSeed(SEED*100);
    noiseSeed(SEED);  

    n_palette = random(palette_array);                   // precuinades
    
    for (let i = 0; i < n_palette.length; i++) {      // add # to palette color numbers
        if (n_palette[i][0] != "#") {
            n_palette[i] = "#" + n_palette[i];
        }
    }

    print_debug("Palette: ", n_palette);
    c_background_color = color(n_palette[0]);
    c_background_color = color(220);            // <---
    n_palette = n_palette.slice(1,);

    n_palette_strings = n_palette;                  // <--- PALETA CORDES MATEIXA LINIA
    
    for(let i = 0; i < n_palette.length; i++){        // convert to array of colors
        c_palette[i] = color(n_palette[i]);
      }
    c_palette_strings = c_palette
    


    DOT_TOP_RANGE = DOT_BORDERS;         // % alçada fila 
    DOT_BOTTOM_RANGE = DOT_BORDERS;
    DOT_LEFT_RANGE = DOT_BORDERS;
    DOT_RIGTH_RANGE = DOT_BORDERS;


    step = 0;
    tens = new Tenso();  
    print_debug(tens.a);
	
    SEED_0 = SEED;
    ROWS_0 = ROWS;
    DOTS_ROW_0 = DOTS_ROW;
    WEIGTH_0 = WEIGHT;
    COLOR_MODE_0 = COLOR_MODE;
    DOT_SPACING_RANGE_0 = DOT_SPACING_RANGE;
    DOT_HEIGHT_RANGE_0 = DOT_HEIGHT_RANGE;
    DOT_BORDERS_0 = DOT_BORDERS;
            
}


function create_canvas() {
    if (DEBUG_SMALL_FIGURE) {
        createCanvas(DEBUG_SMALL_FIGURE_SIZE, DEBUG_SMALL_FIGURE_SIZE);
        window_width = DEBUG_SMALL_FIGURE_SIZE;
        window_height = DEBUG_SMALL_FIGURE_SIZE;
    } else {
        createCanvas(windowWidth, windowHeight);
        window_width = windowWidth;
        window_height = windowHeight
    }
    
}

function windowResized() {
    create_canvas();
	reset();
}






// helpers ..............................

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function _grid_intersects(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
    return false;
    } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};



function keyPressed() {
if (key == 's' || key == 'S') {
    saveCanvas(save_image_name, 'png');
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
}


function triangle_fill_gradation(x1, y1, x2, y2, x3, y3, rc, gc, bc, k=0.05, color_range=30, divisions=3) {
    let dx = (x3-x2)/divisions;  // divide base 
    let dy = (y3-y2)/divisions;  // divide base 
    //noStroke();
    for (let t = 0; t < divisions; t++) {  // for each triangle division
        let i = x2+dx*t;  // this is the dot 2 for current triangle
        let j = y2+dy*t;

        let r = noise(i*k,j*k)
        let g = noise(i*k+1000,j*k+1000)
        let b = noise(i*k+2000,j*k+2000)
        b = map (b, 0, 1, bc-color_range, bc+color_range);
        r = map (r, 0, 1, rc-color_range, rc+color_range);
        g = map (g, 0, 1, gc-color_range, gc+color_range);
        stroke(r, g, b);
        fill(r, g, b)
        triangle(x1, y1, i, j, i+dx, j+dy);
    }
}

function print_debug(a, b="", c="", d=""){
    if (DEBUG_LOG_CONSOLE) {
        console.log("***", a, b, c, d);
    }
}
        

