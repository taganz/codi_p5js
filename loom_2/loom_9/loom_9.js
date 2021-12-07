// triangles mes separats+

// tbn
// By Ricard Dalmau
// twitter: @RidalmaSketch
// instagram: ridalma.sketch

let GRAF_SEMPRE = 0;

let DEBUG_SMALL_FIGURE = true;
let DEBUG_SMALL_FIGURE_SIZE = 500;
let window_width;
let window_height;

let SEED_0, MODE_0, ROWS_0, DOTS_ROW_0, WEIGTH_0, COLOR_MODE_0;			// reset sliders


let palette;
let c_palette = [];
let c_palette_strings = [];
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

let PERLIN_K = 0.05;
let PERLIN_COLOR_RANGE = 70;
let PERLIN_PIXEL_SIZE = 1;
let COLOR_GRADATION_RANGE = 20;
let COLOR_GRADATION_DIVISIONS = 4;
let COLOR_GRADATION_K = 0.05;

let ROW_SPACING_RANGE = 0.1;

let MARGIN_HEIGHT = 0.1;    // espai no accessible
let MARGIN_WIDTH = 0.1;

let DOT_SPACING_RANGE = 0.4;     // desviacio del punt sobre posicio x
let DOT_HEIGHT_RANGE = 0.4;        // desviacio del punt sobre y linia

let DOT_TOP_RANGE = 0.2;         // % alçada fila 
let DOT_BOTTOM_RANGE = 0.1;
let DOT_LEFT_RANGE = 0.2;
let DOT_RIGTH_RANGE = 0.2;

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
  
// sol lewitts sketch
const palette_array = [
    //["012a4a","013a63","01497c","014f86","2a6f97","2c7da0","468faf","61a5c2","89c2d9","a9d6e5"]
    //["daffed","9bf3f0","473198","4a0d67","adfc92","da4167","f0bcd4","eca72c","ee5622"]
    //["42f2f7","46acc2","498c8a","4b6858","4d4730","514b23","2c497f","3d2b56","60463b"]
    colors_retro_washedout
];

    

function setup() {

    SEED_0 = null;


    // --- comentar en OPC
    sliders_activate();
    sliders_add("SEED",         653, 1, 1000, 1);
    sliders_add("TENS_DISPLAY", 2, 0, 2, 1);  // 0.graf, 1.normal,  2.texture, no 3.perlin 
    sliders_add("TENS_MOVE",    2, 0, 2, 1);  // 0.still, 1.curtain, 2. test
    sliders_add("ROWS",         8, 2, 13, 1);
    sliders_add("DOTS_ROW",     15, 3, 25, 1);
    sliders_add("COLOR_MODE",   0, 0, 2, 1);
    sliders_add("WEIGHT",       22, 1, 60,  1);
    sliders_add("STRING_BASE",   1, 1, 15, 1);
    sliders_add("STRING_WEIGHT_RATIO", 0.05, 0.01, 0.01, 0.01);
    sliders_add("OSCILLATION_X", 8, 0, 10, 0.1);
    sliders_add("OSCILLATION_Y", 25, 0, 30,  0.1);
    sliders_add("PERIOD_X",      150, 50, 200,  1);
    sliders_add("PERIOD_Y",      150, 50, 200,  1);
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
            || COLOR_MODE_0 != COLOR_MODE) {
			
            
            
        create_canvas();
		reset();
    }
	
    clear();
    //background(c_background_color, 30/100 * 255 );
    background(0, 30/100 * 255 );
    fill(c_palette[0]);
    fill(120);
    square(tens.off_x, tens.off_y, tens.size); 



    if (TENS_DISPLAY == 0) {
        tens.display();
    }
    else if (TENS_DISPLAY == 1) {
        tens.display_triangles(true);
    }
    else if (TENS_DISPLAY == 2) {
        tens.display_triangles(false);
        let step_cycle = (step % 100) / 100;
        COLOR_GRADATION_RANGE = lerp(10, 50, step_cycle) - Math.abs(lerp(-40, 40, step_cycle));
        //COLOR_GRADATION_DIVISIONS = 7; //lerp(1, 4, step_cycle) - Math.abs(lerp(-2, 2, step_cycle));

    }
    else if (TENS_DISPLAY == 3) {
        loadPixels();
        tens.display_triangles_perlin(pixels);
        updatePixels();    
    }

    if (GRAF_SEMPRE) {
        tens.display();
    }


    
    if (TENS_MOVE == 1) {
        tens.move_curtain();
    }
    else if (TENS_MOVE == 2) {
        tens.move_neurons();
    }

    step++;
	
}

function reset() {
	
    randomSeed(SEED*100);
    noiseSeed(SEED);  
    palette = random(palette_array);                   // precuinades
    //palette = palette_colors_from_chromotome(5, false);           // test

    for (let i = 0; i < palette.length; i++) {      // add # to palette color numbers
        if (palette[i][0] != "#") {
            palette[i] = "#" + palette[i];
        }
    }

    console.log("Palette: ", palette);
    c_background_color = color(palette[0]);
    c_background_color = color(220);
    c_palette = palette.slice(1,);


    //c_palette = ["#c47c2b", "#5f5726", "#7e8a84"];
    //c_background_color = color("#c47c2b");



    c_palette_strings = c_palette;                  // <--- PALETA CORDES MATEIXA LINIA
    
    for(let i = 0; i < c_palette.length; i++){        // convert to array of colors
        c_palette[i] = color(c_palette[i]);
      }
    
    step = 0;
    tens = new Tenso();  
    console.log(tens.a);
	
    SEED_0 = SEED;
    ROWS_0 = ROWS;
    DOTS_ROW_0 = DOTS_ROW;
    WEIGTH_0 = WEIGHT;
    COLOR_MODE_0 = COLOR_MODE;
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





        

