let canvas_size = 800;
let cell_number = 30;
const arr_cells = new Array(cell_number);

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background('white');


    cell_size = canvas_size / cell_number;
    // build cells array
    for (let i = 0; i < cell_number; i++) {
        arr_cells[i] = new Array(cell_number);
        for (let j = 0; j < cell_number; j++) {
            arr_cells[i][j] = Math.floor(Math.random(0, 1) * 4);
        }
    }
    
}


function draw() {
    // draw cells array
    for (let i = 0; i < cell_number; i++) {
        for (let j = 0; j < cell_number; j++) {
            x = j * cell_size;
            y = i * cell_size;
            //truchet_draw_triangles(x, y, cell_size, arr_cells[i][j]);
            //truchet_draw_curves(x, y, cell_size, arr_cells[i][j]);
            truchet_draw_diagonals(x, y, cell_size, arr_cells[i][j]);
        }
    }


}

// draw  truchet tiles cell - triangles
function truchet_draw_triangles(x1, y1, size, cell_code) {
    fill('white');
    square(x1, y1, size);
    // opposite vertex
    x2 = x1 + size - 1;
    y2 = y1 + size - 1;
    switch(cell_code) {
        case 0:
            fill('red');
            triangle(x1, y2, x2, y1, x2, y2);
            break;
        case 1:
            fill('red');
            triangle(x1, y1, x1, y2, x2, y2);
            break;
        case 2:
            fill('red');
            triangle(x1, y1, x1, y2, x2, y2);
            break;
        case 3:
            fill('red');
            triangle(x1, y1, x2, y1, x2, y2);
            break;
        default:
            // empty
    }

}
    
// draw  truchet tiles cell - curves
function truchet_draw_curves(x1, y1, size, cell_code) {
    fill('white');
    //square(x1, y1, size);
    // 
    strokeWeight(6);
    x2 = x1 + size - 1;
    y2 = y1 + size - 1;
    switch(cell_code) {
        case 0:
        case 2:
            //fill('red');
            arc(x1, y1, size, size, 0, HALF_PI);
            arc(x2, y2, size, size, -PI, -HALF_PI);
            break;
        case 1:
        case 3:
            //fill('red');
            arc(x2, y1, size, size, HALF_PI, PI);
            arc(x1, y2, size, size, -HALF_PI, 0);
            break;
        default:
            // empty
    }

}

// draw  truchet tiles cell - diagonals
function truchet_draw_diagonals(x1, y1, size, cell_code) {
    fill('white');
    //square(x1, y1, size);
    // 
    strokeWeight(6);
    xm = x1 + size/2;
    ym = y1 + size/2;
    x2 = x1 + size - 1;
    y2 = y1 + size - 1;
    switch(cell_code) {
        case 0:
        case 2:
            //fill('red');
            line(xm, y1, x1, ym);
            line(x2, ym, xm, y2);
            break;
        case 1:
        case 3:
            //fill('red');
            line(xm, y1, x2, ym);
            line(x1, ym, xm, y2);
            break;
        default:
            // empty
    }

}
