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

