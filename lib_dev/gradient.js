

const Y_AXIS = 1;
const X_AXIS = 2

//let canvas_size = 800;
//let palette;



function gradientBox(x, y, w, h, c1, c2, axis) {

    noFill();
  
    if (axis === Y_AXIS) {
      // Gradiente de arriba a abajo
      for (let i = y; i <= y + h; i++) {
        let inter = map(i, y, y + h, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
      }
    } else if (axis === X_AXIS) {
      // Gradiente de izquierda a derecha
      for (let i = x; i <= x + w; i++) {
        let inter = map(i, x, x + w, 0, 1);
        let c = lerpColor(c1, c2, inter);
        stroke(c);
        line(i, y, i, y + h);
      }
    }
  }


function gradientLine(x1, y1, x2, y2, color_1, color_2, sz) {
    noStroke();
    const d = dist(x1, y1, x2, y2)
    for (let i = 0; i < d; i++) {
      const step = map(i, 0, d, 0, 1)
      const x = lerp(x1, x2, step)
      const y = lerp(y1, y2, step)
      const c = lerpColor(color_1, color_2, step)
      fill(c)
      ellipse(x, y, sz, sz)
    }
  }