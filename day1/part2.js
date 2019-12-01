var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\n');

function fuelRequired(mass) {
	var required = Math.floor(mass / 3) - 2;
	if (required <= 0) {
		return 0;
	} else {
		return required + fuelRequired(required);
	}
}

var totalRequired = 0;

for(var i = 0; i < input.length; i++) {
	var m = input[i];
	totalRequired += fuelRequired(m);
}

console.log(totalRequired);