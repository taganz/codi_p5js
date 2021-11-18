'use strict'

// https://github.com/Dozed12/p5.voronoi/

let diagram;
let sites_number;
let w = 700;
let h = 700;

function setup() {

	sites_number = random(20, 150);
  createCanvas(w, h);
	noSmooth();

	//Sets 30 random sites with 50 minimum distance to be added upon computing
	//Please note that this method is just for testing, you should use your own
	//method for placing random sites with minimum distance
	voronoiRndSites(sites_number, 30);

	//Compute voronoi diagram with size 700 by 500
	//With a prepared jitter structure (true)
	voronoi(w, h, true);

	//Get the raw diagram, for more advanced use
	//This is purely to get information, doesn't change the diagram
	//https://github.com/gorhill/Javascript-Voronoi
	diagram = voronoiGetDiagram();


    
    noLoop();
}


function draw() {

	let background_color = color('#0c6ca8');
	background(200);
	fill(background_color);
	quad(0, 0,  0, h, w, h, w, 0);
	voronoiSiteStroke(background_color);	// don't show site center
	// parametres: Filled, jitter
	voronoiDraw(0, 0, false, true);

	strokeWeight(10);
	stroke(255);
	for (let i = 0; i < diagram.edges.length; i++) {
		//console.log(diagram.edges[i]);
		//console.log(diagram.edges[i].va.x);
		//console.log(diagram.edges[i].va.y);
		//point (diagram.edges[i].va.x, diagram.edges[i].va.y);
		line(diagram.edges[i].va.x, diagram.edges[i].va.y, diagram.edges[i].vb.x, diagram.edges[i].vb.y);
	}




	
}
