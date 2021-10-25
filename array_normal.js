// --->
// FUNCIO PER TORNAR ARRAY AMB DISTRIBUCIO NORMAL
// CAL CANVIAR NOM I DONAR FORMAT DE LLIBRERIA. TREURE SETUP I DRAW A HTML TEST


let canvasSize = 800;

let size_min = 0;
let size_max = 0;

let max_depth = 100;
let points_number = 0;
let discs = [];
let palette = [];
let size_distribution_model = "";

function setup() {
	
	// mobile
	//createMetaTag();
	//createCanvas(window.innerWidth, window.innerHeight);
	
	createCanvas(canvasSize, canvasSize);
	background('white');
	
	

	print("*********************************************");
	print("test array_normal");
	print("*********************************************");
	


	let n = 100;
	_test_array_normal ("myDiv1", 100, 5, 1, 0, 10);  
	_test_array_normal ("myDiv2", 500, 5, 1, 0, 10); 
	_test_array_normal ("myDiv3", n, 5, 2, 4, 8); 
	_test_array_normal ("myDiv4", n, 5, 5, 0, 10); 
	_test_array_normal ("myDiv5", n, 5, 50, 0, 10);  // stddev gran es com uniforme
	_test_array_normal ("myDiv6", n, 10, 3, 0, 10);	 // max = mean es distribucio dreta
	_test_array_normal ("myDiv7", n, 0, 0.1, 0, 10);  // min = mean es distribucio esquerra
	
}


function draw() {

	noLoop();
}

function _test_array_normal(_div, n, mean, stddev, min=null, max=null) {

	let size_distribution = array_normal (n, mean, stddev, min, max);
	var trace = {
		x: size_distribution,
		type: 'histogram',
	  };
	var layout = {
		title: "array_normal " +"n: "+ n.toString() + " mean: " + mean.toString() + " stddev: " + stddev.toString() + " min: " + min.toString() + " max: " + max.toString(),
	}
	var data = [trace];
	Plotly.newPlot(_div, data, layout);
	
	// console
	print(layout.title);
	print (size_distribution);
	
}


////////////////////////////////////////////////////////////////
// array_normal
// return normal distribution
//	n: number of samples
//	mean
//  stddev
//  min, optional, return 0 beyond the limit  
//  max, optional, return 0 beyond the limit
// 
// based on https://spin.atomicobject.com/2019/09/30/skew-normal-prng-javascript/
////////////////////////////////////////////////////////////////

const _randomNormals = (rng) => {
    let u1 = 0, u2 = 0;
    //Convert [0,1) to (0,1)
    while (u1 === 0) u1 = rng();
    while (u2 === 0) u2 = rng();
    const R = Math.sqrt(-2.0 * Math.log(u1));
    const Θ = 2.0 * Math.PI * u2;
    return [R * Math.cos(Θ), R * Math.sin(Θ)];
};

//const _randomSkewNormal = (rng, ξ, ω, α = 0) => {
const _randomSkewNormal = (rng, e, w, a = 0) => {
    const [u0, v] = _randomNormals(rng);
    if (a === 0) {
        return e + w * u0;
    }
    const d = a / Math.sqrt(1 + a * a);
    const u1 = d * u0 + Math.sqrt(1 - d * d) * v;
    const z = u0 >= 0 ? u1 : -u1;
    return e + w * z;
};

function array_normal(n, mean, stddev, min=null, max=null) {
	let a = [];
	if (min != null && max != null) {
		if (min >= max) { 
			print ("*** array_normal min > max");
			return a;
		} 
	}
	if (min != null) {
		if (mean + stddev < min) { 
			print ("*** array_normal mean + stddev < min");
			return a;
		} 
	}
	if (max != null) {
		if (mean - stddev > max) { 
			print ("*** array_normal mean - stddev < max");
			return a;
		} 
	}
	for (let i = 0; i < n; i++ ) {	
		do {
			a[i] = _randomSkewNormal (Math.random, mean, stddev);
		}
		while( (min != null && a[i] < min) || (max != null && a[i] > max)) ;
	}
	return a;
}





/*

versio antiga 

	size_distribution = array_distribution("linear", n, 1, 10);
	size_distribution = array_distribution("normal", n, 1, 10);
	size_distribution = array_distribution("left", n, 1, 10);
	size_distribution = array_distribution("right", n, 1, 10);
	
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
						r += random();
				}
                let r2 = abs (r/v - 0.5)*2 // map 0.5 to 0 and 0 & 1 to 1
				a[i] = min + (max - min) * r2;
		}
		else {
			a[i] = 0;
		}
	}
	return a;
}
*/