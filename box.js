// https://openprocessing.org/sketch/create


/////////////////////////////////////////////////////////
// box functions
/////////////////////////////////////////////////////////

// create a box

function box_create(x_1, y_1, x_2, y_2) {
	return {x1: x_1, y1: y_1, x2: x_2, y2: y_2};
}

// draw a box

function box_draw(box, color='white') {
	fill(color);
	quad(box.x1, box.y1, box.x2, box.y1, box.x2, box.y2, box.x1, box.y2);
}

// return a box at a position + (x_move, y_move)

function box_move(box, x_move, y_move) {
	return {x1: box.x1 + x_move, y1: box.y1 + y_move, x2: box.x2 + x_move, y2: box.y2 + y_move};
}

// divide a box recursively down to a depth

function box_divide(box, division_probability, last_division_was_horizontal, level, level_max, palette) {
	if (level >= level_max) {
		return;
	}
	let child_1;
	let child_2;
	if (random() < division_probability) {
		if (last_division_was_horizontal) {
			x_division = (box.x2 - box.x1) * random(0.3, 0.7);
			child_1 = box_create(box.x1 + x_division, box.y1, box.x2, box.y2);
			child_2 = box_create(box.x1, box.y1, box.x1 + x_division, box.y2);
		}
		else {
			y_division = (box.y2 - box.y1) * random(0.3, 0.7);
			child_1 = box_create(box.x1, box.y1 + y_division, box.x2, box.y2);
			child_2 = box_create(box.x1, box.y1, box.x2, box.y1 + y_division);			
		}
		box_draw(child_1, random_color(palette));
		box_draw(child_2, random_color(palette));
		box_divide(child_1, division_probability, ! last_division_was_horizontal, level + 1, level_max, palette);
		box_divide(child_2, division_probability, ! last_division_was_horizontal, level + 1, level_max, palette);
	}
	
}
