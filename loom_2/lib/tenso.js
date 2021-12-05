
//
//
//  Tenso
//
//




class Tenso {

    constructor() {

        this.size = min(window_width, window_height);
        this.last_row_y = this.size * random (0.7, 1.1);
        this.no_cross = random() < 0.5;
        this.row_0_stroke = 3;
        this.rows = ROWS;
        this.off_x = floor((window_width - this.size)/2);
        this.off_y = floor((window_height - this.size)/2);

        this.a = new Array();
		
        if (MODE == 0) {
            this._constructor_curtain();
        }
        else {
           this._constructor_neurons();
        }

    }



    _constructor_curtain() {

        let a = this.a;

        let x, y, y_max_row, y_max_previous_row, dots_this_row;
        y_max_previous_row = 0;
        let row_height = this.size  / (this.rows + 2);

        
        for (let row = 0; row < this.rows; row++){       // create all rows
            this.a[row] = new Array();
            y_max_row = 0;
            dots_this_row = floor(DOTS_ROW * random(DOTS_LOWER_LIMIT, 1));
            //print("dots for row "+row+": "+dots_this_row);
            let x_ref = this.size / (dots_this_row - 2);
            let y_average = row_height * row * random(1,1.5);  // <--- CANVIAR_PER_SHUFFLE_VALORS
            let row_color_num = floor(random(0, c_palette.length-1));
            for (let i = 0; i < dots_this_row; i++) {

                // calculate y

                if (row == 0) {             
                    y = this.size * 0.02;                 // first row fixed
                }
                else if (row == this.rows-1) {
                    y = this.last_row_y;
                }
                else {
                    // y somewhere between min previous row and the space left divide by remaining rows
                    //y = floor(random(row_height * row, row_height * (row + 1)  ));
                    y = y_average + floor(0.05 * this.size / this.rows * noise (i * 0.5 + row));
                    y = y_average; //  + 20 - 10 * cos (i/dots_this_row * TWO_PI);
                    if (y > y_max_row) {
                        y_max_row = y;
                    }
                }

                // calculate x

                if (i == 0) {
                    x = 0;
                }
                else if (i == dots_this_row -1) {
                    x = this.size - 1;
                }
                else {
                    x = floor(random(x_ref * (i-1) , x_ref * i));
                }


                let weight = WEIGHT / 2/ (row/this.rows+1) * random(1- WEIGHT_VARIATION, 1 + WEIGHT_VARIATION);


                // color



                //let dot_color = palette_dots[ floor(lerp(0, palette_dots.length, row/ROWS)) ];

                let dot_color = lerpColor( c_palette[row_color_num], c_palette[row_color_num+1], row/ROWS);

                
                //let dot_color;
                //if (row % 2 == 0) {
                //    dot_color = lerpColor( color("#"+palette_dots[0]), color("#"+palette_dots[1]), sin(TWO_PI * i/dots_this_row ));
                //}
                //else {
                //    dot_color = lerpColor( color("#"+palette_dots[1]), color("#"+palette_dots[0]),  cos(TWO_PI * i/dots_this_row));
                //}
                
                //let phase = noise(x);
                let phase = lerp(0, PI, row/this.rows);

                // create point
                a[row].push({x: x, x0: x, y: y, y0: y, weight: weight, color: dot_color, phase: phase});


            }
            y_max_previous_row = y_max_row;
        }
    

        // add lines from points to points in previous lines
        
        
        // lines to next rows
        for (let row = 1; row < a.length ; row++){
            for (let i = 0; i < a[row].length; i++ ) {
                let x_prev = i == 0 ? 0 : a[row][i-1].x;
                let x_post = i == a[row].length -1 ? a[row][i].x : a[row][i+1].x;
                a[row][i].neighbours = new Array();
                for (let j=0; j < a[row-1].length; j++) {
                    if (a[row-1][j].x >= x_prev && a[row-1][j].x <= x_post) {
                        a[row][i].neighbours.push({x: a[row-1][j].x, y: a[row-1][j].y, x0: a[row-1][j].x0, y0: a[row-1][j].y0, weight: a[row-1][j].weight, color: a[row-1][j].color, phase: a[row-1][j].phase});
                    }
                }
            }
        }

        if (this.no_cross) {
            // erase intersection lines
            for (let row = 1; row < a.length ; row++){
                for (let i = 0; i < a[row].length - 1; i++ ) {
                    for (let ni=0; ni < a[row][i].neighbours.length; ni++) {
                        for (let nj=0; nj < a[row][i+1].neighbours.length; nj++) {
                        if ( _grid_intersects (
                                a[row][i].x, 
                                a[row][i].y, 
                                a[row][i].neighbours[ni].x, 
                                a[row][i].neighbours[ni].y, 
                                a[row][i+1].x, 
                                a[row][i+1].y, 
                                a[row][i+1].neighbours[nj].x, 
                                a[row][i+1].neighbours[nj].y) ) {
                                a[row][i+1].neighbours.splice(nj,1);
                            }
                        }
                    }
                }
            }
        }


        //console.log("this.a ", this.a);
    }


    _constructor_neurons() {

        let a = this.a;

        let x, y, y_max_row, y_max_previous_row, dots_this_row;
        y_max_previous_row = 0;
        let row_height = this.size  / (this.rows + 2);

        
        for (let row = 0; row < this.rows; row++){       // create all rows
            this.a[row] = new Array();
            y_max_row = 0;
            dots_this_row = floor(DOTS_ROW * random(DOTS_LOWER_LIMIT, 1));
            //print("dots for row "+row+": "+dots_this_row);
            let x_ref = this.size / (dots_this_row - 2);
            let y_average = row_height * row * random(1,1.5);  // <--- CANVIAR_PER_SHUFFLE_VALORS
            let row_color_num = floor(random(0, c_palette.length-1));
            for (let i = 0; i < dots_this_row; i++) {

                // calculate y

                if (row == 0) {             
                    //y = this.size * 0.02;                 // first row fixed
                    y = 0;                 // first row fixed
                }
                else if (row == this.rows-1) {
                    y = this.last_row_y;
                }
                else {
                    // y somewhere between min previous row and the space left divide by remaining rows
                    //y = floor(random(row_height * row, row_height * (row + 1)  ));
                    y = y_average + floor(0.05 * this.size / this.rows * noise (i * 0.5 + row));
                    y = y_average + random(-30, 20); // <----
                    if (y > y_max_row) {
                        y_max_row = y;
                    }
                }

                // calculate x

                if (i == 0) {
                    x = 0;
                }
                else if (i == dots_this_row -1) {
                    x = this.size - 1;
                }
                else {
                    x = floor(random(x_ref * (i-1) , x_ref * i));
                }


                let weight = WEIGHT / 2/ (row/this.rows+1) * random(1- WEIGHT_VARIATION, 1 + WEIGHT_VARIATION);


                // color



                //let dot_color = palette_dots[ floor(lerp(0, palette_dots.length, row/ROWS)) ];

                let dot_color = lerpColor( c_palette[row_color_num], c_palette[row_color_num+1], row/ROWS);

                
                //let dot_color;
                //if (row % 2 == 0) {
                //    dot_color = lerpColor( color("#"+palette_dots[0]), color("#"+palette_dots[1]), sin(TWO_PI * i/dots_this_row ));
                //}
                //else {
                //    dot_color = lerpColor( color("#"+palette_dots[1]), color("#"+palette_dots[0]),  cos(TWO_PI * i/dots_this_row));
                //}
                
                //let phase = noise(x);
                let phase = lerp(0, PI, row/this.rows);

                // create point
                a[row].push({x: x, x0: x, y: y, y0: y, weight: weight, color: dot_color, phase: phase});


            }
            y_max_previous_row = y_max_row;
        }

        // add lines from points to points in previous lines
        
        
        // lines to next rows
        for (let row = 1; row < a.length ; row++){
            for (let i = 0; i < a[row].length; i++ ) {
                let x_prev = i == 0 ? 0 : a[row][i-1].x;
                let x_post = i == a[row].length -1 ? a[row][i].x : a[row][i+1].x;
                a[row][i].neighbours = new Array();
                for (let j=0; j < a[row-1].length; j++) {
                    if (a[row-1][j].x >= x_prev && a[row-1][j].x <= x_post) {
                        a[row][i].neighbours.push({x: a[row-1][j].x, y: a[row-1][j].y, x0: a[row-1][j].x0, y0: a[row-1][j].y0, weight: a[row-1][j].weight, color: a[row-1][j].color, phase: a[row-1][j].phase});
                    }
                }
            }
        }

        if (this.no_cross) {
            // erase intersection lines
            for (let row = 1; row < a.length ; row++){
                for (let i = 0; i < a[row].length - 1; i++ ) {
                    for (let ni=0; ni < a[row][i].neighbours.length; ni++) {
                        for (let nj=0; nj < a[row][i+1].neighbours.length; nj++) {
                        if ( _grid_intersects (
                                a[row][i].x, 
                                a[row][i].y, 
                                a[row][i].neighbours[ni].x, 
                                a[row][i].neighbours[ni].y, 
                                a[row][i+1].x, 
                                a[row][i+1].y, 
                                a[row][i+1].neighbours[nj].x, 
                                a[row][i+1].neighbours[nj].y) ) {
                                a[row][i+1].neighbours.splice(nj,1);
                            }
                        }
                    }
                }
            }
        }


        //console.log("this.a ", this.a);
    }


    move_curtain() {

        let a = this.a;

        
        for (let row = 1; row < a.length; row++){                                           // per cada linia a partir de la 1 (la 0 no es mou)
            let amp_x = lerp(0, 1, row/this.rows*AMPLITUDE_FACTOR_X) * OSCILLATION_X;       // oscil.lacio a la linia
            let amp_y = lerp(0, 1, row/this.rows*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            let osc_y_x = OSC_Y_FACTOR + (this.rows - row) * OSC_Y_FACTOR_ROW;
            let amp_x_n = lerp(0, 1, (row-1)/this.rows*AMPLITUDE_FACTOR_X) * OSCILLATION_X; // oscil.lacio linia anterior, per la 0 es zero
            let amp_y_n = lerp(0, 1, (row-1)/this.rows*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            let osc_y_x_n = OSC_Y_FACTOR + (this.rows - (row-1)) * OSC_Y_FACTOR_ROW;

            for (let i = 0; i < a[row].length; i++ ) {
                    a[row][i].x = a[row][i].x0 +  amp_x * Math.sin(TWO_PI * step / PERIOD_X +  a[row][i].phase);   
                    a[row][i].y = a[row][i].y0 +  amp_y * Math.sin(TWO_PI * step / PERIOD_Y + i/osc_y_x + a[row][i].phase);   

                    if (a[row][i].neighbours != null) {
                        for (let n = 0; n < a[row][i].neighbours.length; n++) {
                            a[row][i].neighbours[n].x = a[row][i].neighbours[n].x0 +  amp_x_n * Math.sin(TWO_PI * step / PERIOD_X +  a[row][i].neighbours[n].phase);   
                            a[row][i].neighbours[n].y = a[row][i].neighbours[n].y0 +  amp_y_n * Math.sin(TWO_PI * step / PERIOD_Y + i/osc_y_x_n + a[row][i].neighbours[n].phase);   
                        }
                    }

                }
            }
        }

    move_neurons() {

        let a = this.a;

        
        for (let row = 1; row < a.length; row++){                                           // per cada linia a partir de la 1 (la 0 no es mou)
            let amp_x = lerp(0, 1, row/this.rows*AMPLITUDE_FACTOR_X) * OSCILLATION_X;       // oscil.lacio a la linia
            let amp_y = lerp(0, 1, row/this.rows*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            let osc_y_x = OSC_Y_FACTOR + (this.rows - row) * OSC_Y_FACTOR_ROW;
            let amp_x_n = lerp(0, 1, (row-1)/this.rows*AMPLITUDE_FACTOR_X) * OSCILLATION_X; // oscil.lacio linia anterior, per la 0 es zero
            let amp_y_n = lerp(0, 1, (row-1)/this.rows*AMPLITUDE_FACTOR_Y) * OSCILLATION_Y;
            let osc_y_x_n = OSC_Y_FACTOR + (this.rows - (row-1)) * OSC_Y_FACTOR_ROW;

            for (let i = 0; i < a[row].length; i++ ) {                  // per cada punt de la linia
                //a[row][i].x = this._move_1(a[row][i]);
                //a[row][i].y = this._move_2(a[row][i]);
                this._move_1(a[row][i]);
                
                    if (row > 1) {
                        if (a[row][i].neighbours != null) {
                            for (let n = 0; n < a[row][i].neighbours.length; n++) {
                                //a[row][i].neighbours[n].x = this._move_1(a[row][i].neighbours[n]);
                                this._move_1(a[row][i].neighbours[n]);
                            }
                        }
                    }

                }
            }
        }

        _move_1(d) {
            //return x + 10 * (0.5 - noise(x * 0.005)); // convergeixen en 4 punts
            //return x + 10 * Math.cos(TWO_PI * x/this.size * step / 50);
            d.x = d.x0 + 10 * Math.cos(TWO_PI * step % 50 + d.x0 );
            d.y = d.y0 + 10 * Math.cos(TWO_PI * step % 50 + d.y0 );
            d.x = min(max(d.x, 0), this.size);
            d.y = min(max(d.y, 0), this.size);
        }
        

    display() {
    
        let a = this.a;

        // lines to parent row
        for (let row = 1; row < a.length ; row++) {                     // per cada linia a partir de la 1
            //stroke(fixed_color(row, palette_strings));
            for (let i = 0; i < a[row].length; i++ ) {                  // per cada punt de la linia
                stroke(a[row][i].color);
                for (let n = 0; n < a[row][i].neighbours.length; n++) {                           // per cada pare del punt
                    strokeWeight(STRING_BASE + a[row][i].weight * STRING_WEIGHT_RATIO); 
                    line(this.off_x + a[row][i].x, this.off_y + a[row][i].y, this.off_x + a[row][i].neighbours[n].x, this.off_y + a[row][i].neighbours[n].y);   // linia de punt a pare n
                }
            }
        }

        // dots
        //stroke('purple'); // Change the color
        for (let row = 0; row < a.length; row++){
            //stroke(fixed_color(row, palette_strings));
            for (let i = 0; i < a[row].length; i++ ) {
                stroke(a[row][i].color);
                fill(a[row][i].color);
                strokeWeight(floor(a[row][i].weight));

                // <--- PUNT O OVALS
                // point(a[row][i].x, a[row][i].y);
                ellipse(this.off_x + a[row][i].x, this.off_y + a[row][i].y + (row+1), (row + 1)  , 3 * ( row + 1) )

            }
        }

        // line same row
        let prev_dot = {x: 0, y:0};
        for (let row = 0; row < a.length; row++){
            stroke(c_palette_strings[row % c_palette_strings.length]);
            strokeWeight(max(1, this.row_0_stroke - row));
            let prev_dot = {x: 0, y:0};
            for (let i = 0; i < a[row].length; i++ ) {
                if (i!=0) {
                    stroke(a[row][i].color);
                    //strokeWeight((a.length-row+1)/4); 
                    line(this.off_x + a[row][i].x, this.off_y + a[row][i].y, this.off_x + prev_dot.x, this.off_y + prev_dot.y);
                }
                prev_dot = a[row][i];
            }
        }
    }

    
    display_triangles() {    // works for modes 0, 1, 2
    
        let a = this.a;

        // lines to next rows
        stroke("green");  
        strokeWeight(1); 
        let triangle_color = 0;
        for (let row = 1; row < a.length ; row++) {
            for (let i = 0; i < a[row].length; i++ ) {

                // triangles with vertex in dot i
                let dot_a = a[row][i];
                for (let n = 1; n < a[row][i].neighbours.length; n++) {
                    let dot_b =  a[row][i].neighbours[n-1];
                    let dot_c = a[row][i].neighbours[n];
                    //print(dot_a + " " + dot_b + " " + dot_c);
                    //fill(c_palette[triangle_color%c_palette.length]);
                    //triangle(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y);
                    this._draw_triangle(dot_a, dot_b, dot_c, c_palette[triangle_color%c_palette.length]);
                    triangle_color++;
                }

                // triangle with base between dot i and i+1
                if (i < a[row].length -3 && a[row][i].neighbours.length > 0  ) {
                    //fill(c_palette[triangle_color%c_palette.length]);
                    //triangle_color++;
                    let dot_a = a[row][i];
                    let dot_b =  a[row][i+1];
                    let dot_c = a[row][i].neighbours[a[row][i].neighbours.length-1];
                    this._draw_triangle(dot_a, dot_b, dot_c, c_palette[triangle_color%c_palette.length]);
                    //this._draw_triangle(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y);
                    triangle_color++;
                }
            
            }
        }
    }

    _draw_triangle(dot_a, dot_b, dot_c, col, k = 0.05) {
        switch (NOISE_MODE) {
            case 1:   // subtriangles
                perlin_triangle_2(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y, col, k, 25, 15);
            break;
            case 2:     // WIP
                perlin_triangle_2(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y, col, k, 30, 15);
            break;
            case 0:   // fast
            default:              
                noStroke();
                //stroke(230);
                //strokeWeight(1);
                fill(col);
                triangle(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y);
        }
    }



    display_triangles_perlin(img_pix) {    // works for modes 3

        let a = this.a;

        /*
        // triangle per sobre diagonal
        let rp = red("pink");
        let gp = green("pink");
        let bp = blue("pink");
        let ap = alpha("pink");
        let rg = red("green");
        let gg = green("green");
        let bg = blue("green");
        let ag = alpha("green");
        this.perlin_triangle_4(pixels, this.size, 0, 0, this.size, 0, 0, this.size, rp, gp, bp);
        */


        stroke("green");  
        strokeWeight(1); 
        let triangle_color = 0;
        for (let row = 1; row < a.length ; row++) {                     // from row 1 to last
            for (let i = 0; i < a[row].length; i++ ) {                  // every point in row
                
  
                //let rc = red(a[row][i].color);
                //let gc = green(a[row][i].color);
                //let bc = blue(a[row][i].color);

                let dot_a = a[row][i];
                console.log(dot_a);

                // triangles with vertex in dot a
                for (let n = 1; n < a[row][i].neighbours.length; n++) {  // dots for base
                    let rc = red(c_palette[triangle_color%c_palette.length]);   // dot color <---
                    let gc = green(c_palette[triangle_color%c_palette.length]);
                    let bc = blue(c_palette[triangle_color%c_palette.length]);
                    triangle_color++;

                    let dot_b =  a[row][i].neighbours[n-1];
                    let dot_c = a[row][i].neighbours[n];
                    //print(dot_a + " " + dot_b + " " + dot_c);
                    //fill(c_palette[triangle_color%c_palette.length]);
                    //triangle(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y);
                    //this._draw_triangle(dot_a, dot_b, dot_c, c_palette[triangle_color%c_palette.length]);
                    this.perlin_triangle_4(img_pix, window_width, dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y, rc, gc, bc);
 //                   this.perlin_triangle_4(img_pix, window_width, dot_a.x, dot_a.y, dot_a.x+50, dot_a.y+25, dot_a.x, dot_a.y+50, rc, gc, bc);

                }

                // triangle with base between dot i and i+1
                if (i < a[row].length -3 && a[row][i].neighbours.length > 0  ) {
                    let rc = red(c_palette[triangle_color%c_palette.length]);   // dot color <---
                    let gc = green(c_palette[triangle_color%c_palette.length]);
                    let bc = blue(c_palette[triangle_color%c_palette.length]);
                    triangle_color++;
                    //fill(c_palette[triangle_color%c_palette.length]);
                    //triangle_color++;
                    //let dot_a = a[row][i];
                    let dot_b =  a[row][i+1];
                    let dot_c = a[row][i].neighbours[a[row][i].neighbours.length-1];
                    this.perlin_triangle_4(img_pix, window_width, dot_a.x, dot_a.y, dot_b.x, dot_b.y, dot_c.x, dot_c.y, rc, gc, bc);
                    //this._draw_triangle(dot_a, dot_b, dot_c, c_palette[triangle_color%c_palette.length]);
                    //this._draw_triangle(this.off_x + dot_a.x, this.off_y + dot_a.y, this.off_x + dot_b.x, this.off_y + dot_b.y, this.off_x + dot_c.x, this.off_y + dot_c.y);
                }

            }
        }
  
        //console.log("exiting display_triangles_perlin: ", img_pix[0], img_pix[1], img_pix[2], img_pix[3]);
      
    }

	
    perlin_triangle_4(img_px, img_w, x1, y1, x2, y2, x3, y3, rcol, gcol, bcol, k=PERLIN_K, pixel_size=PERLIN_PIXEL_SIZE, color_range=PERLIN_COLOR_RANGE) {

       let x1_o = floor(x1);
       let y1_o = floor(y1);
       let x2_o = floor(x2);
       let y2_o = floor(y2);
       let x3_o = floor(x3);
       let y3_o = floor(y3);

        
        // bounding box
        let X1 = Math.min(x1_o, x2_o, x3_o);
        let X2 = Math.max(x1_o, x2_o, x3_o);
        let Y1 = Math.min(y1_o, y2_o, y3_o);
        let Y2 = Math.max(y1_o, y2_o, y3_o);
        
        // reference point: a point outside bounding box
        let refX = X1 - 100;
        let refY = Y1 - 100;
        noStroke();
        for(let i = X1; i <= X2; i+=pixel_size){
            for(let j = Y1; j <= Y2; j+=pixel_size){
                // point is inside triangle if line from reference point (X1,Y1 - 1,1 ) to this point crosses 0 or 2 lines
                let cross_lines = 0;
                cross_lines +=  (_intersects(refX, refY, i, j, x1_o, y1_o, x2_o, y2_o) ) ? 1 : 0;
                cross_lines +=  (_intersects(refX, refY, i, j, x1_o, y1_o, x3_o, y3_o) ) ? 1 : 0;
                if (cross_lines < 2) {
                    cross_lines +=  (_intersects(refX, refY, i, j, x2_o, y2_o, x3_o, y3_o) ) ? 1 : 0;
                }
                // if point is inside triangle, paint it
                if (cross_lines == 1) {
                    let rn = noise(i*k,j*k)
                    let gn = noise(i*k+1000,j*k+1000)
                    let bn = noise(i*k+2000,j*k+2000)
                    let r = map (rn, 0, 1, rcol-color_range, rcol+color_range);
                    let b = map (bn, 0, 1, bcol-color_range, bcol+color_range);
                    let g = map (gn, 0, 1, gcol-color_range, gcol+color_range);       
                    //	write_color(img, x, y, r, g, b, alpha);
                    let x_canvas = i + this.off_x ;
                    let y_canvas = j + this.off_y ;
                    let index = floor(((x_canvas) + (y_canvas) * window_width) * 4 * pixel_density);
                    img_px[index] = r;
                    img_px[index + 1] = g;
                    img_px[index + 2] = b;
                    img_px[index + 3] = 255;
                }
            }
        }    
       // verdes tot el canvas
       for(let i = 0; i <= window_width; i+=1){
        for(let j = 0; j <= window_height; j+=50){
            //	write_color(img, x, y, r, g, b, alpha);
       //     let index = floor(((this.off_x + i) + (this.off_y + j) * img_w) * 4 * pixel_density);
            let index = floor(((i) + (j) * window_width) * 4 * pixel_density);
            img_px[index] = 0;
            img_px[index + 1] = 255;
            img_px[index + 2] = 0;
            img_px[index + 3] = 150;
        }
    }
       // vermell en figura
       for(let i = 0; i <= this.size; i+=1){
        for(let j = 0; j <= this.size; j+=50){
            //	write_color(img, x, y, r, g, b, alpha);
            let x_canvas = i + this.off_x ;
            let y_canvas = j + this.off_y ;
            let index = ((x_canvas + y_canvas * window_width) * 4 * pixel_density);
            img_px[index] = 255;
            img_px[index + 1] = 0;
            img_px[index + 2] = 0;
            img_px[index + 3] = 100;
        }
        }
        // vermell en figura
       for(let i = 0; i <= this.size; i+=1){
        for(let j = 0; j <= this.size; j+=50){
            let x_canvas = j + this.off_x ;
            let y_canvas = i + this.off_y ;
            let index = ((x_canvas + y_canvas * window_width) * 4 * pixel_density);
            img_px[index] = 255;
            img_px[index + 1] = 0;
            img_px[index + 2] = 0;
            img_px[index + 3] = 100;
        }
    }
    }
}
