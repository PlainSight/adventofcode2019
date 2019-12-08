var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('');

var width = 25;
var height = 6;

var fewestZeroDigits = Infinity;
var answer = 0;

var currentZeroes = 0;
var currentOnes = 0;
var currentTwos = 0;

for(var i = 0; i < rawInput.length; i++) {
	if (rawInput[i] == 0) {
		currentZeroes++;
	}
	if (rawInput[i] == 1) {
		currentOnes++;
	}
	if (rawInput[i] == 2) {
		currentTwos++;
	}

	if ((i % (width*height)) == ((width*height)-1)) {
		if (currentZeroes < fewestZeroDigits) {
			fewestZeroDigits = currentZeroes;
			answer = currentOnes*currentTwos;
		}
		currentZeroes = 0;
		currentOnes = 0;
		currentTwos = 0;
	}
}

console.log(answer);