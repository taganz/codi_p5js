let canvas_size = 800;
let cells_in_row = 20;
let cell_size;
const arr_cells = new Array(cells_in_row);
let palette;
let draw_step;

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background('white');

    palette = random_palette();


    cell_size = canvas_size / cells_in_row;
    cells_total = Math.pow(cells_in_row, 2);
    // build cells array
    truchet_create_array(arr_cells, cells_in_row, cells_in_row, palette);

    draw_step = 0;
    
}


function draw() {
    // draw cells array

    if (draw_step > cells_total) {
        palette = random_palette();
        truchet_create_array(arr_cells, cells_in_row, cells_in_row, palette);
        draw_step = 0;
    }
    else {
        let i_max = draw_step - floor(draw_step / cells_in_row) * cells_in_row;
        let j_max = draw_step % cells_in_row;
        //print(draw_step + " " + i_max + " " + j_max);
        for (let i = 0; i <= i_max; i++) {
            for (let j = 0; j <= j_max; j++) {
                let x = j * cell_size;
                let y = i * cell_size;
                truchet_draw_diagonals_color_cell(x, y, cell_size, arr_cells, i, j);
            }
        }
        draw_step++;
    }
}



// draw  truchet tiles cell - diagonals
function truchet_create_array(arr_cells, i_max, j_max, palette) {

    // clear array
    arr_cells.splice(0, arr_cells.length);
    let tile;
    let xcolor_1;
    let xcolor_2;
    let xcolor_3;

    for (let i = 0; i <= i_max; i++) {

        arr_cells[i] = new Array(j_max + 1);

        for (let j = 0; j <= j_max; j++) {

            // random tile
            tile = Math.floor(Math.random(0, 1) * 2);


            // initialize first tile colors 
            if (i == 0 && j == 0) {
                xcolor_1 = fixed_color(floor(random(0, palette.length)), palette);
                xcolor_2 = fixed_color(floor(random(0, palette.length)), palette);
                xcolor_3 = fixed_color(floor(random(0, palette.length)), palette);
                //print(color_1 + " " + color_2 + " " + color_3)
            } 
                
            // next tiles

            let new_color = random_color(palette);
            let cell_up, cell_left;

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

            // get tile colors to match neighbour tiles
            
            switch (tile) {
                case 0:
                    if (cell_up != null) {
                        // not first line
                        xcolor_1 = cell_up.tile == 0 ? cell_up.color_2 : cell_up.color_3;
                        xcolor_2 = cell_up.tile == 0 ? cell_up.color_3 : cell_up.color_2;
                        xcolor_3 = new_color;
                    } else {
                        // first line
                        if (cell_left != null) {
                            xcolor_1 = cell_left.tile == 0 ? cell_left.color_2 : cell_left.color_1;
                            xcolor_2 = cell_left.tile == 0 ? cell_left.color_3 : cell_left.color_2;
                            xcolor_3 = new_color;
                        }
                    }
                    break;
                case 1:
                    if (cell_up != null) {
                        // not first line
                        xcolor_2 = cell_up.tile == 0 ? cell_up.color_2 : cell_up.color_3;
                        xcolor_1 = cell_up.tile == 0 ? cell_up.color_3 : cell_up.color_2;
                        if (cell_left == null) {
                            xcolor_3 = new_color;
                        } else {
                            xcolor_3 = cell_left.tile == 0 ? cell_left.color_3 : cell_left.color_2;
                        }
                    } else {
                        // first line
                        if (cell_left != null) {
                            xcolor_2 = cell_left.tile == 0 ? cell_left.color_2 : cell_left.color_1;
                            xcolor_3 = cell_left.tile == 0 ? cell_left.color_3 : cell_left.color_2;
                            xcolor_1 = new_color;
                        } 
                    }
                    break;
                default:
                    print(" *** error tile_type *** ");


            }

            // store values
            arr_cells[i][j] = { tile: tile, color_1 : xcolor_1, color_2: xcolor_2, color_3: xcolor_3 };
            
            // draw tile
            //truchet_draw_diagonals_color_cell(x1, y1, size, arr_cells, i, j);
        }
    }
}


function truchet_draw_diagonals_color_cell(x1, y1, size, arr_cells, i, j) {
    fill('white');
    //square(x1, y1, size);
    // 
    strokeWeight(6);
    let xm = x1 + size/2;
    let ym = y1 + size/2;
    let x2 = x1 + size - 1;
    let y2 = y1 + size - 1;

    let color_1 = arr_cells[i][j].color_1;
    let color_2 = arr_cells[i][j].color_2;
    let color_3 = arr_cells[i][j].color_3;

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
        
}