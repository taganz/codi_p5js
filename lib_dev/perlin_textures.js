

// 
function perlin_square(x1, y1, x2, y2, color, noise_factor, pixel_size, color_range=30) {
	let k = noise_factor;
    noStroke();
    for(let i = x1; i < x2; i+=pixel_size){
        for(let j = y1; j < y2; j+=pixel_size){
            var r = noise(i*k,j*k)
            var g = noise(i*k+1000,j*k+1000)
            var b = noise(i*k+2000,j*k+2000)
            b = map (b, 0, 1, blue(color)-color_range, blue(color)+color_range);
            r = map (r, 0, 1, red(color)-color_range, red(color)+color_range);
            g = map (g, 0, 1, green(color)-color_range, green(color)+color_range);
            fill(r, g, b)
            rect(i,j,pixel_size)
        }
    }


}


/*
    divideix el triangle en tres triangle i els pinta de colors diferents perlin
    
    k = noise_factor
*/
function perlin_triangle_2(x1, y1, x2, y2, x3, y3, color, k, color_range=30, divisions=3) {
    let dx = (x3-x2)/divisions;  // divide base 
    let dy = (y3-y2)/divisions;  // divide base 
    //noStroke();
    for (let t = 0; t < divisions; t++) {  // for each triangle division
        let i = x2+dx*t;  // this is the dot 2 for current triangle
        let j = y2+dy*t;

        let r = noise(i*k,j*k)
        let g = noise(i*k+1000,j*k+1000)
        let b = noise(i*k+2000,j*k+2000)
        b = map (b, 0, 1, blue(color)-color_range, blue(color)+color_range);
        r = map (r, 0, 1, red(color)-color_range, red(color)+color_range);
        g = map (g, 0, 1, green(color)-color_range, green(color)+color_range);
        stroke(r, g, b);
        fill(r, g, b)
        triangle(x1, y1, i, j, i+dx, j+dy);
    }
}




/*

    MOLT LENT

    pinta els punts dins del triangle un per un
    per saber si el punt esta al triangle tira una linia des de fora i mira si es creua 1 sol cop
    molt lent!

    k = noise_factor

*/

function perlin_triangle(x1, y1, x2, y2, x3, y3, color, k, pixel_size, color_range=30) {
    // bounding box
    let X1 = Math.min(x1, x2, x3);
    let X2 = Math.max(x1, x2, x3);
    let Y1 = Math.min(y1, y2, y3);
    let Y2 = Math.max(y1, y2, y3);
    // reference point: a point outside bounding box
    let refX = X1 - 100;        // <---
    let refY = Y1 - 100;
    noStroke();
    for(let i = X1; i < X2; i+=pixel_size){
        for(let j = Y1; j < Y2; j+=pixel_size){
            // point is inside triangle if line from reference point (X1,Y1 - 1,1 ) to this point crosses 0 or 2 lines
            let cross_lines = 0;
            cross_lines +=  (_intersects(refX, refY, i, j, x1, y1, x2, y2) ) ? 1 : 0;
            cross_lines +=  (_intersects(refX, refY, i, j, x1, y1, x3, y3) ) ? 1 : 0;
            if (cross_lines < 2) {
                cross_lines +=  (_intersects(refX, refY, i, j, x2, y2, x3, y3) ) ? 1 : 0;
            }
            // if point is inside triangle, paint it
            if (cross_lines == 1) {
                let r = noise(i*k,j*k)
                let g = noise(i*k+1000,j*k+1000)
                let b = noise(i*k+2000,j*k+2000)
                b = map (b, 0, 1, blue(color)-color_range, blue(color)+color_range);
                r = map (r, 0, 1, red(color)-color_range, red(color)+color_range);
                g = map (g, 0, 1, green(color)-color_range, green(color)+color_range);
                fill(r, g, b)
                rect(i,j,pixel_size)
            }
        }
    }


}


// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function _intersects(a,b,c,d,p,q,r,s) {
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


  