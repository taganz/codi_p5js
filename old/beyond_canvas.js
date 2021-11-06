function setup() {

  let my_canvas = createCanvas(600, 400);
  my_canvas.parent('canvas_p5js');

  // Here we call methods of each element to set the position 
  // and id, try changing these values.
  // Use the inspector to look at the HTML generated from this 
  // code when you load the sketch in your browser.

  let img = createImg("http://th07.deviantart.net/fs70/PRE/i/2011/260/3/5/dash_hooray_by_rainbowcrab-d49xk0d.png");
//  img.position(190, 50);
  img.size(50, 50);

  let txt = createDiv('This is an HTML string!');
  let txt3 = createDiv('UN ALTRE DIV A LA CUA');
  let txt2 = createDiv("Here is some text and <a href='http://i.imgur.com/WXaUlrK.gif'>this is an HTML link</a>!");


  sliders_initialize();

  sliders_add(1, 10, 5, 1);  // 0 	
  sliders_add(1, 10, 2, 1);  // 1	
  sliders_format(700);
}

function draw() {
  // These commands are applied to the graphics canvas as normal.
 // background(220, 180, 200);
  ellipse(width/2, height/2, 100, 100);
  ellipse(width/4, height/2, 50, 50);
}