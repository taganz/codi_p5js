/*

  22/11/21 
  llegeix una imatge

  funcio per obtenir un array de punts amb color a partir de la imatge



*/

let canvas_size = 800;
let palette;
let img;


function preload() {
    img = loadImage('assets/image/flower.png');
    //img = loadImage('assets/image/victor roc avi 2.png');
    //img = loadImage('assets/image/victor.png');
    

   // sliders_preload();
}

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height);
    background('white');

    palette = random_palette();
    fill(random_color(palette))
    
    print(img.width + ' • ' + img.height);

    sliders_activate();
    sliders_add(1, 30, 5, 1,  "dot_size");  
    sliders_add(1, 100, 10, 1, "sample_rate"); 
    sliders_add(1, 3, 2, 0.25, "fract"); 
}



function draw() {



    if (sliders_changed()) {
        let dots = image_dots_sample(img, sample_rate, img.width/ fract, img.height / fract);
        clear();
        image_dots_draw(dots, dot_size);
    }

    
}

// returns an array of dots {x, y, color}
function image_dots_sample(image, sample_rate, target_w, target_h){


    let dots = new Array();

    for (let x = 0; x < image.width; x+=sample_rate){
        for (let y = 0; y < image.height; y+=sample_rate){
        let dot_x = round(map(x, 0, img.width, 0, target_w));
        let dot_y = round(map(y, 0, img.height, 0, target_h));
        let c = color(image.get(x, y));   
         dots.push({x: dot_x, y: dot_y, color:c })
        }
    }
    return dots;
}

function image_dots_draw(dots, dot_size = 1) {
    strokeWeight(dot_size);
    for (let i = 0; i < dots.length; i++){
        let A = dots[i];
        stroke(A.color);
        point (A.x, A.y);
    }

}
