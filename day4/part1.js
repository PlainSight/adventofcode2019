var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('-');

var min = parseInt(input[0]);
var max = parseInt(input[1]);

var passwords = 0;

var twoSame = /.*(\d)\1.*/

for (var i = min; i <= max; i++) {
	var asString = '' + i;

	if (twoSame.test(asString)) {
		var ascending = true;

		for(var j = 0; j < 5; j++) {
			if (asString[j] > asString[j+1]) {
				ascending = false;
			}
		}

		if (ascending) {
			passwords++;
		}
	}
}

console.log(passwords);