"use strict";
// https://coolors.co/palettes/trending



////////////////////////////////////////////////////////////////
// palette
////////////////////////////////////////////////////////////////

// return a random color from a palette

function random_color(palette) {
	//console.log("random_color palette="+palette);
	return "#"+random(palette);
}

function fixed_color(i, palette) {
	return "#"+ palette[i % palette.length];
}

// return a palette

let palette_charcoal_1 = ["264653","2a9d8f","e9c46a","f4a261","e76f51"];
let palette_black_shadows = ["cebebe","ece2d0","d5b9b2","a26769","6d2e46"];
let palette_navy_blue = ["03045e","023e8a","0077b6","0096c7","00b4d8","48cae4","90e0ef","ade8f4","caf0f8"];
let palette_dark_olive_green = ["606c38","283618","fefae0","dda15e","bc6c25"];
let palette_xanadu = ["797d62","9b9b7a","baa587","d9ae94","f1dca7","ffcb69","e8ac65","d08c60","b58463","997b66"];

let palettes_set = [
	["001219","005f73","0a9396","94d2bd","e9d8a6","ee9b00","ca6702","bb3e03","ae2012","9b2226"], // 0
	["d9ed92","b5e48c","99d98c","76c893","52b69a","34a0a4","168aad","1a759f","1e6091","184e77"], 
	["b7094c","a01a58","892b64","723c70","5c4d7d","455e89","2e6f95","1780a1","0091ad"],    
	["264653","2a9d8f","e9c46a","f4a261","e76f51"], 
	//["fec5bb","fcd5ce","fae1dd","f8edeb","e8e8e4","d8e2dc","ece4db","ffe5d9","ffd7ba","fec89a"],  // molt clara, beixos
	["f94144","f3722c","f8961e","f9844a","f9c74f","90be6d","43aa8b","4d908e","577590","277da1"],
	["cc8b86","f9eae1","7d4f50","d1be9c","aa998f"], // marrons
	palette_navy_blue,  // 6
	palette_dark_olive_green,   // 7
	palette_xanadu, // 8
	palette_charcoal_1, //9
	palette_black_shadows //10
	];

function random_palette() {
	// Returns a random integer from 0 to length - 1:
	let pal = Math.floor(Math.random() * palettes_set.length);
	return palettes_set[pal];
}

function fixed_palette(i) {
	return palettes_set[i % palettes_set.length];
}

