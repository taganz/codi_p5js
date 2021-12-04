// triangles mes separats+



/*
//** OPC START **
OPC.slider("SEED", 663, 1, 1000, 1);
OPC.slider("ROWS", 6, 6, 20, 1);
OPC.slider("DOTS_ROW", 168, 3, 250, 1);
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



const palette_array = [
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

    

function setup() {

    SEED_0 = null;
    
    // --- comentar en OPC
    sliders_activate();
    sliders_add(1, 1000, 607, 1, "SEED");
    sliders_add(0, 1, 1, 1, "MODE");   // 0.loom, 1.brain
    sliders_add(6, 20, 9, 1, "ROWS");
    sliders_add(3, 250, 17, 1, "DOTS_ROW");
    sliders_add(1, 60, 22, 1, "WEIGHT");
    sliders_add(1, 15, 1, 1, "STRING_BASE");
    sliders_add(0.01, 0.01, 0.05, 0.01, "STRING_WEIGHT_RATIO");
    sliders_add(0, 10, 8, 0.1, "OSCILLATION_X");
    sliders_add(0, 30, 25, 0.1, "OSCILLATION_Y");
    sliders_add(1, 100, 93, 1, "PERIOD_X");
    sliders_add(1, 100, 91, 1, "PERIOD_Y");
    sliders_add(1, 5, 2, 0.1, "AMPLITUDE_FACTOR_X");
    sliders_add(1, 5, 2, 0.1, "AMPLITUDE_FACTOR_Y");
    // --- comentar en OPC
    

    createCanvas(windowWidth, windowHeight);	  
    
}


function draw() {

    if (SEED_0 != SEED 
            || MODE_0 != MODE
			|| ROWS_0 != ROWS
			|| DOTS_ROW_0 != DOTS_ROW
			|| WEIGTH_0 != WEIGHT) {
			
				reset();
    }
	
    clear();
    background(c_background_color, 30/100 * 255 );
    tens.display();
    tens.move();
    step++;
	
}

function reset() {
	
    randomSeed(SEED*100);
    noiseSeed(SEED);  
    palette = random(palette_array);                   // precuinades
    c_background_color = color(palette[0]);
    c_palette = palette.slice(1,);
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


        //console.log("this.a ", this.a);
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


