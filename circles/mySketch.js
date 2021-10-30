let canvasSize = 800;

let size_min = 50;
let size_max = 300;

let max_depth = 100;
let points_number = 100;
let discs = [];
let palette = [];

function setup() {
	
	// mobile
	//createMetaTag();
	//createCanvas(window.innerWidth, window.innerHeight);
	
	createCanvas(canvasSize, canvasSize);
	
	
	palette = random_palette();
	background(random_color(palette));
	discs = get_discs_piramids(points_number, canvasSize, size_min, size_max, max_depth);
}


function draw() {
	//strokeWeight(0);
	//stroke(51);
	
	for (let i = 0; i < discs.length; i++) {
		fill(random_color(palette));
		circle(discs[i].x, discs[i].y, discs[i].size);
		//circle(width/2 + discs[i].x, height/2 + discs[i].y, discs[i].size);
	}
	
	noLoop();
}

////////////////////////////////////////////////////////////////
// get a distribution of type "linear", "normal", "left", "right" of "n" values in range ("min", "max") at "center"
////////////////////////////////////////////////////////////////
function array_distribution(type, n, min, max) {
	let a = [];
	if (type == "right") {
		let temp = min;
		min = max;
		max = temp;
	}
	for (let i = 0; i < n; i++) {
		if (type == "linear") {
			let r = random();
			a[i] = min + (max - min) * r;
		}
		else if (type == "normal") {
				let r = 0;
				let v = 3;
				for(let j = v; j > 0; j --){
						r += random();
				}
				a[i] = min + (max - min) * r / v;
		}
		else if (type == "left" || type == "right") {
				let r = 0;
				let v = 3;
				for(let j = v; j > 0; j --){
						r += random() * (max - min) * 2;
				}
				a[i] = min + (r/v - 0.5) * (max - min) * 2;
		}
		else {
			a[i] = 0;
		}
	}
	return a;
}

// return an array of circles at a different depth. larger discs at a lower depth
function get_discs_piramids(n, room_size, min, max, max_depth) {
	let a_discs = get_dots(n, room_size);
	let size_distribution = array_distribution("normal", min, max, n);
	size_distribution.sort().reverse();  // sort descending
	for (let i = 0; i < a_discs.length; i ++) {
		a_discs[i].size = size_distribution[i];
		a_discs[i].depth = i;
	}
	return a_discs;
}

////////////////////////////////////////////////////////////////
// return an array of dots
// pex. circle(a_dots[2].x, a_dots[2].y);
////////////////////////////////////////////////////////////////
function get_dots(n, room_size) {
	
	let a_dots = [];
	for (let i = 0; i < n; i++) {
		a_dots.push({x: random(room_size) , y: random(room_size)});
	}
	return a_dots;
}

////////////////////////////////////////////////////////////////
// return a random color from a palette
////////////////////////////////////////////////////////////////
function random_color(palette) {
	//colors = ["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"];
	//colors = ["#001219","#005f73","#0a9396","#94d2bd","#e9d8a6","#ee9b00","#ca6702","#bb3e03","#ae2012","#9b2226"];
	return "#"+random(palette);
}

////////////////////////////////////////////////////////////////
function random_palette() {
	palettes_set = [
					["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"],
					["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"],
					["b7094c","a01a58","892b64","723c70","5c4d7d","455e89","2e6f95","1780a1","0091ad"]
					];
	// Returns a random integer from 0 to length - 1:
	let pal = Math.floor(Math.random() * palettes_set.length);
	return palettes_set[pal];
}


////////////////////////////////////////////////////////////////
// for mobile display
// see: https://openprocessing.org/sketch/790331 
////////////////////////////////////////////////////////////////

function createMetaTag() {
	let meta = createElement('meta');
	meta.attribute('name', 'viewport');
	meta.attribute('content', 'user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height');

	let head = select('head');
	meta.parent(head);
}