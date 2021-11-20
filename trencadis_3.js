'use strict';

// https://github.com/Dozed12/p5.voronoi/

let diagram;
let diagram_cells;
//let sites_number = 144;
let w = 700;
let h = 700;
let background_color;
let palette_1 = ["ee4266","ffd23f","3bceac","2579f5"];
let palette;

function setup() {

	// sites_number = random(20, 150);

	sliders_activate();
	sliders_add(3, 300, 50, 1, "sites_number");  //250
	sliders_add(0, 1, 0, 1, "sites_mode");
	sliders_add(1, 200, 25, 1, "sites_distance");
	sliders_add(0, 1, 1, 1, "jitter");		// generates voroi with jitter
	sliders_add(0, 1, 0, 1, "refresh_diagram");
	sliders_add(0, 1, 0, 1, "draw_original_colors");
	sliders_add(0, 1, 1, 1, "draw_edges");
	sliders_add(0, 20, 5, 1, "edges_stroke_weight");
	sliders_add(0, 1, 0, 1, "draw_center_lines");
	sliders_add(0, 4, 1, 1, "mode_fill_cells");
	sliders_add(1, 50, 2, 1, "perlin_grain");
	sliders_add(0, 1, 0, 1, "color_mode");
	sliders_add(0, 1, 0, 1, "color_grade");
	createCanvas(w, h);
	noSmooth();



}


function draw() {

	let slid = sliders_changed();

	if (slid != null) {

		background_color = color('#0c6ca8');
		background(200);
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
				voronoi_add_sites(sites_mode, w, h, sites_number, sites_distance);
				//Compute voronoi diagram with size 700 by 500
				//With a prepared jitter structure (true)
				voronoi(w, h, true);

				//voronoiSiteStroke(background_color);	// don't show site center
				voronoiSiteStroke('yellow');	// site center color
				diagram = voronoiGetDiagram();
				diagram_cells = voronoiGetCells();
				//diagram_log_console(diagram);
				//cells_log_console(diagram_cells);
			case "draw_edges":
			case "draw_center_lines":
			case "draw_original_colors":
			case "edges_stroke_weight":
			case "mode_fill_cells":
			case "jitter":
			default:
				switch (color_mode) {
					case 0:
						palette = palette_1;
						break;
					case 1:  // blue
						palette = ["047bdb"];
						break;
				}
				voronoiDraw(0, 0, draw_original_colors==1 , jitter==1);  // parametres: Filled, jitter
				if (draw_original_colors == 0) {
					//draw_fill_cells(diagram); 
					draw_fill_cells(diagram, diagram_cells, mode_fill_cells);
				}
				if (draw_edges == 1) {
					draw_diagram_edges(diagram);
				}
				if (draw_center_lines== 1) {
					draw_line_site_vertex(diagram);
					draw_site_centers(diagram);
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
	strokeWeight(edges_stroke_weight);
	stroke(230);
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
function draw_fill_cells(diagram, cells, mode=0) {

	switch(mode){
		case 0:
			// per cada cel.la
			for (let i = 0; i < cells.length; i++) {
				if (diagram.cells[i] != null) {
					//fill(random(43, 208), 178, 227);
					fill(fixed_color(i, palette));
					beginShape();
					for (let j = 0; j < cells[i].length; j++) {
						vertex(cells[i][j][0] , cells[i][j][1]);
					}
					endShape(CLOSE);
				}
			}
			break;
		case 1:
			for (let i = 0; i < cells.length; i++) {
				if (diagram.cells[i] != null) {
					let c = fixed_color(i, palette);
					if (color_grade == 0) {
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
		case 2:
			console.log("draw_fill_cells mode 2 - perlin rapid");
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
			case 3:
				console.log("draw_fill_cells mode 3 - perlin velocitat mitja");
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
			case 4:
				console.log("draw_fill_cells mode 4 - perlin velocitat molt lenta");
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
							perlin_triangle_3(A[0], A[1], B[0], B[1], C[0], C[1], c, 0.05, perlin_grain, 30);
							//endShape(CLOSE);
						}
					}
				}
				break;
				default:
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