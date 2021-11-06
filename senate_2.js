let canvas_size = 800;
let palette;
let palette_i;
let color_shift=0;
let speed_color_shift = 10;
let speed_palette = 100;
let seat_width;
let background_color;

let step = 0;
let osc_speed = 200;
let osc_seat_speed = 15;
let osc_row = 0;
let osc_seat = 0;
let osc = 0;


let senate;

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height, WEBGL);
    background_color = color("#603808");
    background(background_color);


    colorMode(RGB);
    background(255, 255, 255);

    //fill(random_color(palette))

    rotX = 5.8;
    rotY = 3.9;
    rotZ = 3.0;
    transX = 40;
    transY = -200;
    transZ = -400;
    
    sliders_add(0, TWO_PI, rotX, 0);	 // 0
	sliders_add(0, TWO_PI, rotY, 0);
    sliders_add(0, TWO_PI, rotZ, 0);
    sliders_add(0, 10, 3, 1); // palette 3
    sliders_add(0, 10, 3, 1); // color shift    4
    sliders_add(-400, 400, transX, 0);   //  5
    sliders_add(-400, 400, transY, 0);
    sliders_add(-400, 400, transZ, 0);
    sliders_format(canvas_size + 10);
		
    seat_width = 25;
    row_height = 32;

    senate = senate_generate(17, seat_width, row_height);
}


function draw() {

    // reset screen

  //  keyboard_draw_start();
    orbitControl();
    clear();
    background(background_color);

    // sliders
    if (sliders_gui_need_refresh == true) {
        sliders_gui_need_refresh = false;
        rotX = sliders_object[0].value();
        rotY = sliders_object[1].value();
        rotZ = sliders_object[2].value();
        
        transX = sliders_object[5].value();
        transY = sliders_object[6].value();
        transZ = sliders_object[7].value();
        palette_i = floor(sliders_object[3].value());
        palette = fixed_palette( palette_i);
    }
    if (step % speed_color_shift == 0) {
        color_shift++;
    }
    if (step % speed_palette == 0){
        palette_i++;
        palette = fixed_palette( palette_i);
        print(palette_i);
    }


    // draw
    rotateX(rotX);
    rotateY(rotY);
    rotateZ(rotZ);
    translate(transX, transY, transZ);
    
    stroke('white');
    box(50);

    stroke("red");
        
      
    senate_draw(senate);

    step++;
    
}





function senate_generate(rows_num, row_height, seat_width) {

    rows = new Array();
    let radius_first = 50;
    let radius_increment = 40;
    let row_radius;

    for (let row = 1; row < rows_num; row++) {
        
        //seat_row(rows, 50*rows, rows * 80, seat_width);
        rows[row] = new Array();
        
        // number of seats depends on radius
        row_radius = radius_first + row * radius_increment;
        let seats = PI * row_radius / seat_width / 1.3;

        for (let seat = 0; seat < seats; seat++) {

        
            let x = row_radius * cos(PI/seats * seat );
            let z = row_radius * sin(PI/seats * seat );
            let y = row * row_height;

            rows[row][seat] = {x: x, y: y, z: z}
        }    
    }

    return rows;
}

function senate_draw(rows){

    for (let row = 1; row < rows.length; row++) {
        
        seats = rows[row].length;

        for (let seat = 0; seat < seats; seat++) {

            let s = rows[row][seat];
            noStroke();
            fill(fixed_color(seat + color_shift + row * sliders_object[4].value() , palette));
            push();
            translate(s.x, s.y, s.z);
            rotateY(PI/2 - PI/2/seats * seat * 2);
            //sphere(10);
            plane(seat_width, seat_width);
            translate(0, -seat_width/2, -seat_width/2);
            rotateX(PI/2);
            plane(seat_width, seat_width);
            pop();
    
        }
    }
}


function seat_row(row, height, radius, seat_width) {



    // change oscilling row 
    if (step % osc_speed == 0) {
        osc_row = floor(random(0, 20));
    }
    // change farthest oscilling seat
    if (row == osc_row) {
        //print("step: " + step + " osc_row: " + osc_row + " osc_seat:" + osc_seat + " seats: " + seats);
        if (step % osc_seat_speed == 0) {
            osc_seat = osc_seat > seats ? 0 : osc_seat + 1;
        }
    }
    step++;


    for (let i = 0; i < seats; i++) {

        noStroke();
        push();
        //rotateZ(PI*3/5 + PI/2/seats * i *2);
        rotateZ(PI + PI/2/seats * i * 2);
        if (row == osc_row) {
            osc = (i < osc_seat)  ? sin(PI/4+i/seats*1.5*TWO_PI)*100 : 0;
        }
   

    }    
    
}