'use strict';

// https://github.com/Dozed12/p5.voronoi/

let diagram;
//let diagram_cells;
//let sites_number = 144;
let w = 1700;
let h = 1700;
let voronoi_w, voronoi_h;
let background_color;
let palette_1 = ["ee4266","ffd23f","3bceac","2579f5"];
let palette_2 = ["0466c8","0353a4","023e7d","002855","001845","001233","33415c","5c677d","7d8597","979dac"];
let palette;

let color_separation = 250;
let img;
let dots;
let moving_cell;
let moving_dot;
let image_loaded = false;
let input;

let path = 'https://www.rdalmau.com/codi_p5js/assets/image/';
//let path = 'D:\\OneDrive\\_tec_dev\\p5js\\assets\\image\\';
let loaded_image_path;

// load img
function preload() {
	
	
    let img_file = new Array();
	//let path = 'assets/image/';
	img_file=['victor roc avi 2.png',
    			'Adhesiu_PARK_GUELL.jpg',
    			'laura_i_victor.png',
				 "rolling_stores.png",
				 "apple.png",
				 "monalisa.jpg",
				 "monalisa_square.jpg",
				 "silueta1.jpg"
				];
    let i = img_file.length -2;
	img = loadImage(path + img_file[i]);
	console.log("PRIMERA IMATGES CARREGADA img: ", img);
	
	sliders_preload();
   

}

function setup() {



    sliders_activate();
    sliders_add(1, 30, 2, 1,  "dot_size", false);  
    sliders_add(1, 100, 15, 1, "sample_rate"); 
    sliders_add(0.25, 3, 0.75, 0.25, "image_zoom"); 
	sliders_add(0.001, 0.1, 0.025, 0.001, "sample_distortion"); 
	sliders_add(0, 3, 0, 0.1, "break_factor"); 
	sliders_add(0, 3000, 0, 100, "refresh_time"); 

	sliders_add(0, 1, 0, 1, 	"refresh_diagram", false, "HO TRENCA!");
	sliders_add(0, 3, 3, 1,		"sites_mode", false, "0: random, 1: focus?, 2:move, 3: image");
	sliders_add(7, 8, 8, 1, 	"draw_mode", true, "0: std, 1,2,3: grad, 4: ..., 5: std jitter, 6:broken, 7: diagram color, 8:image broken");  

	
	sliders_add(0, 1, 1, 1, 	"add_edges", true, "1: draw additional edges over diagram");
	sliders_add(0, 20, 0, 1, 	"add_edges_stroke_weight", true);
	//sliders_add(0, 1, 0, 1, 	"add_sites", false);
	sliders_add(1, 50, 2, 1, 	"draw_perlin_grain", false);
	sliders_add(0, 2, 0, 1, 	"draw_palette_mode", false, "0.color?, 1: blue, 2:graded");
	sliders_add(0, 1, 0, 1, 	"draw_color_grade_on", false);

	// debug
	sliders_add(0, 1, 0, 1, 	"add_lines_to_site", true);
	

	
		
	voronoi_w = img.width / image_zoom;
	voronoi_h = img.height / image_zoom;
	createCanvas(min(w, voronoi_w), min(voronoi_h, h));
	noSmooth();

	input = createFileInput(handleFile);
	input.html("file in rdalmau");
	input.position(0, 0);

}



let step = 0;

function draw() {

	// detect sliders changes

	let slid = sliders_changed();

	if (slid != null || image_loaded ) {
		
		if (image_loaded) {
			slid = "_first_";
			image_loaded = false; // reset
		}


		switch (slid) {
			
			case "_first_":
			case "dot_size":
			case "sample_rate":
			case "image_zoom":
			case "sample_distortion":

				//
				// sample image and get dots array
				//
				console.log("Imge size: " + img.width + ' • ' + img.height +".  Sampling... ");
				dots = image_dots_sample(img, sample_rate, img.width/ image_zoom, img.height / image_zoom, sample_distortion);
				console.log("Sampled.  "+ dots.length + " dots");
				
	
			case "refresh_diagram":
			case "sites_mode":


				// 
				// generate voronoi diagram
				//

				
				console.log("generating voroni: ", voronoi_w, voronoi_h, "...");
				voronoiClearSites();
				voronoiSites(dots);
				voronoi(voronoi_w, voronoi_h, false); // no jitter
				console.log("voroni generated.");
				diagram = voronoiGetDiagram();
				//console.log("diagram: ", diagram);
			
				// reset step counter
				step = 0;

				


			// options that doesn't requiere graf regeneration

			case "add_edges":
			//case "add_lines_to_site":
			//case "add_edges_stroke_weight":
			case "draw_mode":
			case "draw_palette_mode":
			case "draw_color_grade_on":
			default:

				switch (draw_palette_mode) {
					case 0:
						palette = palette_1;
						break;
					case 1:  // blue
						palette = ["047bdb"];
						break;
					case 2:  // blue
						palette = palette_2;
						break;
				}

				

		}


	}

	
	// move some dots

	image_dots_move(dots, 1, step);


	// regenerate voronoi diagram

	voronoiClearSites();
	voronoiSites(dots);
	voronoi(voronoi_w, voronoi_h, false); // no jitter
	//console.log("voroni regenerated step ", step);
	diagram = voronoiGetDiagram();


	// draw diagram

	background_color = color('#0c6ca8');
	background(color_separation);
	clear();
	fill(color_separation);
	quad(0, 0,  0, voronoi_h, voronoi_w, voronoi_h, voronoi_w, 0);
	strokeWeight(1);

	draw_diagram(diagram, draw_mode, palette, draw_color_grade_on, break_factor);
	stroke('red');
	strokeWeight(5);
	noFill();

	

	// debug draw tools

	if (add_edges == 1) {
		draw_diagram_edges(diagram);
	}
	if (add_lines_to_site== 1) {
		draw_line_site_vertex(diagram);
	}				

	sleep(refresh_time);
	step ++;
		
}

function loadImage_success() {
	console.log("loadImage_success: ", loaded_image_path, img.width, img.height);
	image_loaded = true;
	//loaded_image_path = null;	// reset
}
function loadImage_failure() {
	console.log("*** loadImage_failure ***");
}

function handleFile(file) {
	console.log("HANDLEFILE file.name:", file.name)
	if (file.type === 'image') {
		loaded_image_path = path+file.name; 
		console.log("loaded_image_path: ", loaded_image_path);
		img = loadImage(loaded_image_path, loadImage_success, loadImage_failure  );   // async
	} else {
	  img = null;
	  console.log("*** Image algo raro ha passat ***");
	}
  }
  


// <---- 
function sites_move(dots) {

		// recupera sites antics
		let old_sites = new Array();
		let cells  = diagram.cells;
		print("cells", cells);
		for (let i = 0; i < cells.length; i++){
			old_sites.push([cells[i].site.x, cells[i].site.y]);
			print("old sites for i=" + i +": " + old_sites[i]);
			print("cells[i].site.x ="+ cells[i].site.x);
			print("cells[i].site.y ="+ cells[i].site.y);
			
			if (i == 2) {
				old_sites[i][0] += 5;
				old_sites[i][1] += 5;
			}
		}
}

function draw_diagram_edges(diagram) {
	strokeWeight(add_edges_stroke_weight);
	stroke(color_separation);
	for (let i = 0; i < diagram.edges.length; i++) {
		line(diagram.edges[i].va.x, diagram.edges[i].va.y, diagram.edges[i].vb.x, diagram.edges[i].vb.y);
	}
}


// dibuixa una linia des de cada vertex al centre
function draw_line_site_vertex(diagram) {

	stroke('white');
	strokeWeight(1);

	// per cada cel.la

	for (let i = 0; i < diagram.cells.length; i++) {


		if (diagram.cells[i] != null) {

			// punt del site

			let site_x = diagram.cells[i].site.x;
			let site_y = diagram.cells[i].site.y;
	
			// per cada halfedge agafem el primer punt
	
			for (let j = 0; j < diagram.cells[i].halfedges.length; j++) {
				let he = diagram.cells[i].halfedges[j];
				if (he != null) {
					let A = he.edge.va;
					line(site_x, site_y, A.x, A.y);
					let B = he.edge.vb;
					line(site_x, site_y, B.x, B.y);
				}
			}
			// tanquem
			//let B = diagram.cells[i].halfedges[diagram.cells[i].halfedges.length-1].edge.vb;
			//line(site_x, site_y, B.x, B.y);
		}
		else {
			console.log(" cel.la null "+i);
		}
	}
}



// pinta les cel.les
// - mode 0: solid color from global palette
// - mode 1: variations from global palette
// - mode 2: perlin
function draw_diagram(diagram, mode=0, palette, color_grade_on, break_factor = 0.3) {

	let cells = voronoiGetCells();;
	switch(mode){
		case 0:    // solid color - standard
			console.log("draw_diagram mode 0 - standard");
			voronoiSiteStroke('yellow');	// site center color
			voronoiDraw(0, 0, false , draw_jitter==1);  
			break;
		case 1:   // solid color - with grade 
			console.log("draw_diagram mode 1 - solid color");
			for (let i = 0; i < cells.length; i++) {
				if (cells[i] != null) {
					let c = fixed_color(i, palette);
					if (color_grade_on == 0) {
						fill(red(c), green(c), blue(c));
					}
					else {
						fill(random(43, 208), green(c), blue(c));
					}
					beginShape();
					for (let j = 0; j < cells[i].length; j++) {
						vertex(cells[i][j][0] , cells[i][j][1]);
					}
					endShape(CLOSE);
				}
			}
			break;
		case 2:   // perlin rapid
			console.log("draw_diagram mode 2 - perlin rapid");
			for (let i = 0; i < cells.length; i++) {
				if (diagram.cells[i] != null) {
					// per cada vertex pinta el triangle dels dos seguents
					let c = fixed_color(i, palette);
					stroke(0);
					for (let j = 0; j < cells[i].length-2; j++) {
						//fill(random(43, 208), green(c), blue(c));
						//beginShape();
						let A = [cells[i][0][0] , cells[i][0][1]];
						let B = [cells[i][j+1][0] , cells[i][j+1][1]];
						let C = [cells[i][j+2][0] , cells[i][j+2][1]];
						perlin_triangle_2(A[0], A[1], B[0], B[1], C[0], C[1], c); //, 0.05, 1, 30);
						//endShape(CLOSE);
					}
				}
			}
			break;
		case 3:   // perlin mig
			console.log("draw_diagram mode 3 - perlin velocitat mitja");
			for (let i = 0; i < cells.length; i++) {
				if (diagram.cells[i] != null) {
					// per cada vertex pinta el triangle dels dos seguents
					let c = fixed_color(i, palette);
					//stroke(0);
					for (let j = 0; j < cells[i].length-2; j++) {
						//fill(random(43, 208), green(c), blue(c));
						//beginShape();
						let A = [cells[i][0][0] , cells[i][0][1]];
						let B = [cells[i][j+1][0] , cells[i][j+1][1]];
						let C = [cells[i][j+2][0] , cells[i][j+2][1]];
						perlin_triangle(A[0], A[1], B[0], B[1], C[0], C[1], c); //, 0.05, 1, 30);
						//endShape(CLOSE);
					}
				}
			}
			break;
		case 4:   // perlin lent
			console.log("draw_diagram mode 4 - perlin velocitat molt lenta");
			noStroke();
			for (let i = 0; i < cells.length; i++) {
				if (diagram.cells[i] != null) {
					// per cada vertex pinta el triangle dels dos seguents
					let c = fixed_color(i, palette);
					for (let j = 0; j < cells[i].length-2; j++) {
						//fill(random(43, 208), green(c), blue(c));
						//beginShape();
						let A = [cells[i][0][0] , cells[i][0][1]];
						let B = [cells[i][j+1][0] , cells[i][j+1][1]];
						let C = [cells[i][j+2][0] , cells[i][j+2][1]];
						perlin_triangle_3(A[0], A[1], B[0], B[1], C[0], C[1], c, 0.05, draw_perlin_grain, 30);
						//endShape(CLOSE);
					}
				}
			}
			break;
		case 6:   // broken
			console.log("draw_diagram mode 6 - broken");
			//noStroke();
			// per cada cel.la
			clear();
			noStroke();
			fill(color_separation);
			quad(0, 0,  0, h, w, h, w, 0);
			//voronoiCellStroke(255);
			//voronoiCellStrokeWeight(10);

			for (let i = 0; i < cells.length; i++) {
				if (cells[i] != null) {
					// per cada vertex pinta el triangle dels dos seguents
					let c = fixed_color(i, palette);
					if (color_grade_on) {
						fill(random(43, 208), green(c), blue(c));
					}
					else {
						fill(red(c), green(c), blue(c));
					}
					beginShape();
					//let vertex_to_change = floor(random(0, cells[i].length-1));
					for (let j = 0; j < cells[i].length; j++) {
						let A = {x: cells[i][j][0] , y: cells[i][j][1]};
						if (j < cells[i].length-1) {
							let shift_ratio = random(0, 0.3);
							let B = {x: cells[i][j+1][0] , y: cells[i][j+1][1]};
							A.x += (B.x - A.x) * shift_ratio;
							A.y += (B.y - A.y) * shift_ratio;
						}
						vertex(A.x, A.y);
					}
					endShape(CLOSE);
				}
			}
			break;
		case 7:   console.log("draw_diagram mode 7 - standard diagram color");
			voronoiSiteStroke('yellow');	// site center color
			voronoiDraw(0, 0, true , draw_jitter==1);  
			break;
			
		case 8:   //console.log("draw_diagram mode 8 - image broken");
			noStroke();

			for (let i = 0; i < cells.length; i++) {
				let c = voronoiGetColor(i);
				fill(red(c), green(c), blue(c));
				if (cells[i] != null) {
					// per cada vertex pinta el triangle dels dos seguents
					beginShape();
					//let vertex_to_change = floor(random(0, cells[i].length-1));
					for (let j = 0; j < cells[i].length; j++) {
							let A = {x: cells[i][j][0] , y: cells[i][j][1]};
						if (j < cells[i].length-1) {
							let shift_ratio = random(0, break_factor);
							let B = {x: cells[i][j+1][0] , y: cells[i][j+1][1]};
							A.x += (B.x - A.x) * shift_ratio;
							A.y += (B.y - A.y) * shift_ratio;
						}
						vertex(A.x, A.y);
					}
					endShape(CLOSE);
				}
			}
			break;


		
		default:
			console.log("*** ERROR *** draw_diagram mode unknown "+mode);
		}

}







/*
--------------------------------------
	image_dots

		array [x, y, color]
			x,y en espai target_w x target_h

--------------------------------------
*/

// move dots
function image_dots_move(dots, mode, step) {

	switch (mode) {
		case 0:  // move 30
			moving_dot = dots[30];
			moving_dot[0] += random(-3, 3);
			moving_dot[1] += random(-3, 3);
			break;
		case 1:  // move random
			if (step > 50) {
				let v_x = 10;
				let v_y = 35 * step/100;
				for (let i = 1; i < 10; i++ ) {
					moving_dot = dots[Math.floor(random(0, dots.length))];
					moving_dot[0] += random(-v_x, v_x);
					moving_dot[1] += random(-10, v_y);
				}
			}
			break;
		default:
	}
}
	

// returns an array of dots {x, y, color}
// 
function image_dots_sample(image, sample_rate, target_w, target_h, distortion=0.02){

	let desviacio = target_w * distortion;

    let dots = new Array();

    for (let x = 0; x < image.width; x+=sample_rate){
        for (let y = 0; y < image.height; y+=sample_rate){
			let sample_x = x + random(-desviacio, desviacio);
			let sample_y = y + random(-desviacio, desviacio);
			let c = color(image.get(sample_x, sample_y));   
			//dots.push({x: dot_x, y: dot_y, color:c })
			let dot_x = round(map(sample_x, 0, img.width, 0, target_w));
			let dot_y = round(map(sample_y, 0, img.height, 0, target_h));
			dots.push([dot_x, dot_y, c]);
			//print([dot_x, dot_y, c]);
	}
    }
    return dots;
}

function image_dots_draw(dots, dot_size = 1) {
    strokeWeight(dot_size);
    for (let i = 0; i < dots.length; i++){
        let A = dots[i];
        stroke(A[2]);
        point (A[0], A[1]);
    }

}


/*
--------------------------------------
	util		
--------------------------------------
*/

// util
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }
  
// https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript/4912870
function truncateDecimals (number, digits) {
    let multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};


