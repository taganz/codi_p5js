//var radius = 10; //instead of defining a variable, use below

function setup() {
	createCanvas(400, 400);
	background(100);
  sliders_mode_openprocessing(false); // runs on openprocessing, uses OPC
  sliders_add(0, 100, 50, 1, "radius");  // 0 	
  sliders_format(450);
}

function draw() {
	ellipse(mouseX, mouseY, radius, radius);
}