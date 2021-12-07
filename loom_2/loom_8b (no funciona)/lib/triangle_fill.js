/*

    Fills a triangle
    v1, v2, v3: dots format {x: 99, y: 99}
    line_func: a function that draw a line between to point, i.e. "line"

    algorithm from http://www.sunshine2k.de/coding/java/TriangleRasterization/TriangleRasterization.html



*/


function triangle_fill(v1, v2, v3, line_func) {

 // console.log("entering triangle fill "+ v1 + " " + v2 + " " +v3 + " "+line_func);
   /* at first sort the three vertices by y-coordinate ascending so v1 is the topmost vertice */
  let array = [v1, v2, v3];
  let array2 = sortVerticesAscendingByY(array);
  v1 = array2[0];
  v2 = array2[1];
  v3 = array2[2];

  /* here we know that v1.y <= v2.y <= v3.y */
  /* check for trivial case of bottom-flat triangle */
  if (v2.y == v3.y)
  {
    fillBottomFlatTriangle(v1, v2, v3, line_func);
  }
  /* check for trivial case of top-flat triangle */
  else if (v1.y == v2.y)
  {
    fillTopFlatTriangle(v1, v2, v3, line_func);
  }
  else
  {
    /* general case - split the triangle in a topflat and bottom-flat one */
    let v4 = { x: v1.x + ((v2.y - v1.y) / (v3.y - v1.y)) * (v3.x - v1.x), y: v2.y };
    fillBottomFlatTriangle(v1, v2, v4, line_func);
    fillTopFlatTriangle(v2, v4, v3, line_func);
  }
}

function fillTopFlatTriangle(v1, v2, v3, line_f) {

  let invslope1 = (v3.x - v1.x) / (v3.y - v1.y);
  let invslope2 = (v3.x - v2.x) / (v3.y - v2.y);

  let curx1 = v3.x;
  let curx2 = v3.x;

  for (let scanlineY = v3.y; scanlineY > v1.y; scanlineY--)
  {
    line_f(curx1, scanlineY, curx2, scanlineY);
    curx1 -= invslope1;
    curx2 -= invslope2;
  }
}


function fillBottomFlatTriangle(v1, v2, v3, line_f) {

  let invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
  let invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

  let curx1 = v1.x;
  let curx2 = v1.x;

  for (let scanlineY = v1.y; scanlineY <= v2.y; scanlineY++)
  {
    line_f(curx1, scanlineY, curx2, scanlineY);
    curx1 += invslope1;
    curx2 += invslope2;
  }
}

// sort the three vertices by y-coordinate ascending so v1 is the topmost vertice 
function sortVerticesAscendingByY(ar) {
    //console.log("ar entrada "+JSON.stringify(ar));
    let higher = Math.min(ar[0].y, ar[1].y, ar[2].y);
    // put first at [0]
    switch(higher) {
        case ar[0].y:
            break;
        case ar[1].y:
            [ar[0], ar[1]] = [ar[1], ar[0]];
            break;
        case ar[2].y:
            [ar[0], ar[2]] = [ar[2], ar[0]];
            break;
        default:
            console.log("*** ERROR sortVerticesAscendingByY " +JSON.stringify(ar))
    }
    // put second at [1]
    if (ar[1].y > ar[2].y) {
        [ar[1], ar[2]] = [ar[2], ar[1]];
    }
    //console.log("ar sortida "+JSON.stringify(ar));
    return ar;
}