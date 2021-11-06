let canvas_size = 800;
let palette;
let seat_width;
let background_color;

let slider_num = 5;
let slider_object = new Array();

let gui_need_refresh = true;

function setup() {

    width = canvas_size;
    height = canvas_size;
    the_canvas = createCanvas(width, height, WEBGL);
    background_color = color("#603808");
    background(background_color);


    colorMode(RGB);
    background(255, 255, 255);

    //fill(random_color(palette))

    rotX = 1.53;
    rotY = 6.09;
    rotZ = 5.47;
    slider_object[0] = createSlider(0, TWO_PI, rotX, 0);	
    slider_object[1] = createSlider(0, TWO_PI, rotY, 0);    
    slider_object[2] = createSlider(0, TWO_PI, rotZ, 0); 
    slider_object[3] = createSlider(0, 10, 3); // palette
    slider_object[4] = createSlider(0, 10, 3); // color shift
    slider_format(canvas_size + 10);
		
    seat_width = 40;
}


function draw() {

    // reset screen

    orbitControl();
    clear();
    background(background_color);

    // sliders
    rotX = slider_object[0].value();
    rotY = slider_object[1].value();
    rotZ = slider_object[2].value();
    palette = fixed_palette( slider_object[3].value());

    // draw

    translate(canvas_size / 2, canvas_size / 2, 0);
    
    stroke('white');
    box(50);

    stroke("red");
        
    
    //square(0,0,10);

    rotateX(rotX);
    rotateY(rotY);
    rotateZ(rotZ);
    
    for (let rows = 1; rows < 17; rows++) {
        seat_row(rows, 50*rows, rows * 80, seat_width);
    }
    
}

function seat_row(row, height, radius, seat_width) {

    let seats = PI * radius / seat_width / 1.3;


    for (let i = 0; i < seats; i++) {

        noStroke();
        fill(fixed_color(i + row * slider_object[4].value() , palette));
        push();
        //rotateZ(PI*3/5 + PI/2/seats * i *2);
        rotateZ(PI + PI/2/seats * i * 2);
        translate(radius, 0, height);
        plane(seat_width, seat_width);
        translate(seat_width/2, 0, seat_width/2);
        rotateY(PI/2);
        plane(seat_width, seat_width);        
        pop();

    }    
    
}



function slider_format(initial_y) {
    for (let i = 0; i < slider_num; i++){
		slider_object[i].position(10, initial_y + i * 20);
		slider_object[i].style('width', '180px');
		slider_object[i].changed(slider_changed);
    }	
	slider_changed();
}

function slider_changed() {
	gui_need_refresh = true;
    for (let i = 0; i < slider_num; i++){
        print("slider "+ i + ": " + slider_object[i].value());
    }
}
