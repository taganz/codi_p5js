let canvas_size = 800;
let palette;

let tens;
let step;
let palette_dots;
let palette_strings;

//let ROWS = 6;
let ROOM_SIZE = 800;
//let DOTS_ROW = 75;
let DOTS_LOWER_LIMIT = 0.8;
//let WEIGHT = 10;
let WEIGHT_VARIATION = 0.1;
//let OSCILLATION_X = 0.05;
//let OSCILLATION_Y = 0.1;
//let FREQUENCY_X = 2;
//let FREQUENCY_Y = 1;
//let STRING_WEIGHT_RATIO = 0.3;
//let AMPLITUDE_FACTOR_X = 0.5;
//let AMPLITUDE_FACTOR_Y = 0.5;


function setup() {


    sliders_activate();
    sliders_add(13, 20, 15, 1, "ROWS");
    sliders_add(3, 250, 250, 1, "DOTS_ROW");
    sliders_add(1, 60, 10, 1, "WEIGHT");
    sliders_add(0.1, 3, 0.3, 0.1, "STRING_WEIGHT_RATIO");
    sliders_add(0, 10, 0.5, 0.1, "OSCILLATION_X");
    sliders_add(0, 30, 0.5, 0.1, "OSCILLATION_Y");
    sliders_add(1, 60, 5, 1, "FREQUENCY_X");
    sliders_add(1, 60, 5, 1, "FREQUENCY_Y");
    sliders_add(1, 5, 0.5, 0.1, "AMPLITUDE_FACTOR_X");
    sliders_add(1, 5, 0.5, 0.1, "AMPLITUDE_FACTOR_Y");
    

    //ROWS, DOTS_ROW, WEIGHT = [15, 250, 10];

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background(210);


    palette_dots = random_palette();
    palette_strings = random_palette();
    palette_dots = ['606c38', '283618', 'fefae0', 'dda15e', 'bc6c25'];
    palette_strings = ['264653', '2a9d8f', 'e9c46a', 'f4a261', 'e76f51'];

    console.log("palette_dots: ", palette_dots);
    console.log("palette_strings: ", palette_strings);
    
    step = 0;
    tens = new Tenso();    


}


function draw() {

    let slider = sliders_changed();
    if (slider != null) {
        switch(slider) {
        case 'ROWS':
        case 'DOTS_ROW':
        case 'WEIGHT':
            step = 0;
            tens = new Tenso();    
        }
    }
    //square(10, 10, 300); 
    clear();
    tens.display();
    tens.move();
    step++;
    
}



class Tenso {

    constructor() {


        this.a = new Array();

        let a = this.a;

        let x, y, y_max_row, y_max_previous_row, dots_this_row;
        y_max_previous_row = 0;
        let row_height = ROOM_SIZE / (ROWS + 2);

        
        for (let row = 0; row < ROWS; row++){       // create all rows
            this.a[row] = new Array();
            y_max_row = 0;
            dots_this_row = floor(DOTS_ROW * random(DOTS_LOWER_LIMIT, 1));
            //print("dots for row "+row+": "+dots_this_row);
            let x_ref = ROOM_SIZE / (dots_this_row - 2);
            let y_average = row_height * row;
            for (let i = 0; i < dots_this_row; i++) {

                // calculate y

                if (row == 0) { 
                    y = 0;
                }
                else if (row == ROWS-1) {
                    y = ROOM_SIZE -1;
                }
                else {
                    // y somewhere between min previous row and the space left divide by remaining rows
                    //y = floor(random(row_height * row, row_height * (row + 1)  ));
                    y = y_average + floor( 2 * noise (i * 0.05 + row));
                    if (y > y_max_row) {
                        y_max_row = y;
                    }
                }

                // calculate x

                if (i == 0) {
                    x = 0;
                }
                else if (i == dots_this_row -1) {
                    x = ROOM_SIZE - 1;
                }
                else {
                    x = floor(random(x_ref * (i-1) , x_ref * i));
                }


                let weight = WEIGHT / 2/ (row/ROWS+1) * random(1- WEIGHT_VARIATION, 1 + WEIGHT_VARIATION);
                let color = "#" + palette_dots[ floor(lerp(0, palette_dots.length, row/ROWS)) ];
                //let phase = noise(x);
                let phase = lerp(0, PI, row/ROWS);

                // create point
                a[row].push({x: x, x0: x, y: y, y0: y, weight: weight, color: color, phase: phase});


            }
            y_max_previous_row = y_max_row;
        }

        // add lines from points to points in next lines
        
        
        // lines to next rows
        for (let row = 0; row < a.length - 1; row++){
            for (let i = 0; i < a[row].length; i++ ) {
                let x_prev = i == 0 ? 0 : a[row][i-1].x;
                let x_post = i == a[row].length -1 ? a[row][i].x : a[row][i+1].x;
                a[row][i].neighbours = new Array();
                for (let j=0; j < a[row+1].length; j++) {
                    if (a[row+1][j].x >= x_prev && a[row+1][j].x <= x_post) {
                        a[row][i].neighbours.push({x: a[row+1][j].x, y: a[row+1][j].y});
                    }
                }
            }
        }


        // erase intersection lines
        for (let row = 0; row < a.length - 1; row++){
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


        console.log("this.a ", this.a);
    }


    move() {

        let a = this.a;

        for (let row = 1; row < a.length; row++){       
            let amp_x = lerp(0, 1, row/ROWS*AMPLITUDE_FACTOR_X) * OSCILLATION_X;
            let amp_y = lerp(0, 1, row/ROWS*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            for (let i = 0; i < a[row].length; i++ ) {
                a[row][i].x = a[row][i].x0 +  amp_x * Math.sin(TWO_PI * step / FREQUENCY_X +  a[row][i].phase);   
                a[row][i].y = a[row][i].y0 +  amp_y * Math.sin(TWO_PI * step / FREQUENCY_Y + i + a[row][i].phase);   
            }
        }
    }

    display() {
    
        let a = this.a;

        // dots
        //stroke('purple'); // Change the color
        for (let row = 0; row < a.length; row++){
            for (let i = 0; i < a[row].length; i++ ) {
                stroke(a[row][i].color);
                strokeWeight(floor(a[row][i].weight));
                point(a[row][i].x, a[row][i].y);
            }
        }

        // line same row
        let prev_dot = {x: 0, y:0};
        for (let row = 0; row < a.length; row++){
            stroke(fixed_color(row, palette_strings));
            let prev_dot = {x: 0, y:0};
            for (let i = 0; i < a[row].length; i++ ) {
                if (i!=0) {
                    strokeWeight((a.length-row+1)/4); 
                    line(a[row][i].x, a[row][i].y, prev_dot.x, prev_dot.y);
                }
                prev_dot = a[row][i];
            }
        }

        // lines to next rows
        for (let row = 0; row < a.length - 1; row++) {
            stroke(fixed_color(row, palette_strings));
            for (let i = 0; i < a[row].length; i++ ) {
                for (let n = 0; n < a[row][i].neighbours.length; n++) {
                    strokeWeight(a[row][i].weight * STRING_WEIGHT_RATIO); 
                    line(a[row][i].x, a[row][i].y, a[row][i].neighbours[n].x, a[row][i].neighbours[n].y);
                }
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
