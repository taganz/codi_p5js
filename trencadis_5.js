'use strict';

// https://github.com/Dozed12/p5.voronoi/

let diagram;
//let diagram_cells;
//let sites_number = 144;
let w = 700;
let h = 700;
let background_color;
let palette_1 = ["ee4266","ffd23f","3bceac","2579f5"];
let palette_2 = ["0466c8","0353a4","023e7d","002855","001845","001233","33415c","5c677d","7d8597","979dac"];
let palette;

let color_separation = 250;

function setup() {


	sliders_activate();
	sliders_add(0, 1, 0, 1, 	"refresh_diagram");
	sliders_add(3, 500, 186, 1,	"sites_number");  //250
	sliders_add(0, 1, 0, 1,		"sites_mode", true, "0: random, 1: focus?");
	sliders_add(0, 6, 6, 1, 	"draw_mode", true, "0: std, 1,2,3: grad, 4: ..., 5: std jitter, 6:broken");  

	sliders_add(1, 200, 25, 1, 	"sites_distance", false); // TREURE

	//sliders_add(0, 1, 0, 1, 	"draw_original_colors");
	sliders_add(0, 1, 1, 1, 	"add_edges", true, "1: draw additional edges over diagram");
	sliders_add(0, 20, 4, 1, 	"add_edges_stroke_weight");
	sliders_add(0, 1, 0, 1, 	"add_lines_to_site");
	sliders_add(0, 1, 0, 1, 	"add_sites");
	sliders_add(0, 1, 1, 1, 	"draw_jitter");		// draws voroi with jitter
	sliders_add(1, 50, 2, 1, 	"draw_perlin_grain");
	sliders_add(0, 2, 2, 1, 	"draw_palette_mode");
	sliders_add(0, 1, 0, 1, 	"draw_color_grade_on");
	sliders_add(0, 30, 15, 1, 	"jitter_step_max");
	sliders_add(0, 30, 5, 1, 	"jitter_step_min");
	sliders_add(0, 10, 2, 1, 	"jitter_factor");
	createCanvas(w, h);
	noSmooth();



}


function draw() {

	let slid = sliders_changed();

	if (slid != null) {

		background_color = color('#0c6ca8');
		background(color_separation);
		clear();
		fill(background_color);
		quad(0, 0,  0, h, w, h, w, 0);
		strokeWeight(1);
				
		switch (slid) {
			
			case "_first_":
			case "sites_number":
			case "sites_distance":
			case "refresh_diagram":
			case "sites_mode":
			case "jitter_step_max":
			case "jitter_step_min":
			case "jitter_factor":


				// configure jitter

				voronoiJitterStepMax(jitter_step_max); //Maximum distance between jitters
				voronoiJitterStepMin(jitter_step_min); //Minimum distance between jitters
				voronoiJitterFactor(jitter_factor); //Scales each jitter
				voronoiJitterBorder(true); //Jitter edges of diagram


				// add sites 

				voronoi_add_sites(sites_mode, w, h, sites_number, sites_distance);

				// compute voronoi diagram and get handler

				voronoi(w, h, true);
				diagram = voronoiGetDiagram();
			

				// debug logs

				//console.log(diagram);
				//diagram_log_console(diagram);
				//cells_log_console(diagram_cells);
				//console.log(voronoiGetCellsJitter());


			// options that doesn't requiere graf regeneration

			case "add_edges":
			case "add_lines_to_site":
			//case "draw_original_colors":
			case "add_edges_stroke_weight":
			case "draw_mode":
			case "draw_jitter":
			case "add_sites":
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

				voronoiSiteFlag(add_sites); // - dibuixar els centres


				// draw diagram

				draw_diagram(diagram, draw_mode, palette, draw_color_grade_on);


				if (add_edges == 1) {
					draw_diagram_edges(diagram);
				}
				if (add_lines_to_site== 1) {
					draw_line_site_vertex(diagram);
				//	draw_site_centers(diagram);
				}
		}
	}
}


function voronoi_add_sites(mode, w, h, number, minimum_distance){
	switch(mode) {
		default:
			console.log("*** voronoi_add_sites ERROR drawing default");
		case 0:
			console.log("*** voronoi_add_sites mode: random");
			//Sets  random sites with  minimum distance to be added upon computing
			//Please note that this method is just for testing, you should use your own
			//method for placing random sites with minimum distance
			voronoiClearSites();
			voronoiRndSites(sites_number, minimum_distance);
			break;
		case 1:
			console.log("*** voronoi_add_sites mode: focused");
			let sites = new Array(number);
			let center_margin = random(0.1, 0.2);
			let center = [random(w*center_margin, w*(1-center_margin)), random(h*center_margin, h*(1-center_margin))];
			let radius = random(w*0.3, w*0.8);
			for (let i = 0; i < number; i++) {
				let x = center[0] + radius * random();
				let y = center[1] + radius * random();
				sites[i] = [x, y, "#aae4f2"];
			}
			voronoiClearSites();
			voronoiSites(sites);
			break;
		case 2:
			break;

	}
}
function draw_diagram_edges(diagram) {
	strokeWeight(add_edges_stroke_weight);
	stroke(color_separation);
	for (let i = 0; i < diagram.edges.length; i++) {
		line(diagram.edges[i].va.x, diagram.edges[i].va.y, diagram.edges[i].vb.x, diagram.edges[i].vb.y);
	}
}

function cells_log_console(cells) {
	console.log("cells_log_console--------------------");
	for (let i = 0; i < cells.length; i++) {
		console.log(cells[i]);
	}
}

function diagram_log_console(diagram) {
	console.log("diagram_log_console--------------------");
	for (let i = 0; i < diagram.cells.length; i++) {
		console.log(diagram.cells[i]);
	}
}

/*
// dibuixa un cercle a cada site
function draw_site_centers(diagram) {

	strokeWeight(1);
	fill ('red');
	noFill();
	for (let i = 0; i < diagram.cells.length; i++) {
		let x = diagram.cells[i].site.x;
		let y = diagram.cells[i].site.y;
		circle (x,y, 15);
	}
}
*/


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
function draw_diagram(diagram, mode=0, palette, color_grade_on) {

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
		case 5:	 //  std jitter
			console.log("draw_diagram mode 5 - std jitter");
			//noStroke();
			for (let i = 0; i < cells.length; i++) {
				if (diagram.cells[i] != null) {
					// per cada vertex pinta el triangle dels dos seguents
					let c = fixed_color(i, palette);
					//strokeWeight(5);
					//stroke('white');

					voronoiSiteStrokeWeight(10);
					voronoiSiteStroke(color_separation);

					voronoiCellStrokeWeight(10);
					voronoiCellStroke(color_separation);
					let cell = diagram.cells[i];
					let s = cell.site;
					let offset = 0;
					voronoiDrawCell(s.x , s.y , i, VOR_CELLDRAW_SITE, false, true);
					//voronoiDrawCell(s.x + (s.x-w/2) * offset , s.y + (s.y-h/2)*offset, i, VOR_CELLDRAW_BOUNDED, true, true);
						//drawCellSite((cell.site.x-w) * 1.05 , (cell.site.y-h)*1.05, i, cell.site.x, cell.site.y, false, true);
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
		default:
			console.log("*** ERROR *** draw_diagram mode unknown "+mode);
		}
	//print(diagram.cells[i]);
	//print(vv);
}



// https://stackoverflow.com/questions/4912788/truncate-not-round-off-decimal-numbers-in-javascript/4912870
function truncateDecimals (number, digits) {
    let multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};