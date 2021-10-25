let canvas_size = 800;
let cell_number = 10;
let cell_size;
const arr_cells = new Array(cell_number);
let palette;

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background('white');

    palette = random_palette();


    cell_size = canvas_size / cell_number;
    // build cells array
    for (let i = 0; i < cell_number; i++) {
        arr_cells[i] = new Array(cell_number);
        for (let j = 0; j < cell_number; j++) {
            arr_cells[i][j] = { tile: Math.floor(Math.random(0, 1) * 2), 
                                color_1 : null, color_2: null, color_3: null };
            // initialize first tile colors
            if (i == 0 && j == 0) {
                arr_cells[i][j].color_1 = fixed_color(0, palette);
                arr_cells[i][j].color_2 = fixed_color(1, palette);
                arr_cells[i][j].color_3 = fixed_color(2, palette);
            }
            print(i + ", " + j + "; " + arr_cells[i][j].tile + " - " + arr_cells[i][j].color_1);
        }
    }
    
}


function draw() {
    // draw cells array
    for (let i = 0; i < cell_number; i++) {
        for (let j = 0; j < cell_number; j++) {
            let x = j * cell_size;
            let y = i * cell_size;
            //truchet_draw_triangles(x, y, cell_size, arr_cells[i][j]);
            //truchet_draw_curves(x, y, cell_size, arr_cells[i][j]);
            truchet_draw_diagonals_color(x, y, cell_size, arr_cells, i, j, random_color(palette));
            print(i + ", " + j + "; " + arr_cells[i][j].tile + " - " + arr_cells[i][j].color_1);
        }
    }

    noLoop();
}



// draw  truchet tiles cell - diagonals
function truchet_draw_diagonals_color(x1, y1, size, arr_cells, i, j, new_color) {
    fill('white');
    //square(x1, y1, size);
    // 
    strokeWeight(6);
    let xm = x1 + size/2;
    let ym = y1 + size/2;
    let x2 = x1 + size - 1;
    let y2 = y1 + size - 1;
    
    // get tile colors
    let cell_up, cell_left;
    let tile_type = arr_cells[i][j].tile;
    let color_1 = arr_cells[i][j].color_1;
    let color_2 = arr_cells[i][j].color_2;
    let color_3 = arr_cells[i][j].color_3;
    // cell left
    if (j > 0) {
        cell_left = arr_cells[i][j-1];
    } else {
        cell_left = null;
    }
    // cell up
    if (i > 0) {
        cell_up = arr_cells[i-1][j];
    } else {
        cell_up = null;
    }


    switch (arr_cells[i][j].tile) {
        case 0:
            if (cell_up != null) {
                // not first line
                color_1 = cell_up.tile == 0 ? cell_up.color_2 : cell_up.color_3;
                color_2 = cell_up.tile == 0 ? cell_up.color_3 : cell_up.color_2;
                color_3 = new_color;
            } else {
                // first line
                if (cell_left != null) {
                    color_1 = cell_left.tile == 0 ? cell_left.color_2 : cell_left.color_1;
                    color_2 = cell_left.tile == 0 ? cell_left.color_3 : cell_left.color_2;
                    color_3 = new_color;
                }
            }
            break;
        case 1:
            if (cell_up != null) {
                // not first line
                color_2 = cell_up.tile == 0 ? cell_up.color_2 : cell_up.color_3;
                color_1 = cell_up.tile == 0 ? cell_up.color_3 : cell_up.color_2;
                if (cell_left == null) {
                    color_3 = new_color;
                } else {
                    color_3 = cell_left.tile == 0 ? cell_left.color_3 : cell_left.color_2;
                }
            } else {
                // first line
                if (cell_left != null) {
                    color_2 = cell_left.tile == 0 ? cell_left.color_2 : cell_left.color_1;
                    color_3 = cell_left.tile == 0 ? cell_left.color_3 : cell_left.color_2;
                    color_1 = new_color;
                } 
            }
            break;
        default:
            print(" *** error tile_type *** ");

    }

    // draw tile
    switch(arr_cells[i][j].tile) {
        case 0:
            noStroke();
            fill(color_2);
            square(x1, y1, size);
            fill(color_1);
            triangle(x1, y1, xm, y1, x1, ym);
            fill(color_3);
            triangle(x2, ym, xm, y2, x2, y2);
            stroke("black");
            line(xm, y1, x1, ym);
            line(x2, ym, xm, y2);
            break;
        case 1:
            noStroke();
            fill(color_2);
            square(x1, y1, size);
            fill(color_1);
            triangle(xm, y1, x2, ym, x2, y1);
            fill(color_3);
            triangle(x1, ym, xm, y2, x1, y2);
            stroke("black");
            line(xm, y1, x2, ym);
            line(x1, ym, xm, y2);
            break;
        default:
            print(" *** error tile_type 2 *** ")
        }

        arr_cells[i][j].color_1 = color_1;
        arr_cells[i][j].color_2 = color_2;
        arr_cells[i][j].color_3 = color_3;
        
}