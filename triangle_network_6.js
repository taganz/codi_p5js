"use strict";
/*
 Inspired in Sol Lewitt's Complex Forms
 https://www.artsy.net/artwork/sol-lewitt-complex-forms-set-of-5-1
*/
let sketch_name = "triangle_network_6";
let canvas_size = 800;
let arr_dots;
let color_dots_1;
let color_dots_2;
let color_line_same_row;
let color_line_other_row;
let color_mode;
let dots_strokeWeight = 10;
let lines_strokeWeight = 20;


let palette = ["335c67","fff3b0","e09f3e","9e2a2b","540b0e"];
let palette_verds = ["d8f3dc","b7e4c7","95d5b2","74c69d","52b788","40916c","2d6a4f","1b4332","081c15"];
let palette_blaus = ["03045e","023e8a","0077b6","0096c7","00b4d8","48cae4","90e0ef","ade8f4","caf0f8"];
let palette_color_0;

			  
function setup() {

    width = canvas_size;
    height = canvas_size;
    createCanvas(width, height);
    
    keyboard_image_name(sketch_name); // set default image save name

    
    sliders_add(2, 35, 10, 1, "rows");	// 0
    sliders_add(2, 20, 15, 1, "rows_min");	
    sliders_add(2, 35, 14, 1, "rows_max");	
    sliders_add(0, 2, 1, 1, "noise_mode");	
    sliders_add(0.001, 0.1, 0.05, 0.005, "perlin_k");	
    
	//palette = shuffle(palette);
    palette_color_0 = "#" + palette[0];
    palette = palette.slice(1, );

}


function draw() {

    let ch = sliders_changed();
    switch (ch) {
        case "_first_":
        case "rows":
        case "rows_min":
        case "rows_max":
            arr_dots = grid_create(rows, rows_min, rows_max, width);
		    // aixo es perque alguns triangles no es dibuixen be i almenys te fondo de la paletta
		    fill(color(palette_color_0));
		    square(0, 0, canvas_size); 
        case "noise_mode":
        case "perlin_k":
        default:
		    clear();
            background(0);
            grid_draw_triangles(arr_dots, noise_mode, perlin_k);
    }

}


// a: 2d array of dots
// draw triangles
// noise_mode:  0 = no noise, 1 = perlin triangles (fast), 2 = perlin dot level (slow)
// k: perlin noise factor
function grid_draw_triangles(a, noise_mode=0, k=0.005) {


    // lines to next rows
    //stroke(color_line_other_row);  
    noStroke();
    strokeWeight(1); 
    let triangle_color = 0;  
    for (let row = 0; row < a.length - 1; row++) {              // all rows
        for (let i = 0; i < a[row].length; i++ ) {              // all dots in current row

            // triangles with vertex in current dot and base in neighbours

            let dot_a = a[row][i];
            for (let n = 1; n < a[row][i].neighbours.length; n++) {     // all neighbours for dot_a
                // a triangle with vertex in A and base in two neigbours B & C
                let dot_b =  a[row][i].neighbours[n-1];
                let dot_c = a[row][i].neighbours[n];
                //print(dot_a + " " + dot_b + " " + dot_c);
                let col = fixed_color(triangle_color, palette_blaus);
                triangle_color++;
                switch (noise_mode) {
                    case 1:
                        perlin_triangle_2(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y, col, k, 60, 12);
                    break;
                    case 2:
                        perlin_triangle(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y, col, k, 1, 30)
                        break;
                    case 0:
                    default:                    
                        fill(col);
                        triangle(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y);
                }
            }

            // triangle with base in current row and vertex in neighbours 

            if (i < a[row].length -1 && a[row][i].neighbours.length > 0  ) {
                let dot_a = a[row][i];
                let dot_b =  a[row][i+1];
                let dot_c = a[row][i].neighbours[a[row][i].neighbours.length-1];

                let col = fixed_color(triangle_color, palette_verds);
                triangle_color++;
                switch (noise_mode) {
                    case 1:
                        perlin_triangle_2(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y, col, k, 60, 12)
                        break;
                    case 2:
                        perlin_triangle(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y, col, k, 1, 30)
                        break;
                    case 0:
                    default:                    
                        fill(col);
                        triangle(dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y);
                }
            }


        
        }
    }
    
}


