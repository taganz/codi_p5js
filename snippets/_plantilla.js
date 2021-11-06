let canvas_size = 800;
let palette;

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background('white');

    palette = random_palette();

    palette = random_palette();
    fill(random_color(palette))
    
}


function draw() {

    square(10, 10, 300); 
}

