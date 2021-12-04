/*

OPC.slider("SEED", 1, 1000, 663, 1);
OPC.slider("ROWS", 6, 20, 6, 1);
OPC.slider("DOTS_ROW", 3, 250, 168, 1);
OPC.slider("WEIGHT", 1, 60, 22, 1);
OPC.slider("STRING_BASE", 1, 15, 1, 1);
OPC.slider("STRING_WEIGHT_RATIO", 0.01, 0.01, 0.05, 0.01);
OPC.slider("OSCILLATION_X", 0, 10, 8, 0.1);
OPC.slider("OSCILLATION_Y", 0, 30, 25, 0.1);
OPC.slider("PERIOD_X", 1, 100, 93, 1);
OPC.slider("PERIOD_Y", 1, 100, 91, 1);
OPC.slider("AMPLITUDE_FACTOR_X", 1, 5, 2, 0.1);
OPC.slider("AMPLITUDE_FACTOR_Y", 1, 5, 2, 0.1);
*/

let palette;
let c_palette = [];
let c_palette_strings = [];
let c_background_color;

let tens;
let step;
let _keyboard_paused = false;
let save_image_name = 'loom';
//let SEED;

//let ROWS = 6;
//let DOTS_ROW = 75;
let DOTS_LOWER_LIMIT = 0.8;
//let WEIGHT = 10;
let WEIGHT_VARIATION = 0.1;
//let OSCILLATION_X = 0.05;
//let OSCILLATION_Y = 0.1;
//let PERIOD_X = 2;
//let PERIOD_Y = 1;
//let STRING_WEIGHT_RATIO = 0.3;
//let STRING_BASE;
//let AMPLITUDE_FACTOR_X = 0.5;
//let AMPLITUDE_FACTOR_Y = 0.5;
let OSC_Y_FACTOR = 70;
let OSC_Y_FACTOR_ROW = 0.8;



const palette_array = [
   //  ["ffcdb2", "6d6875"]  // gris daurat
     ["#000000","#c47c2b", "#5f5726", "#7e8a84"] 
   , ["#2d3538", "#d0c1a0", "#4bae8c"]
   , ["#613a53", "#ec6c26", "#639aa0", "#e8ac52"]
   , ["#20342a", "#e9b4a6", "#f74713", "#686d2c"]
  // , ["#f74713", "#686d2c", "#e9b4a6", "#20342a"]] - carabassa
   , ["#52534f", "#ca5130", "#ea720e", "#e9c25a"]
   , ["#ecbb51", "#253852", "#b53435", "#51222f"]
   , ["#000000","#d3990e","#809498","#ecddc5"]
   , ["#1f1e43","#56b7ab","#f8cb57","#ec643b"]
];

    

function setup() {

	sliders_activate();
    sliders_add(1, 1000, 663, 1, "SEED");
    sliders_add(6, 20, 6, 1, "ROWS");
    sliders_add(3, 250, 168, 1, "DOTS_ROW");
    sliders_add(1, 60, 22, 1, "WEIGHT");
    sliders_add(1, 15, 1, 1, "STRING_BASE");
    sliders_add(0.01, 0.01, 0.05, 0.01, "STRING_WEIGHT_RATIO");
    sliders_add(0, 10, 8, 0.1, "OSCILLATION_X");
    sliders_add(0, 30, 25, 0.1, "OSCILLATION_Y");
    sliders_add(1, 100, 93, 1, "PERIOD_X");
    sliders_add(1, 100, 91, 1, "PERIOD_Y");
    sliders_add(1, 5, 2, 0.1, "AMPLITUDE_FACTOR_X");
    sliders_add(1, 5, 2, 0.1, "AMPLITUDE_FACTOR_Y");
	
    createCanvas(windowWidth, windowHeight);
	  
    reset();

}


function draw() {

    let slider = sliders_changed();
    if (slider != null) {
        switch(slider) {
        case 'SEED':
        case 'ROWS':
        case 'DOTS_ROW':
        case 'WEIGHT':
			reset();
        }
    }
    //square(10, 10, 300); 
    clear();
    background(c_background_color, 30/100 * 255 );
    tens.display();
    tens.move();
    step++;
    
}

function reset() {
    
    randomSeed(SEED*100);
    noiseSeed(SEED);
    
    // palette = palette_random_chromotome(53, false);          // try new palettes
    palette = random(palette_array);                   // precuinades
    //palette = shuffle(palette);                   // precuinades
    

    console.log("palette: "+palette);
    console.log("palette[0]: ", palette[0]);
    c_background_color = color(palette[0]);
    c_palette = palette.slice(1,);
    c_palette_strings = c_palette;                  // <--- PALETA CORDES MATEIXA LINIA
    console.log("c_palette: "+c_palette);
    
    for(let i = 0; i < c_palette.length; i++){        // convert to array of colors
        c_palette[i] = color(c_palette[i]);
      }
    
    step = 0;
    tens = new Tenso();  
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	reset();
}


class Tenso {

    constructor() {

        this.size = min(windowWidth, windowHeight);
        this.last_row_y = this.size * random (0.7, 1.1);
        this.no_cross = random() < 0.5;
        this.row_0_stroke = 3;
        this.rows = ROWS;

        this.a = new Array();
		
        let a = this.a;

        let x, y, y_max_row, y_max_previous_row, dots_this_row;
        y_max_previous_row = 0;
        let row_height = this.size  / (this.rows + 2);

        
        for (let row = 0; row < this.rows; row++){       // create all rows
            this.a[row] = new Array();
            y_max_row = 0;
            dots_this_row = floor(DOTS_ROW * random(DOTS_LOWER_LIMIT, 1));
            //print("dots for row "+row+": "+dots_this_row);
            let x_ref = this.size / (dots_this_row - 2);
            let y_average = row_height * row * random(1,1.5);  // <--- CANVIAR_PER_SHUFFLE_VALORS
            let row_color_num = floor(random(0, c_palette.length-1));
            for (let i = 0; i < dots_this_row; i++) {

                // calculate y

                if (row == 0) {             
                    y = this.size * 0.02;                 // first row fixed
                }
                else if (row == this.rows-1) {
                    y = this.last_row_y;
                }
                else {
                    // y somewhere between min previous row and the space left divide by remaining rows
                    //y = floor(random(row_height * row, row_height * (row + 1)  ));
                    y = y_average + floor(0.05 * this.size / this.rows * noise (i * 0.5 + row));
                    y = y_average; //  + 20 - 10 * cos (i/dots_this_row * TWO_PI);
                    if (y > y_max_row) {
                        y_max_row = y;
                    }
                }

                // calculate x

                if (i == 0) {
                    x = 0;
                }
                else if (i == dots_this_row -1) {
                    x = this.size - 1;
                }
                else {
                    x = floor(random(x_ref * (i-1) , x_ref * i));
                }


                let weight = WEIGHT / 2/ (row/this.rows+1) * random(1- WEIGHT_VARIATION, 1 + WEIGHT_VARIATION);


                // color



                //let dot_color = palette_dots[ floor(lerp(0, palette_dots.length, row/ROWS)) ];

                let dot_color = lerpColor( c_palette[row_color_num], c_palette[row_color_num+1], row/ROWS);

                
                //let dot_color;
                //if (row % 2 == 0) {
                //    dot_color = lerpColor( color("#"+palette_dots[0]), color("#"+palette_dots[1]), sin(TWO_PI * i/dots_this_row ));
                //}
                //else {
                //    dot_color = lerpColor( color("#"+palette_dots[1]), color("#"+palette_dots[0]),  cos(TWO_PI * i/dots_this_row));
                //}
                
                //let phase = noise(x);
                let phase = lerp(0, PI, row/this.rows);

                // create point
                a[row].push({x: x, x0: x, y: y, y0: y, weight: weight, color: dot_color, phase: phase});


            }
            y_max_previous_row = y_max_row;
        }

        // add lines from points to points in previous lines
        
        
        // lines to next rows
        for (let row = 1; row < a.length ; row++){
            for (let i = 0; i < a[row].length; i++ ) {
                let x_prev = i == 0 ? 0 : a[row][i-1].x;
                let x_post = i == a[row].length -1 ? a[row][i].x : a[row][i+1].x;
                a[row][i].neighbours = new Array();
                for (let j=0; j < a[row-1].length; j++) {
                    if (a[row-1][j].x >= x_prev && a[row-1][j].x <= x_post) {
                        a[row][i].neighbours.push({x: a[row-1][j].x, y: a[row-1][j].y, x0: a[row-1][j].x0, y0: a[row-1][j].y0, weight: a[row-1][j].weight, color: a[row-1][j].color, phase: a[row-1][j].phase});
                    }
                }
            }
        }

        if (this.no_cross) {
            // erase intersection lines
            for (let row = 1; row < a.length ; row++){
                for (let i = 0; i < a[row].length - 1; i++ ) {
                    for (let ni=0; ni < a[row][i].neighbours.length; ni++) {
                        for (let nj=0; nj < a[row][i+1].neighbours.length; nj++) {
                        if ( _grid_intersects (
                                a[row][i].x, 
                                a[row][i].y, 
                                a[row][i].neighbours[ni].x, 
                                a[row][i].neighbours[ni].y, 
                                a[row][i+1].x, 
                                a[row][i+1].y, 
                                a[row][i+1].neighbours[nj].x, 
                                a[row][i+1].neighbours[nj].y) ) {
                                a[row][i+1].neighbours.splice(nj,1);
                            }
                        }
                    }
                }
            }
        }


        console.log("this.a ", this.a);
    }


    move() {

        let a = this.a;

        
        for (let row = 1; row < a.length; row++){                                           // per cada linia a partir de la 1 (la 0 no es mou)
            let amp_x = lerp(0, 1, row/this.rows*AMPLITUDE_FACTOR_X) * OSCILLATION_X;       // oscil.lacio a la linia
            let amp_y = lerp(0, 1, row/this.rows*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            let osc_y_x = OSC_Y_FACTOR + (this.rows - row) * OSC_Y_FACTOR_ROW;
            let amp_x_n = lerp(0, 1, (row-1)/this.rows*AMPLITUDE_FACTOR_X) * OSCILLATION_X; // oscil.lacio linia anterior, per la 0 es zero
            let amp_y_n = lerp(0, 1, (row-1)/this.rows*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            let osc_y_x_n = OSC_Y_FACTOR + (this.rows - (row-1)) * OSC_Y_FACTOR_ROW;

            for (let i = 0; i < a[row].length; i++ ) {
                    a[row][i].x = a[row][i].x0 +  amp_x * Math.sin(TWO_PI * step / PERIOD_X +  a[row][i].phase);   
                    a[row][i].y = a[row][i].y0 +  amp_y * Math.sin(TWO_PI * step / PERIOD_Y + i/osc_y_x + a[row][i].phase);   

                    if (a[row][i].neighbours != null) {
                        for (let n = 0; n < a[row][i].neighbours.length; n++) {
                            a[row][i].neighbours[n].x = a[row][i].neighbours[n].x0 +  amp_x_n * Math.sin(TWO_PI * step / PERIOD_X +  a[row][i].neighbours[n].phase);   
                            a[row][i].neighbours[n].y = a[row][i].neighbours[n].y0 +  amp_y_n * Math.sin(TWO_PI * step / PERIOD_Y + i/osc_y_x_n + a[row][i].neighbours[n].phase);   
                        }
                    }

                }
            }
        }

    display() {
    
        let a = this.a;

        // lines to parent row
        for (let row = 1; row < a.length ; row++) {                     // per cada linia a partir de la 1
            //stroke(fixed_color(row, palette_strings));
            for (let i = 0; i < a[row].length; i++ ) {                  // per cada punt de la linia
                stroke(a[row][i].color);
                for (let n = 0; n < a[row][i].neighbours.length; n++) {                           // per cada pare del punt
                    strokeWeight(STRING_BASE + a[row][i].weight * STRING_WEIGHT_RATIO); 
                    line(a[row][i].x, a[row][i].y, a[row][i].neighbours[n].x, a[row][i].neighbours[n].y);   // linia de punt a pare n
                }
            }
        }

        // dots
        //stroke('purple'); // Change the color
        for (let row = 0; row < a.length; row++){
            //stroke(fixed_color(row, palette_strings));
            for (let i = 0; i < a[row].length; i++ ) {
                stroke(a[row][i].color);
                fill(a[row][i].color);
                strokeWeight(floor(a[row][i].weight));

                // <--- PUNT O OVALS
                // point(a[row][i].x, a[row][i].y);
                ellipse(a[row][i].x, a[row][i].y + (row+1), (row + 1)  , 3 * ( row + 1) )

            }
        }

        // line same row
        let prev_dot = {x: 0, y:0};
        for (let row = 0; row < a.length; row++){
            stroke(c_palette_strings[row % c_palette_strings.length]);
            strokeWeight(max(1, this.row_0_stroke - row));
            let prev_dot = {x: 0, y:0};
            for (let i = 0; i < a[row].length; i++ ) {
                if (i!=0) {
                    stroke(a[row][i].color);
                    //strokeWeight((a.length-row+1)/4); 
                    line(a[row][i].x, a[row][i].y, prev_dot.x, prev_dot.y);
                }
                prev_dot = a[row][i];
            }
        }
    }

}


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



// generate palette from a coolors.co  style url: https://coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51
function palette_from_url(url) {
	let slaIndex = url.lastIndexOf("/");
	let colStr = url.slice(slaIndex + 1);
	let colArr = colStr.split("-");
	//for(let i = 0; i < colArr.length; i++)colArr[i] = "#" + colArr[i];
	for(let i = 0; i < colArr.length; i++)colArr[i] = colArr[i];
	return colArr;
}

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

function random_color(palette) {
	//console.log("random_color palette="+palette);
	return "#"+random(palette);
}

function fixed_color(i, palette) {
	return "#"+ palette[i % palette.length];
}


/////////////////////////////// treure <-----

// as_color = true return array of colors, else return array of codes (with "#")
function palette_random_chromotome(num = 3, as_color = false) {
    // palette as an array of colors (https://openprocessing.org/sketch/1377780)
    let palette = [];
    while (palette.length < 3) {                        // want a palette with minimum 3 items
        palette = [];
        palette = shuffle(chromotome.get().colors);     // get array of color numbers
    }
    if (as_color) {
        for(let i = 0; i < palette.length; i++){        // convert to array of colors
            palette[i] = color(palette[i]);
        }
    }
    palette = shuffle(palette);
    return palette;
}
