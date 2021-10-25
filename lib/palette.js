
// https://coolors.co/palettes/trending



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

// --> error control

function fixed_color(i, palette) {
	return "#"+ palette[i];
}