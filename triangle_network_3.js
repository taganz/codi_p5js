let canvas_size = 800;
let palette;
let arr_dots;
let color_dots_1;
let color_dots_2;
let color_line_same_row;
let color_line_other_row;
let color_mode;
let dots_strokeWeight = 10;
let lines_strokeWeight = 20;
let palette_id = 8;

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background('white');

    keyboard_image_name("triangle_network_3"); // set default image save name

    //palette = palette_navy_blue;
    palette = fixed_palette(palette_id);

    fill(random_color(palette_id));
 
    sliders_add(2, 35, 15, 1);	// 0
    sliders_add(2, 20, 16, 1);	
    sliders_add(20, 35, 25, 1);	
    sliders_add(0, 50, dots_strokeWeight, 1); // 3
    sliders_add(0, 10, palette_id, 1); // 4
    sliders_add(0, 50, lines_strokeWeight, 1); // 5
    sliders_format(height + 50);    

    color_mode = 0;     // 0 = random color lines, 1 = fixed green, 2 = fixed palette
    
    switch(color_mode) {
        case 1:
            color_dots_1 = color("green");
            color_dots_2 = color("green");
            color_line_same_row = color("green");
            color_line_other_row = color("green");
            break;
        case 2:
        default:
            color_dots_1 = fixed_color(1, palette);
            color_dots_2 = fixed_color(2, palette);
            color_line_same_row = fixed_color(3, palette);
            color_line_other_row = fixed_color(6, palette);
            break;
    }
    
}


function draw() {

    if (sliders_gui_need_refresh) {
        dots_strokeWeight = sliders_object[3].value();
        palette_id = sliders_object[4].value();
        palette = fixed_palette(palette_id);
        lines_strokeWeight = sliders_object[5].value();
        clear();
        background(random_color(palette));
        sliders_gui_need_refresh = false;
        arr_dots = grid_create(sliders_object[0].value(), sliders_object[1].value(), sliders_object[2].value(), width);
        //grid_draw(arr_dots);
        grid_draw_triangles(arr_dots);
    }
}

// return array of dots with neighbours (array of dots)
//           {x, y, neighbours}
function grid_create(rows, row_min, row_max, room_size) {
    let x, y, y_max_row, y_max_previous_row, dots_this_row;
    y_max_previous_row = 0;
    let row_height = room_size / rows;

    // create array 2d and distribute points 

    let a = [];
    for (let row = 0; row < rows; row++){
        a[row] = new Array();
        y_max_row = 0;
        dots_this_row = floor(random(row_min, row_max));
        let x_ref = room_size / (dots_this_row - 2);
        for (let i = 0; i < dots_this_row; i++) {

            if (row == 0) { 
                y = 0;
            }
            else if (row == rows-1) {
                y = room_size -1;
            }
            else {
                // y somewhere between min previous row and the space left divide by remaining rows
                y = floor(random(row_height * row, row_height * (row + 1)  ));
                if (y > y_max_row) {
                    y_max_row = y;
                }
            }

            if (i == 0) {
                x = 0;
            }
            else if (i == dots_this_row -1) {
                x = room_size - 1;
            }
            else {
                x = floor(random(x_ref * (i-1) , x_ref * i));
            }
            a[row].push({x: x , y: y});
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
        //print("row: "+row);
        for (let i = 0; i < a[row].length - 1; i++ ) {
            //print("i: "+i);
            for (let ni=0; ni < a[row][i].neighbours.length; ni++) {
                //print("ni: "+ni + " - neighbours: " + a[row][i].neighbours[ni].x + " - length: "+ a[row][i].neighbours.length);
                for (let nj=0; nj < a[row][i+1].neighbours.length; nj++) {
                    //print("nj: "+nj + " - neighbours: " + a[row][i+1].neighbours[nj].x + " - length: "+ a[row][i+1].neighbours.length);
                    //print(a[row][i].x);
                    //print(a[row][i].y);
                    //print(a[row][i].neighbours[ni].x);
                    //print(a[row][i].neighbours[ni].y); 
                    //print(a[row][i+1].x);
                    //print(a[row][i+1].y); 
                    //print(a[row][i+1].neighbours[nj].x);
                    //print(a[row][i+1].neighbours[nj].y);
                if ( intersects (
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

     
	return a;
}

// a: 2d array of dots
// draw dots and lines for neighbours
function grid_draw(a) {

    // dots

    stroke('purple'); // Change the color
    strokeWeight(dots_strokeWeight); // Make the points 10 pixels in size
    for (let row = 0; row < a.length; row++){
        if (row % 2 == 0) {
            stroke(color_dots_1);
        }
        else {
            stroke(color_dots_2);
        }
        for (let i = 0; i < a[row].length; i++ ) {
            point(a[row][i].x, a[row][i].y);
        }
    }


    // line same row

    stroke(color_line_same_row);  
    strokeWeight(lines_strokeWeight); 
    let prev_dot = {x: 0, y:0};
    for (let row = 0; row < a.length; row++){
        let prev_dot = {x: 0, y:0};
        for (let i = 0; i < a[row].length; i++ ) {
            if (i!=0) {
                if (color_mode == 0) {
                    stroke(random_color(palette));
                }
                line(a[row][i].x, a[row][i].y, prev_dot.x, prev_dot.y);
            }
            prev_dot = a[row][i];
        }
    }


    // lines to next rows
    stroke(color_line_other_row);  
    strokeWeight(lines_strokeWeight); 
    for (let row = 0; row < a.length - 1; row++) {
        for (let i = 0; i < a[row].length; i++ ) {
            for (let n = 0; n < a[row][i].neighbours.length; n++) {
                if (color_mode == 0) {
                    stroke(random_color(palette));
                }
                line(a[row][i].x, a[row][i].y, a[row][i].neighbours[n].x, a[row][i].neighbours[n].y);
            }
        }
    }
    
}

// a: 2d array of dots
// draw triangles
function grid_draw_triangles(a) {


    // lines to next rows
    stroke(color_line_other_row);  
    noStroke();
    strokeWeight(1); 
    let triangle_color = 0;
    for (let row = 0; row < a.length - 1; row++) {
        for (let i = 0; i < a[row].length; i++ ) {

            // triangles with vertex in dot i
            let dot_a = a[row][i];
            for (let n = 1; n < a[row][i].neighbours.length; n++) {
                let dot_b =  a[row][i].neighbours[n-1];
                let dot_c = a[row][i].neighbours[n];
                //print(dot_a + " " + dot_b + " " + dot_c);
                fill(fixed_color(triangle_color, palette));
                triangle_color++;
                triangle(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y);
            }

            // triangle with base between dot i and i+1
            if (i < a[row].length -3 && a[row][i].neighbours.length > 0  ) {
                fill(fixed_color(triangle_color, palette));
                triangle_color++;
                let dot_a = a[row][i];
                let dot_b =  a[row][i+1];
                let dot_c = a[row][i].neighbours[a[row][i].neighbours.length-1];
                triangle(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y);
            }
        
        }
    }
    
}


// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a,b,c,d,p,q,r,s) {
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

  