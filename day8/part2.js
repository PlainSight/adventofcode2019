var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('');

var width = 25;
var height = 6;

var image = [];

for(var i = 0; i < rawInput.length; i++) {
	var imageIndex = (i % (width*height));

	if(!image[imageIndex] || image[imageIndex] == 2) {
		image[imageIndex] = rawInput[i];
	}
}

for(var h = 0; h < height; h++) {
	var row = '';
	for(w = 0; w < width; w++) {
		row += image[(h*25) + w] == 1 ? '#' : ' ';
	}
	console.log(row);
}