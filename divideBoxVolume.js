let width = 800;
let height = 800;
let the_canvas;
let context_WEBGL = true;
let rotationX;
let rotationY;
let rotationZ;
let font_default;
let first_box;
let box_height = 10;

let slider_val_1;
let val_1 = 0;
let slider_level_max;
let level_max = 0;
let slider_height;
let val_height = 0;
let slider_division_probability;
let val_division_probability = 0;

let btn_refresh;
let gui_need_refresh = true;

//var rover;

function setup() {
	
	// create sliders

	slider_val_1 = createSlider(0, 5, 2);
	slider_val_1.position(10, 100);
    slider_val_1.style('width', '180px');
	slider_val_1.changed(slider_changed);
	
	slider_level_max = createSlider(0, 15, 8);
	slider_level_max.position(10, 200);
    slider_level_max.style('width', '180px');
	slider_level_max.changed(slider_changed);
		
	slider_height = createSlider(0, 200, 20);
	slider_height.position(10, 300);
    slider_height.style('width', '180px');
	slider_height.changed(slider_changed);
	
	btn_refresh = createButton('refresh')
	btn_refresh.mousePressed(btn_refresh_pressed);
	btn_refresh.position(0, 500);
	
    	
	slider_division_probability = createSlider(0, 10, 7);
	slider_division_probability.position(10, 700);
    slider_division_probability.style('width', '180px');
	slider_division_probability.changed(slider_changed);

	the_canvas = createCanvas(width, height, WEBGL);

    /*
    rover = createRoverCam();
    rover.usePointerLock();    // optional; default is keyboard control only
    rover.setState({           // optional
      position: [-400,-200,-200],
      rotation: [0.4,0.3,0],
      sensitivity: 0.1,
      speed: 0.5
    });
    */
    
    rotationX = radians(-50);
    rotationY = radians(-30);
    rotationZ = radians(0);

   	
	palette = random_palette();
	background(100);

	//first_box = box3d_create(0, 0, 0, width, height, 10);
	first_box = box3d_create(0, 0, 0, 200, box_height, 200);
	
    fill('#ED225D');
    textFont(font_default);
    textSize(width / 10);
    textAlign(CENTER, CENTER);
}

function draw() {
	
	if (gui_need_refresh) {
		
		gui_need_refresh = false;
		
		val_1 = slider_val_1.value();
        print("val_1: "+val_1);
		level_max = slider_level_max.value();
        print("level_max: "+level_max);
		val_height = slider_height.value();
        print("val_height: "+val_height);
        val_division_probability = slider_division_probability.value()/10;
        print("val_division_probability: "+val_division_probability);
	
        
        clear();
        rotateX(rotationX);
        rotateY(rotationY);
        rotateZ(rotationZ);

        push();
        translate(100, 0, 0);
        box(200, 0, 0);
        translate(100, 0, 0);
        text("x", 0, 0);
        pop();

        push();
        translate(0, 100, 0);
        box(0, 200, 0);
        translate(0, 100, 0);
        text("y", 0, 0);
        pop();
        
        push();
        translate(0, 0, 100);
        box(0, 0, 200);
        translate(0, 0, 100);
        text("z", 0, 0);
        pop();
        
        
        
		box3d_draw(first_box, 'blue');
		//box3d_divide(first_box, val_division_probability, true, 0.5 + random(0, val_1) / 10, 3+random(0, level_max), palette);
		box3d_divide(first_box, val_division_probability, true, 1, level_max, palette);
	
	}

}


function preload() {
    font_default = loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf");
}
function slider_changed() {
	gui_need_refresh = true;
}

function btn_refresh_pressed() {
	gui_need_refresh = true;
}
  
/////////////////////////////////////////////////////////
// box3d functions
/////////////////////////////////////////////////////////


function box3d_create(x_1, y_1, z_1, width_1, height_1, depth_1) {
	return {x1: x_1, y1: y_1, z1: z_1, width: width_1, height : height_1, depth : depth_1};
	}

function box3d_draw(bx, color='white') {
	fill(color);
	translate(bx.x1 + bx.width/2, bx.y1 - bx.height/2, bx.z1 + bx.depth/2); 
	box(bx.width, bx.height, bx.depth);
	translate(- bx.x1 - bx.width/2, - bx.y1 + bx.height/2, - bx.z1 - bx.depth/2); 
}

// return a box at a position + (x_move, y_move, z_move)

function box3d_move(box, x_move, y_move, z_move) {
	return {x1: box.x1 + x_move, y1: box.y1 + y_move, z1: box.z1 + z_move,  width: box.width, height : box.height, depth : box.depth };
}

// divide a box recursively down to a depth

function box3d_divide(box, division_probability, last_division_was_horizontal, level, level_max, palette) {
	if (level >= level_max) {
		return;
	}
	let child_1;
	let child_2;
	if (random() < division_probability) {
		if (last_division_was_horizontal) {
			x_division = box.width * random(0.3, 0.7);
			child_1 = box3d_create(box.x1 + x_division, box.y1 - val_height, box.z1, box.width - x_division, val_height, box.depth);
			child_2 = box3d_create(box.x1, box.y1 - val_height, box.z1, x_division, val_height, box.depth);
			}
		else {
			z_division = box.depth * random(0.3, 0.7);
			child_1 = box3d_create(box.x1, box.y1 - val_height, box.z1 + z_division, box.width, val_height, box.depth - z_division);
			child_2 = box3d_create(box.x1, box.y1 - val_height, box.z1, box.width, val_height, z_division);
		}
		box3d_draw(child_1, random_color(palette));
		box3d_draw(child_2, random_color(palette));
		box3d_divide(child_1, division_probability, ! last_division_was_horizontal, level + 1, level_max, palette);
		box3d_divide(child_2, division_probability, ! last_division_was_horizontal, level + 1, level_max, palette);
	}
	
}


////////////////////////////////////////////////////////////////
// palette
////////////////////////////////////////////////////////////////

// return a random color from a palette

function random_color(palette) {
	return "#"+random(palette);
}

// return a palette

function random_palette() {
	palettes_set = [
					["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"], 
					["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"], 
					["b7094c","a01a58","892b64","723c70","5c4d7d","455e89","2e6f95","1780a1","0091ad"], 
					["264653","2a9d8f","e9c46a","f4a261","e76f51"], 
					["fec5bb","fcd5ce","fae1dd","f8edeb","e8e8e4","d8e2dc","ece4db","ffe5d9","ffd7ba","fec89a"], 
					["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"],
					];
	// Returns a random integer from 0 to length - 1:
	let pal = Math.floor(Math.random() * palettes_set.length);
	return palettes_set[pal];
}

////////////////////////////////////////////////////////////////
// ui
////////////////////////////////////////////////////////////////

//function keyPressed() {
//	if (key == 's' || key == 'S') {
//		saveCanvas(the_canvas, 'flowfiled', 'png');
//	}
//}
