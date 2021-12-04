let canvas_size = 800;
let palette;

let palette_url = "https://coolors.co/10451d-155d27-1a7431-208b3a-25a244-2dc653-4ad66d-6ede8a-92e6a7-b7efc5";

function setup() {

    the_canvas = createCanvas(canvas_size, canvas_size);
    background('white');


    palette = palette_from_url(palette_url);
    
    sliders_add(1, 5, 3, 1, "sketch");	
    sliders_add(1, 25, 25, 1, "rows");	
    sliders_add(2, 1000, 570, 1, "w");	
    sliders_add(2, 1000, 620, 1, "h");	
    sliders_add(2, 10, 9, 1, "inner_rows");	
    sliders_add(1, 5, 3, 1, "ka");	
    sliders_add(1, 5, 4, 1, "kb");	
    

}

function draw() {

    let var_changed = sliders_changed();
    if (var_changed != null ) {
        clear();
        fill(255);
        square(0, 0, 800);
    
        switch(sketch) {
            case 1:
                draw_sketch_1();        
                break;
            case 2:
                draw_sketch_2();
                break;
            case 3:
                draw_sketch_3();
                break;
            default:
                fill('green');
                circle(50, 50, 100);
            }
       
        //print(arr_dots[0]);
    }
}


// triangle amb linies i uns petits superposats
function draw_sketch_1() {

    // array for outer tree
    arr_dots = grid_triangle_create(rows, w, h);
    grid_draw(arr_dots, color("green"), color("green"), color("green"), color("green"), 0, 0);
    
    // some inner trees
    for (let row = 0; row < arr_dots.length-1; row++) {

        for (let i = 0; i < floor(random(0, arr_dots[row].length + 1 )); i++)  {    // subdivisions per linia

            let vertex_dot = floor(random(0, arr_dots[row].length-1));

            let inner_width = arr_dots[row+1][1].x - arr_dots[row+1][0].x;
            let inner_height = arr_dots[row+1][0].y - arr_dots[row][0].y;
            let arr_dots_inner = grid_triangle_create(floor(random(2, inner_rows)), inner_width * ka, inner_height * kb);
            let offset_x = arr_dots[row][0].x + inner_width/2 + (vertex_dot - 1) * inner_width;
            let offset_y = inner_height * row;
            let color_1 = fixed_color(i, palette);
            let color_2 = fixed_color(i+1, palette);
            grid_draw(arr_dots_inner, color("green"), color("green"), color_1, color_2, offset_x, offset_y );

        }
    }
    
}

// triangle unic arlequinat
function draw_sketch_2() {

    // array for outer tree
    arr_dots = grid_triangle_create(rows, w, h);
    grid_draw_triangles_fill(arr_dots, palette, color("green"), color("green"), color("green"), color("green"), 0, 0)

}

// diversos triangles random
function draw_sketch_3() {

    // array for outer tree
    for (let tree = 1; tree < random(3, 4); tree++) {
        arr_dots = grid_triangle_create(floor(random(3, rows)), floor(w*random(0.3, 0.5)), floor(h * random(0.3, 0.6)));
        grid_draw_triangles_fill(arr_dots, random_palette(), color("green"), color("green"), color("green"), color("green"), random(0, 300), random(0, 300))
    }

}



/* 

 create an array of dots representing a subdivided triangle

    rows: number of rows (1..rows)
    origin top left containing square
    
 */

function grid_triangle_create(rows, triangle_width, triangle_height) {
    let x, y, y_max_row, y_max_previous_row, dots_this_row;
    y_max_previous_row = 0;
    let row_height = (triangle_height / (rows - 1) );

    // create array 2d and distribute points 

    let a = [];


    // row 0

    a[0] = new Array();
    a[0].push({x: triangle_width/2, y: 0});

    // rows 1 to rows - 1

    for (let row = 1; row < rows; row++){
        a[row] = new Array();
        //y_max_row = 0;
        //dots_this_row = floor(random(row_min, row_max));
        dots_this_row = row + 1;        // <--- posar random density
        //print("dots for row "+row+": "+dots_this_row);
        let row_width = triangle_width * row_height * row / triangle_height;  // proporcionalitat
        let row_dots_separation = row_width / (dots_this_row -1);
        let row_first_dot_x = triangle_width/2 - (dots_this_row - 1) / 2 * row_dots_separation;

        // crate dots for row

        for (let i = 0; i < (row + 1) ; i++) {
            //y = floor(random(row_height * row, row_height * (row + 1)  ));
            y = row_height * row;
            x = row_first_dot_x + i * row_dots_separation;            
            a[row].push({x: x , y: y});
            //console.log(row, i, x, y);
        }
    }


    // add lines from points to points in next lines
    
    
    // lines to next rows
    for (let row = 0; row < a.length - 1; row++){                   // per cada linia
        for (let i = 0; i < a[row].length; i++ ) {                  // per cada punt de la linia en curs
            let x_prev = i == 0 ? 0 : a[row][i-1].x;                // x del germa esquerra
            let x_post = i == a[row].length -1 ? triangle_width : a[row][i+1].x;  // x del germa dret
            a[row][i].neighbours = new Array();
            for (let j=0; j < a[row+1].length; j++) {               // per cada punt de la linia seguent
                if (a[row+1][j].x >= x_prev && a[row+1][j].x <= x_post) {    // si esta entre els meus germans, apunta-me'l com a vei
                    a[row][i].neighbours.push({x: a[row+1][j].x, y: a[row+1][j].y});  // apunta'l com a vei
                }
            }
        }
    }

    /*

    // erase intersection lines
    for (let row = 0; row < a.length - 1; row++){
        //print("row: "+row);
        for (let i = 0; i < a[row].length - 1; i++ ) {
            //print("i: "+i);
            for (let ni=0; ni < a[row][i].neighbours.length; ni++) {
                //print("ni: "+ni + " - neighbours: " + a[row][i].neighbours[ni].x + " - length: "+ a[row][i].neighbours.length);
                for (let nj=0; nj < a[row][i+1].neighbours.length; nj++) {
                   // print("nj: "+nj + " - neighbours: " + a[row][i+1].neighbours[nj].x + " - length: "+ a[row][i+1].neighbours.length);
                   // print("a[row][i]: " + a[row][i].x)+ ", "+a[row][i].y;
                   // print("a[row][i].neighbours[ni]: " + a[row][i].neighbours[ni].x + ", " + a[row][i].neighbours[ni].y);
                   // print("a[row][i+1]: " + a[row][i+1].x)+ ", "+a[row][i+1].y;
                   // print(`a[row][i+1].neighbours[nj]: ${a[row][i + 1].neighbours[nj].x}, ${a[row][i + 1].neighbours[nj].y}`);
                if ( _grid_intersects (
                        a[row][i].x, 
                        a[row][i].y, 
                        a[row][i].neighbours[ni].x, 
                        a[row][i].neighbours[ni].y, 
                        a[row][i+1].x, 
                        a[row][i+1].y, 
                        a[row][i+1].neighbours[nj].x, 
                        a[row][i+1].neighbours[nj].y) ) {
                            //print("splicing at row "+row + " x, y: " +a[row][i].x+", "+a[row][i].y);
                            a[row][i+1].neighbours.splice(nj,1);
                    }
                }
            }
        }
    }
    */

     
	return a;
}





let grids_dots_stroke_weight = 2; // 10

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
        //print("dots for row "+row+": "+dots_this_row);
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
                   // print("nj: "+nj + " - neighbours: " + a[row][i+1].neighbours[nj].x + " - length: "+ a[row][i+1].neighbours.length);
                   // print("a[row][i]: " + a[row][i].x)+ ", "+a[row][i].y;
                   // print("a[row][i].neighbours[ni]: " + a[row][i].neighbours[ni].x + ", " + a[row][i].neighbours[ni].y);
                   // print("a[row][i+1]: " + a[row][i+1].x)+ ", "+a[row][i+1].y;
                   // print(`a[row][i+1].neighbours[nj]: ${a[row][i + 1].neighbours[nj].x}, ${a[row][i + 1].neighbours[nj].y}`);
                if ( _grid_intersects (
                        a[row][i].x, 
                        a[row][i].y, 
                        a[row][i].neighbours[ni].x, 
                        a[row][i].neighbours[ni].y, 
                        a[row][i+1].x, 
                        a[row][i+1].y, 
                        a[row][i+1].neighbours[nj].x, 
                        a[row][i+1].neighbours[nj].y) ) {
                            //print("splicing at row "+row + " x, y: " +a[row][i].x+", "+a[row][i].y);
                            a[row][i+1].neighbours.splice(nj,1);
                    }
                }
            }
        }
    }

     
	return a;
}

// a: 2d array of dots

function grid_draw(a, 
        color_dots_1 = color("green"),
        color_dots_2 = color("red"),         
        color_line_same_row = color("blue"),
        color_line_other_row = color("black"),
        offset_x = 0,   
        offset_y = 0

        ) {



    // dots

    stroke('purple'); // Change the color
    strokeWeight(10); // Make the points 10 pixels in size
    for (let row = 0; row < a.length; row++){
        if (row % 2 == 0) {
            stroke(color_dots_1);
        }
        else {
            stroke(color_dots_2);
        }
        for (let i = 0; i < a[row].length; i++ ) {
            strokeWeight(grids_dots_stroke_weight);   // 10
            point(offset_x + a[row][i].x, offset_y + a[row][i].y);
        }
    }


    // line same row

    stroke(color_line_same_row); // Change the color
    strokeWeight(1); // Make the points 10 pixels in size
    let prev_dot = {x: 0, y:0};
    for (let row = 0; row < a.length; row++){
        let prev_dot = {x: 0, y:0};
        for (let i = 0; i < a[row].length; i++ ) {
            if (i!=0) {
                line(offset_x + a[row][i].x, offset_y + a[row][i].y, offset_x + prev_dot.x, offset_y + prev_dot.y);
            }
            prev_dot = a[row][i];
        }
    }


    // lines to next rows
    stroke(color_line_other_row);
    for (let row = 0; row < a.length - 1; row++) {
        for (let i = 0; i < a[row].length; i++ ) {
            for (let n = 0; n < a[row][i].neighbours.length; n++) {
                line(offset_x + a[row][i].x, offset_y + a[row][i].y, offset_x + a[row][i].neighbours[n].x, offset_y + a[row][i].neighbours[n].y);
            }
        }
    }

}

// a: 2d array of dots with a cascading triangle structure

function grid_draw_triangles_fill(a, 
    palette,
    color_dots_1 = color("green"),
    color_dots_2 = color("red"),         
    color_line_same_row = color("blue"),
    color_line_other_row = color("black"),
    offset_x = 0,   
    offset_y = 0

    ) {



// dots

stroke('purple'); // Change the color
strokeWeight(10); // Make the points 10 pixels in size
for (let row = 0; row < a.length; row++){
    if (row % 2 == 0) {
        stroke(color_dots_1);
    }
    else {
        stroke(color_dots_2);
    }
    for (let i = 0; i < a[row].length; i++ ) {
        strokeWeight(grids_dots_stroke_weight);   // 10
        point(offset_x + a[row][i].x, offset_y + a[row][i].y);
    }
}


// for each row draw one triangle 

stroke(color_line_same_row); // Change the color
strokeWeight(1); 

let prev_dot = {x: 0, y:0};

for (let row = 0; row < a.length-2; row++){           // for each row
    let prev_dot = {x: 0, y:0};
    for (let i = 0; i < a[row].length; i++ ) {      // for each dot in the row
        // triangle with current dot on top
        fill(fixed_color(i, palette));  
        triangle(offset_x + a[row][i].x, offset_y + a[row][i].y,                          // current dot
            offset_x + a[row][i].neighbours[0].x, offset_y + a[row][i].neighbours[0].y,   // neighbour 0
            offset_x + a[row][i].neighbours[1].x, offset_y + a[row][i].neighbours[1].y);  // neighbour 1
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

  


  