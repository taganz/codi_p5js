
function setup() {

    createCanvas(windowWidth, windowHeight);
    noLoop();
}


function draw() {

    long_x = 40;
    long_y = 40;
    c1 = color('green');
    c2 = color('yellow');
    c3 = color('blue');
    c4 = color('red');
    c5 = color('cian');

    for (let x = 0; x < windowWidth; x+= long_x) {
        for (let y = 0; y < windowHeight; y+= long_y) {
            const orientation = shuffle([X_AXIS, Y_AXIS])[0];
            gradientBox(x, y, long_x, long_y, c2, c3, orientation);

        }
    }
    
    //gradientLine(100, 400, 300, 600, c1, c3, 60);
    //gradientLine(100, 500, 300, 700, color(0, 0, 0), color(0, 100, 100), 60);
}


