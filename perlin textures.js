let palette;
let redraw = true;

function setup() {

    w = min(windowWidth, windowHeight);
    wx = w;
    wy = w;
    createCanvas(wx, wy);

    background('white');

    fill(random_color(palette))
    sliders_add(0.01, 0.05, 0.02, 0.01, "k");
    sliders_add(1, 10, 3, 1, "grain");
    sliders_add(1, 500, 50, 5, "square_width");
    sliders_add(1, 10, 9, 1, "palette_id");
    
}

function draw() {

    palette = fixed_palette(palette_id);
    
    if (redraw)  {
        clear();
        background(220);
        for (let x = 0; x < windowWidth; x+= square_width) {
            for (let y = 0; y < windowHeight; y+= square_width) {
                perlin_square(x, y, x+square_width, y+square_width, random_color(palette), k, grain);
            }
        }
    }
    redraw = sliders_changed() != null;
    //square(10, 10, 300); 
}

// box blau     31,122 - 60,103 - 230, 107
function perlin_square(x1, y1, x2, y2, color, k, grain) {

    noStroke();
    for(let i = x1; i < x2; i+=grain){
        for(let j = y1; j < y2; j+=grain){
            var r = noise(i*k,j*k)
            var g = noise(i*k+1000,j*k+1000)
            var b = noise(i*k+2000,j*k+2000)
          // blue
          //  n = map (n, 0, 1, 31, 122);
          //  n2 = map (n2, 0, 1, 60, 103);
          //  n3 = map (n3, 0, 1, 230, 107);
            b = map (b, 0, 1, blue(color)-30, blue(color)+30);
            r = map (r, 0, 1, red(color)-30, red(color)+30);
            g = map (g, 0, 1, green(color)-30, green(color)+30);

            fill(r, g, b)
            rect(i,j,13)
        }
    }


}
