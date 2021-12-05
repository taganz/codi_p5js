// triangles mes separats+

// tbn
// By Ricard Dalmau
// twitter: @RidalmaSketch
// instagram: ridalma.sketch


let DEBUG_SMALL_FIGURE = true;
let DEBUG_SMALL_FIGURE_SIZE = 300;
let window_width;
let window_height;

/*
//** OPC START **
OPC.slider("SEED", 607, 1, 1000, 1);
OPC.slider("MODE", 1, 0, 1, 1);
OPC.slider("NOISE_MODE", 0, 0, 3, 1);
OPC.slider("ROWS", 9, 6, 20, 1);
OPC.slider("DOTS_ROW", 17, 3, 250, 1);
OPC.slider("WEIGHT", 22, 1, 60,  1);
OPC.slider("STRING_BASE", 1, 1, 15, 1);
OPC.slider("STRING_WEIGHT_RATIO", 0.05, 0.01, 0.01, 0.01);
OPC.slider("OSCILLATION_X", 8, 0, 10, 0.1);
OPC.slider("OSCILLATION_Y", 25, 0, 30,  0.1);
OPC.slider("PERIOD_X", 93, 1, 100,  1);
OPC.slider("PERIOD_Y", 91, 1, 100,  1);
OPC.slider("AMPLITUDE_FACTOR_X", 2, 1, 5, 0.1);
OPC.slider("AMPLITUDE_FACTOR_Y", 2, 1, 5, 0.1);
//^** OPC END **
*/

let SEED_0, MODE_0, ROWS_0, DOTS_ROW_0, WEIGTH_0;			// reset sliders


let palette;
let c_palette = [];
let c_palette_strings = [];
let c_background_color;

let tens;
let step;
let _keyboard_paused = false;
let save_image_name = 'loom';

let DOTS_LOWER_LIMIT = 0.8;
let WEIGHT_VARIATION = 0.1;
let OSC_Y_FACTOR = 70;
let OSC_Y_FACTOR_ROW = 0.8;

let pixel_density;

/*
const palette_array_curtain = [
   //  ["ffcdb2", "6d6875"]  // gris daurat
     ["#000000","#c47c2b", "#5f5726", "#7e8a84"] 
   , ["#2d3538", "#d0c1a0", "#4bae8c"]
   , ["#613a53", "#ec6c26", "#639aa0", "#e8ac52"]
   , ["#20342a", "#e9b4a6", "#f74713", "#686d2c"]
   , ["#52534f", "#ca5130", "#ea720e", "#e9c25a"]
   , ["#ecbb51", "#253852", "#b53435", "#51222f"]
   , ["#000000","#d3990e","#809498","#ecddc5"]
   , ["#1f1e43","#56b7ab","#f8cb57","#ec643b"]
];
*/

/*
// chromotome
const palette_array_chromotome = [
    ['#d24c23', '#ede2b3', '#7ba6bc', '#f0c667', '#142a36', '#672b35']
    ,['#e5475c', '#28343b', '#95b394', '#eb8078', '#f7c6a3']
    ,['#d8eecf', '#bf7f93', '#ffb58f', '#8c4b47', '#ff6555']
    ,['#e31f4f', '#26265a', '#f0ac3f', '#18acab', '#dcd9d0', '#ea7d81']
    ,['#cc7d6c', '#424637', '#687f72', '#dec36f', '#ad8470', '#dec7af']
    ,['#ffae43', '#8bc9c3', '#d1d7d3', '#524e9c', '#ea432c', '#228345', '#f0a1a1', '#9dc35e']
    ,['#c83e3c', '#e4ded2', '#f8c5a4', '#75974a', '#434f55', '#f39140']
];
*/
/*
// diverses
const palette_array = [
    ["A3A899","98A982","8CAA6A","81AC53","75AD3C","6AAE24","5EAF0D"]
   // ,["858E96","7F888F","798288","737C81","6C7579","666F72","60696B"]
    ,["FCEF04","F7D21D","F1B536","EC9850","E77B69","E15E82","DC419B"]
    ,["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"]
    ,["264653","2a9d8f","e9c46a","f4a261","e76f51"]
    ,["cebebe","ece2d0","d5b9b2","a26769","6d2e46"]
    ,["03045e","023e8a","0077b6","0096c7","00b4d8","48cae4","90e0ef","ade8f4","caf0f8"]
    ,["606c38","283618","fefae0","dda15e","bc6c25"]
    ,["797d62","9b9b7a","baa587","d9ae94","f1dca7","ffcb69","e8ac65","d08c60","b58463","997b66"]
    ,["ffffff", "ED4141", "FECA16", "2B8BDF", "159670"]
    ,["7E350A","924919","A55C29","B97039","CD8448","E09758","F4AB67"]
    ,["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"] // 0
    ,["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"]
    ,["b7094c","a01a58","892b64","723c70","5c4d7d","455e89","2e6f95","1780a1","0091ad"]
    ,["fec5bb","fcd5ce","fae1dd","f8edeb","e8e8e4","d8e2dc","ece4db","ffe5d9","ffd7ba","fec89a"] // molt clara, beixos
    ,["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"]
    ,['f70640', 'f78e2c', 'fdd903', 'cae509', '63be93', '81cfe5', '299dbf', '38187d', 'a4459f', 'f654a9', '2F0A30']
    
];
*/

// sol lewitts sketch
const palette_array = [
    ["03045e","023e8a","0077b6","0096c7","00b4d8","48cae4","90e0ef","ade8f4","caf0f8"]  // blaus
    , ["d8f3dc","b7e4c7","95d5b2","74c69d","52b788","40916c","2d6a4f","1b4332","081c15"] // verds
    , ["335c67","fff3b0","e09f3e","9e2a2b","540b0e"]  // ocres
];



    

function setup() {

    SEED_0 = null;
    
    // --- comentar en OPC
    sliders_activate();
    sliders_add(1, 1000, 594, 1, "SEED");
    sliders_add(0, 1, 1, 1, "MODE");   // 0.loom, 1.neurons
    sliders_add(0, 3, 0, 1, "NOISE_MODE"); 
    sliders_add(6, 20, 3, 1, "ROWS");
    sliders_add(3, 250, 3, 1, "DOTS_ROW");
    sliders_add(1, 60, 10, 1, "WEIGHT");
    sliders_add(1, 15, 1, 1, "STRING_BASE");
    sliders_add(0.01, 0.01, 0.05, 0.01, "STRING_WEIGHT_RATIO");
    sliders_add(0, 10, 0, 0.1, "OSCILLATION_X"); //8
    sliders_add(0, 30, 0, 0.1, "OSCILLATION_Y"); //25
    sliders_add(1, 100, 93, 1, "PERIOD_X");
    sliders_add(1, 100, 91, 1, "PERIOD_Y");
    sliders_add(1, 5, 2, 0.1, "AMPLITUDE_FACTOR_X");
    sliders_add(1, 5, 2, 0.1, "AMPLITUDE_FACTOR_Y");
    // --- comentar en OPC
    
    colorMode(RGB, 255);
    pixelDensity(1);   // <-----
    pixel_density = pixelDensity();
    
   // create_canvas();
}


function draw() {

    if (SEED_0 != SEED 
            || MODE_0 != MODE
			|| ROWS_0 != ROWS
			|| DOTS_ROW_0 != DOTS_ROW
			|| WEIGTH_0 != WEIGHT) {
			
            
            
        create_canvas();
		reset();
    }
	
    clear();
    //background(c_background_color, 30/100 * 255 );
    background(0, 30/100 * 255 );
    fill(c_palette[0]);
    fill(120);
    square(tens.off_x, tens.off_y, tens.size); 
    if (MODE == 0) {
        tens.display();
        tens.move_curtain();
    }
    else {
        //tens.display();
        if (NOISE_MODE == 2) {
            // nothing <--
        }
        else if (NOISE_MODE == 3) {
            //console.log("loading pixels...");
            loadPixels();
            //console.log("Calling display_triangles_perlin...");
            //console.log("before display_triangles_perlin: ", pixels[0], pixels[1], pixels[2], pixels[3]);
            tens.display_triangles_perlin(pixels);
            //console.log("after display_triangles_perlin: ", pixels[0], pixels[1], pixels[2], pixels[3]);
            //console.log("Calling display_triangles_perlin... Complete!");
            updatePixels();    
            //console.log("...pixels updated");
         //   noLoop();
        }
        else {
            tens.display_triangles();
        }
     //   tens.move_neurons();

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
	
    SEED_0 = SEED;
    MODE_0 = MODE;
    ROWS_0 = ROWS;
    DOTS_ROW_0 = DOTS_ROW;
    WEIGTH_0 = WEIGHT;
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





        

