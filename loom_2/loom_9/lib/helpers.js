// helpers

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



function keyPressed() {
if (key == 's' || key == 'S') {
    saveCanvas(save_image_name, 'png');
}

if (key == 'p' || key == 'P') {
    if (_keyboard_paused) {
        loop();
        _keyboard_paused = false;
    } else {
        noLoop();
        _keyboard_paused = true;
    }
}
}


function triangle_fill_gradation(x1, y1, x2, y2, x3, y3, rc, gc, bc, k=0.05, color_range=30, divisions=3) {
    let dx = (x3-x2)/divisions;  // divide base 
    let dy = (y3-y2)/divisions;  // divide base 
    //noStroke();
    for (let t = 0; t < divisions; t++) {  // for each triangle division
        let i = x2+dx*t;  // this is the dot 2 for current triangle
        let j = y2+dy*t;

        let r = noise(i*k,j*k)
        let g = noise(i*k+1000,j*k+1000)
        let b = noise(i*k+2000,j*k+2000)
        b = map (b, 0, 1, bc-color_range, bc+color_range);
        r = map (r, 0, 1, rc-color_range, rc+color_range);
        g = map (g, 0, 1, gc-color_range, gc+color_range);
        stroke(r, g, b);
        fill(r, g, b)
        triangle(x1, y1, i, j, i+dx, j+dy);
    }
}
